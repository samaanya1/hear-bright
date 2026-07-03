import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { seoRoutes } from "@/lib/seo-routes";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import { Heart, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

type Story = {
  id: string;
  name: string;
  age: number | null;
  location: string | null;
  story: string;
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

// Renders **bold** and __underline__ markers written in the admin story editor.
function renderFormattedText(text: string) {
  return text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("__") && part.endsWith("__")) return <u key={i}>{part.slice(2, -2)}</u>;
    return part;
  });
}

// Truncates without cutting a **bold**/__underline__ marker in half.
function truncateText(text: string, length: number) {
  if (text.length <= length) return text;
  let truncated = text.slice(0, length);
  for (const marker of ["**", "__"]) {
    if (truncated.split(marker).length % 2 === 0) {
      truncated = truncated.slice(0, truncated.lastIndexOf(marker));
    }
  }
  return truncated.trimEnd() + "…";
}

const PREVIEW_LENGTH = 160;

function StoryCard({ s }: { s: Story }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = s.story.length > PREVIEW_LENGTH;
  const displayText = expanded || !needsTruncation ? s.story : truncateText(s.story, PREVIEW_LENGTH);

  const embedUrl = s.video_url ? getYouTubeEmbedUrl(s.video_url) : null;
  const directVideo = s.video_url ? isDirectVideo(s.video_url) : false;
  const hasMedia = !!(s.video_url || s.image_url);
  const title = s.age != null ? `${s.name}, ${s.age}` : s.name;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-smooth hover:shadow-elegant">
      {/* Media — full width, no overlaid text so video controls stay clear */}
      {hasMedia && (
        <div className="bg-muted">
          {s.video_url && embedUrl && (
            <iframe
              src={embedUrl}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {s.video_url && directVideo && (
            <video src={s.video_url} controls playsInline className="aspect-video w-full object-cover" />
          )}
          {!s.video_url && s.image_url && (
            <img src={s.image_url} alt={s.name} className="aspect-video w-full object-cover" />
          )}
        </div>
      )}

      <div className="p-6">
        {/* Title — name, age */}
        <div className="mb-3 flex items-start gap-4">
          {!hasMedia && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft font-serif text-xl text-primary">
              {s.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-serif text-xl">{title}</p>
            {s.location && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {s.location}
              </p>
            )}
          </div>
        </div>

        {/* Story text — preserves paragraph breaks and bold/underline markup from the admin editor */}
        <p className="whitespace-pre-line text-justify leading-relaxed text-muted-foreground [text-align-last:left]">
          {renderFormattedText(displayText)}
        </p>

        {needsTruncation && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-sm font-medium text-accent hover:underline underline-offset-2"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
}

async function fetchStories() {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Story[];
}

export async function loader() {
  try {
    return await fetchStories();
  } catch {
    return null;
  }
}

const Stories = () => {
  const loaderData = useLoaderData() as Story[] | null;
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["stories"],
    queryFn: fetchStories,
    initialData: loaderData ?? undefined,
  });

  return (
    <>
      <Seo {...seoRoutes["/stories"]} />
      <PageHero
        eyebrow="Stories"
        title="Real families. Real journeys."
        description="Voices from the community — parents, CI recipients, and caregivers sharing their truth."
      />

      <section className="mx-auto max-w-5xl px-6 py-20">
        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-24 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p>Loading stories…</p>
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            Could not load stories right now. Please check back soon.
          </div>
        )}

        {!isLoading && !isError && data.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <Heart className="h-10 w-10 text-accent" />
            <p className="font-serif text-2xl">Stories coming soon.</p>
            <p className="text-muted-foreground">
              We're collecting voices from the community. Watch this space.
            </p>
          </div>
        )}

        {!isLoading && !isError && data.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2">
            {data.map((s) => <StoryCard key={s.id} s={s} />)}
          </div>
        )}
      </section>
    </>
  );
};

export default Stories;
