import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    fundraiser_id,
    donor_name,
    donor_email,
  } = req.body ?? {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ error: "Missing required payment fields" });
    return;
  }

  const KEY_ID = process.env.RAZORPAY_KEY_ID?.trim();
  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!KEY_ID || !KEY_SECRET) {
    res.status(500).json({ error: "Razorpay credentials are not configured on the server" });
    return;
  }

  const expectedSignature = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expectedSignature, "hex");
  const providedBuf = Buffer.from(String(razorpay_signature), "hex");
  const signatureValid =
    expectedBuf.length === providedBuf.length && crypto.timingSafeEqual(expectedBuf, providedBuf);

  if (!signatureValid) {
    res.status(400).json({ error: "Payment signature verification failed" });
    return;
  }

  // Fetch the payment directly from Razorpay so the recorded amount comes from the
  // gateway, never from the client — the signature only proves order_id/payment_id
  // are an authentic pair, it says nothing about the amount that was actually captured.
  let verifiedAmountRupees = null;
  try {
    const credentials = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
    const paymentRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      headers: { Authorization: `Basic ${credentials}` },
    });
    const payment = await paymentRes.json();

    if (
      !paymentRes.ok ||
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured"
    ) {
      console.error("[verify-payment] Razorpay payment check failed:", payment);
      res.status(400).json({ error: "Payment could not be verified with Razorpay" });
      return;
    }

    verifiedAmountRupees = payment.amount / 100;
  } catch (err) {
    console.error("[verify-payment] Razorpay payment lookup error:", err);
    res.status(502).json({ error: "Could not confirm payment with Razorpay. Please contact us with your payment ID." });
    return;
  }

  // Record donation in Supabase atomically via RPC
  if (fundraiser_id) {
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/record_donation`, {
          method: "POST",
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            p_fundraiser_id: fundraiser_id,
            p_amount: verifiedAmountRupees,
            p_donor_name: donor_name || null,
            p_donor_email: donor_email || null,
            p_payment_id: razorpay_payment_id,
            p_order_id: razorpay_order_id,
          }),
        });

        if (!response.ok) {
          const err = await response.text();
          console.error("[verify-payment] Supabase RPC error:", err);
        }
      } catch (err) {
        // Payment is verified — don't fail the response if recording fails
        console.error("[verify-payment] Supabase recording error:", err);
      }
    } else {
      console.warn("[verify-payment] SUPABASE_SERVICE_ROLE_KEY not set — donation not recorded");
    }
  }

  res.status(200).json({ verified: true, payment_id: razorpay_payment_id });
}
