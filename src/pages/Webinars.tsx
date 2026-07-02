import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { seoRoutes } from "@/lib/seo-routes";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import { CalendarDays, ExternalLink, Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Webinar = {
  id: string;
  title: string;
  speaker: string | null;
  date: string | null;
  description: string | null;
  link: string | null;
  image_url: string | null;
};

async function fetchWebinars() {
  const { data, error } = await supabase
    .from("webinars")
    .select("*")
    .order("date", { ascending: true, nullsFirst: false });
  if (error) throw error;
  return data as Webinar[];
}

export async function loader() {
  try {
    return await fetchWebinars();
  } catch {
    return null;
  }
}

const Webinars = () => {
  const loaderData = useLoaderData() as Webinar[] | null;
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["webinars"],
    queryFn: fetchWebinars,
    initialData: loaderData ?? undefined,
  });

  return (
    <>
      <Seo {...seoRoutes["/webinars"]} />
      <PageHero
        eyebrow="Webinars"
        title="Learn. Connect. Grow."
        description="Free sessions for families, caregivers, and anyone curious about hearing disability."
      />

      <section className="mx-auto max-w-5xl px-6 py-20">
        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-24 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p>Loading webinars…</p>
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            Could not load webinars right now. Please check back soon.
          </div>
        )}

        {!isLoading && !isError && data.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <Mic className="h-10 w-10 text-accent" />
            <p className="font-serif text-2xl">No webinars scheduled yet.</p>
            <p className="text-muted-foreground">Check back soon — we're planning something great.</p>
          </div>
        )}

        {!isLoading && !isError && data.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {data.map((w) => (
              <div
                key={w.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant"
              >
                {w.image_url && (
                  <img
                    src={w.image_url}
                    alt={w.title}
                    className="h-44 w-full object-cover"
                  />
                )}
                <div className="p-7">
                {w.speaker && (
                  <p className="text-xs font-medium uppercase tracking-widest text-accent">
                    With {w.speaker}
                  </p>
                )}
                <h3 className="mt-2 font-serif text-2xl">{w.title}</h3>
                {w.date && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    {new Date(w.date).toLocaleDateString("en-IN", { dateStyle: "long" })}
                  </div>
                )}
                {w.description && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {w.description}
                  </p>
                )}
                {w.link && (
                  <Button asChild variant="soft" size="sm" className="mt-5">
                    <a href={w.link} target="_blank" rel="noopener noreferrer">
                      Register <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Webinars;
