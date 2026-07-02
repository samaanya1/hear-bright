import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { seoRoutes } from "@/lib/seo-routes";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Megaphone, Users, Sparkles, Globe, CalendarDays, ExternalLink } from "lucide-react";
import workshopImg from "@/assets/workshop.jpg";

// Replace with your foundation's public Google Calendar ID.
// Find it: Google Calendar → Settings → (your calendar) → "Integrate calendar" → Calendar ID.
// Make sure the calendar's access permissions are set to "Make available to public".
const GOOGLE_CALENDAR_ID = "hello@samaanyafoundation.org";

const programs = [
  {
    icon: Megaphone,
    title: "Awareness campaigns",
    text: "Schools, workplaces, and community talks that demystify hearing disability and challenge everyday assumptions.",
  },
  {
    icon: Users,
    title: "Parent support programs",
    text: "Guided groups where new parents meet experienced ones, share challenges, and find tested resources together.",
  },
  {
    icon: Sparkles,
    title: "Community initiatives",
    text: "Meet-ups, celebrations, and creative projects that build belonging for CI recipients and their families.",
  },
  {
    icon: Globe,
    title: "Towards broader inclusion",
    text: "Future programs that expand into wider disability inclusion, advocacy, and policy conversations.",
  },
];

const Programs = () => {
  const location = useLocation();
  const seo = seoRoutes[location.pathname] ?? seoRoutes["/programs"];
  const calendarSrc = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
    GOOGLE_CALENDAR_ID,
  )}&ctz=Asia%2FKolkata&mode=AGENDA&showTitle=0&showPrint=0&showCalendars=0&showTabs=0`;
  const addToCalendarLink = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(
    GOOGLE_CALENDAR_ID,
  )}`;

  return (
    <>
      <Seo {...seo} />
      <PageHero
        eyebrow="Programs & workshops"
        title="Practical work, rooted in real lives."
        description="Everything we do is shaped by the people we serve — families, recipients, and communities."
      />

      {/* Programs grid */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {programs.map((p) => (
            <article key={p.title} className="rounded-3xl border border-border bg-card p-8 transition-smooth hover:-translate-y-1 hover:shadow-soft">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-serif text-2xl md:text-3xl">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Live calendar of webinars & workshops */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Upcoming sessions</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Webinars & workshops calendar</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Add a webinar in our Google Calendar and it appears here automatically — open to parents, individuals, educators, and anyone curious to learn.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <iframe
            src={calendarSrc}
            title="Samaanya Foundation events calendar"
            className="h-[600px] w-full border-0"
            loading="lazy"
          />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild variant="hero" size="lg">
            <a href={addToCalendarLink} target="_blank" rel="noopener noreferrer">
              <CalendarDays className="mr-2 h-4 w-4" />
              Subscribe to our calendar
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a
              href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(GOOGLE_CALENDAR_ID)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open full calendar <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Programs;
