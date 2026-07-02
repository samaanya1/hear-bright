import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { seoRoutes } from "@/lib/seo-routes";
import { Button } from "@/components/ui/button";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRazorpay } from "@/hooks/useRazorpay";

const presets = [500, 1000, 2500, 5000];

const Donate = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [loading, setLoading] = useState(false);
  const { openCheckout } = useRazorpay();

  const submit = async () => {
    const final = custom ? Number(custom) : amount;
    if (!final || final < 100) {
      toast.error("Please enter an amount of ₹100 or more.");
      return;
    }

    setLoading(true);
    try {
      await openCheckout({
        amount: final * 100,
        description: frequency === "monthly" ? "Monthly Donation" : "One-time Donation",
        onSuccess(paymentId) {
          toast.success(
            `Thank you! Your ${frequency === "monthly" ? "monthly" : "one-time"} gift of ₹${final.toLocaleString()} was received. Payment ID: ${paymentId}`
          );
        },
        onDismiss() {
          toast.info("Payment was cancelled.");
        },
        onError(message) {
          toast.error(message);
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo {...seoRoutes["/donate"]} />
      <PageHero
        eyebrow="Donate"
        title="Your support builds the road."
        description="Every contribution helps us reach one more family with the information and community they need."
      />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10">
              {/* Frequency */}
              <div className="flex gap-2 rounded-full bg-muted p-1">
                {(["once", "monthly"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={cn(
                      "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-smooth capitalize",
                      frequency === f ? "bg-background text-foreground shadow-soft" : "text-muted-foreground",
                    )}
                  >
                    {f === "once" ? "One-time" : "Monthly"}
                  </button>
                ))}
              </div>

              {/* Presets */}
              <div className="mt-8">
                <p className="text-sm font-medium text-foreground">Choose an amount</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {presets.map((p) => (
                    <button
                      key={p}
                      onClick={() => { setAmount(p); setCustom(""); }}
                      className={cn(
                        "rounded-2xl border-2 px-4 py-4 font-serif text-xl transition-smooth",
                        amount === p && !custom
                          ? "border-accent bg-accent-soft text-accent"
                          : "border-border bg-background hover:border-accent/40",
                      )}
                    >
                      ₹{p.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium text-foreground">Or enter another amount</label>
                <div className="mt-2 flex items-center gap-2 rounded-full border-2 border-border bg-background px-5 py-3 focus-within:border-accent">
                  <span className="font-serif text-lg text-muted-foreground">₹</span>
                  <input
                    type="number"
                    min={100}
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <Button variant="hero" size="xl" className="mt-8 w-full" onClick={submit} disabled={loading}>
                <Heart className="h-4 w-4" />
                {loading ? "Opening payment…" : `Donate ${custom ? `₹${custom}` : `₹${amount.toLocaleString()}`}`}
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Secure payments. We never store your card details.
              </p>
            </div>
          </div>

          <aside className="space-y-6 md:col-span-2">
            <div className="rounded-3xl bg-primary p-7 text-primary-foreground shadow-soft">
              <Sparkles className="h-6 w-6" />
              <h3 className="mt-3 font-serif text-2xl">Where your gift goes</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-primary-foreground/85">
<li>· Free awareness workshops</li>
                <li>· Educational resources for families</li>
                <li>· Outreach in under-served regions</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-card p-7">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-serif text-xl">Trust & transparency</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We publish annual updates of how donations are used. Have a question?
                Just write to us.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default Donate;
