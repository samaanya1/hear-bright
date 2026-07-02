import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { seoRoutes } from "@/lib/seo-routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const FORMSPREE_URL = "https://formspree.io/f/mjgzajrd";

const schema = z.object({
  name: z.string().trim().min(1, "Please share your name.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(255),
  phone: z.string().trim().max(20).optional(),
  role: z.string().trim().max(60).optional(),
  message: z.string().trim().min(1, "A short message helps us help you.").max(1000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Thank you! We'll get back to you within 2 working days.");
      setForm({ name: "", email: "", phone: "", role: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please email us directly at info@samaanyafoundation.com");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo {...seoRoutes["/contact"]} />
      <PageHero
        eyebrow="Contact / Get help"
        title="We're here to listen."
        description="Whether you're seeking guidance for your family or want to work with us — write to us. There are no wrong questions."
      />

      <section className="mx-auto max-w-6xl overflow-x-hidden px-6 py-20">
        <div className="grid gap-10 md:grid-cols-5">
          <aside className="space-y-6 md:col-span-2">
            <div className="rounded-3xl border border-border bg-card p-7">
              <Mail className="h-5 w-5 text-accent" />
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Email</p>
              <a href="mailto:info@samaanyafoundation.com" className="mt-1 block break-all font-serif text-xl hover:text-accent">
                info@samaanyafoundation.com
              </a>
            </div>
            <div className="rounded-3xl bg-primary-soft p-7">
              <MapPin className="h-5 w-5 text-primary" />
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-primary/80">Based in</p>
              <p className="mt-1 font-serif text-xl text-primary">India</p>
              <p className="mt-1 text-xs text-primary/70">Working nationally, online & in-person.</p>
            </div>
          </aside>

          <form
            onSubmit={submit}
            className="space-y-5 rounded-3xl border border-border bg-card p-8 shadow-soft md:col-span-3 md:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={255}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={20}
                />
              </div>
              <div>
                <Label htmlFor="role">I am a…</Label>
                <Input
                  id="role"
                  placeholder="parent, individual, educator..."
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  maxLength={60}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message">How can we help? *</Label>
              <Textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
              />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
              ) : (
                "Send message"
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Your details stay private. We reply within 2 working days.
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
