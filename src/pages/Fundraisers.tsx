import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { seoRoutes } from "@/lib/seo-routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useRazorpay } from "@/hooks/useRazorpay";

type Fundraiser = {
  id: string;
  slug: string;
  name: string;
  age: number;
  city: string;
  need: string;
  story: string;
  goal: number;
  raised: number;
  donors: number;
  image_url: string | null;
  video_url: string | null;
};

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) || url.includes("supabase.co/storage");
}

function MediaBlock({ image_url, video_url }: { image_url: string | null; video_url: string | null }) {
  if (!image_url && !video_url) return null;
  const embedUrl = video_url ? getYouTubeEmbedUrl(video_url) : null;
  const directVideo = video_url && isDirectVideo(video_url);
  return (
    <div className="mb-5 overflow-hidden rounded-2xl bg-muted">
      {image_url && !video_url && (
        <img src={image_url} alt="Fundraiser" className="h-44 w-full object-cover" />
      )}
      {video_url && embedUrl && (
        <iframe
          src={embedUrl}
          className="h-44 w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      {video_url && directVideo && (
        <video src={video_url} controls className="h-44 w-full object-cover" />
      )}
      {video_url && !embedUrl && !directVideo && image_url && (
        <img src={image_url} alt="Fundraiser" className="h-44 w-full object-cover" />
      )}
    </div>
  );
}

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

async function fetchFundraisers() {
  const { data, error } = await supabase
    .from("fundraisers")
    .select("*")
    .order("created_at");
  if (error) throw error;
  return data as Fundraiser[];
}

export async function loader() {
  try {
    return await fetchFundraisers();
  } catch {
    return null;
  }
}

const Fundraisers = () => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Fundraiser | null>(null);
  const [amount, setAmount] = useState<string>("1000");
  const [donor, setDonor] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const { openCheckout } = useRazorpay();

  const loaderData = useLoaderData() as Fundraiser[] | null;
  const { data: list = [], isLoading } = useQuery({
    queryKey: ["fundraisers"],
    queryFn: fetchFundraisers,
    initialData: loaderData ?? undefined,
  });

  const totals = useMemo(
    () => ({
      goal: list.reduce((a, f) => a + f.goal, 0),
      raised: list.reduce((a, f) => a + f.raised, 0),
      donors: list.reduce((a, f) => a + f.donors, 0),
    }),
    [list],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const value = Number(amount);
    if (!value || value < 100) {
      toast.error("Please enter at least ₹100.");
      return;
    }
    if (!donor.name || !donor.email) {
      toast.error("Please share your name and email.");
      return;
    }

    setLoading(true);
    try {
      await openCheckout({
        amount: value * 100,
        description: `Donation for ${selected.name}`,
        fundraiserId: selected.id,
        donorName: donor.name,
        donorEmail: donor.email,
        onSuccess() {
          toast.success(
            `Thank you, ${donor.name}! ₹${inr(value)} added to ${selected!.name}'s fundraiser.`,
          );
          queryClient.invalidateQueries({ queryKey: ["fundraisers"] });
          setSelected(null);
          setAmount("1000");
          setDonor({ name: "", email: "" });
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
      <Seo {...seoRoutes["/fundraisers"]} />
      <PageHero
        eyebrow="Fundraisers"
        title="Real families. Real needs. Real progress."
        description="100% of every contribution goes directly to the family. Every donation updates the bar in real time."
      />

      {/* Totals strip */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-6 px-6 py-10 text-center">
          <div>
            <p className="font-serif text-3xl text-primary md:text-4xl">₹{inr(totals.raised)}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Raised so far</p>
          </div>
          <div>
            <p className="font-serif text-3xl text-accent md:text-4xl">₹{inr(totals.goal)}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Total goal</p>
          </div>
          <div>
            <p className="font-serif text-3xl text-foreground md:text-4xl">{totals.donors}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Donors</p>
          </div>
        </div>
      </section>

      {/* Fundraiser cards */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-3xl border border-border bg-card p-7">
                <div className="h-7 w-2/3 rounded-full bg-muted" />
                <div className="mt-3 h-3.5 w-1/3 rounded-full bg-muted" />
                <div className="mt-5 h-4 w-full rounded-full bg-muted" />
                <div className="mt-3 h-24 w-full rounded-2xl bg-muted" />
                <div className="mt-6 h-2.5 w-full rounded-full bg-muted" />
                <div className="mt-6 h-10 w-full rounded-full bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {list.map((f) => {
              const pct = Math.min(100, Math.round((f.raised / f.goal) * 100));
              return (
                <article
                  key={f.id}
                  className="flex flex-col rounded-3xl border border-border bg-card p-7 transition-smooth hover:-translate-y-1 hover:shadow-soft"
                >
                  <MediaBlock image_url={f.image_url} video_url={f.video_url} />
                  <h3 className="font-serif text-2xl">{f.name}</h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-accent" /> {f.city}
                  </p>
                  <p className="mt-4 text-sm font-medium text-primary">{f.need}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{f.story}</p>

                  {/* Progress */}
                  <div className="mt-6">
                    <div className="flex items-baseline justify-between">
                      <p className="font-serif text-xl text-foreground">₹{inr(f.raised)}</p>
                      <p className="text-xs text-muted-foreground">of ₹{inr(f.goal)}</p>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r from-accent to-highlight transition-all duration-700",
                        )}
                        style={{ width: `${pct}%` }}
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-accent">{pct}% funded</span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" /> {f.donors} donors
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    className="mt-6 w-full"
                    onClick={() => setSelected(f)}
                    disabled={pct >= 100}
                  >
                    <Heart className="h-4 w-4" />
                    {pct >= 100 ? "Fully funded — thank you!" : "Contribute"}
                  </Button>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-16 rounded-3xl border border-border bg-card p-8 text-center md:p-12">
          <h3 className="font-serif text-2xl md:text-3xl">Know a family that needs help?</h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            We help families share their story and raise funds for hearing aids, cochlear implants,
            processors, and therapy. Reach out and we'll guide you through the process.
          </p>
          <Button asChild variant="warm" size="lg" className="mt-6">
            <a href="/contact">Submit a fundraiser request</a>
          </Button>
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              Contribute to {selected?.name}
            </DialogTitle>
            <DialogDescription>{selected?.need}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="d-amount">Amount (₹)</Label>
              <Input
                id="d-amount"
                type="number"
                min={100}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {[500, 1000, 2500, 5000].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(String(p))}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs hover:border-accent hover:text-accent"
                  >
                    ₹{inr(p)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="d-name">Your name</Label>
              <Input
                id="d-name"
                value={donor.name}
                onChange={(e) => setDonor({ ...donor, name: e.target.value })}
                maxLength={100}
                required
              />
            </div>
            <div>
              <Label htmlFor="d-email">Email</Label>
              <Input
                id="d-email"
                type="email"
                value={donor.email}
                onChange={(e) => setDonor({ ...donor, email: e.target.value })}
                maxLength={255}
                required
              />
            </div>
            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={loading}>
              <Heart className="h-4 w-4" />
              {loading ? "Opening payment…" : "Contribute via Razorpay"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Fundraisers;
