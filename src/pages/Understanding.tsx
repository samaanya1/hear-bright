import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { seoRoutes } from "@/lib/seo-routes";
import { Ear, Clock, Heart, Users } from "lucide-react";

const Understanding = () => {
  return (
    <>
      <Seo {...seoRoutes["/understanding"]} />
      <PageHero
        eyebrow="Understanding hearing disability"
        title="Knowing more, fearing less."
        description="A simple, honest introduction for families who are just starting to understand hearing loss."
      />

      <section className="container-narrow py-20">
        <div className="space-y-16">
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Ear className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-serif text-3xl md:text-4xl">What is hearing loss?</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Hearing loss means the ear isn't able to detect or process sound the way it
              typically would. It can be present from birth or develop over time. It can be
              mild, profound, or anywhere in between — and it can affect one or both ears.
              Hearing loss is not an illness. It is a difference, and there is a great deal
              that can be done to support a person who lives with it.
            </p>
          </div>

          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Heart className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-serif text-3xl md:text-4xl">What families often feel</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              When a child is diagnosed, parents often feel overwhelmed — by medical terms,
              by decisions, by the worry of what the future holds. These feelings are
              normal. You are not alone in them, and you don't need to have all the answers
              right away.
            </p>
            <ul className="mt-6 space-y-3 text-lg text-foreground/85">
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> Confusion about which professional to see first</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> Pressure to decide between hearing aids, implants, sign language, or a mix</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> Worries about school, friendships, and the long-term future</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> Cost, access to good clinicians, and travel</li>
            </ul>
          </div>

          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Clock className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-serif text-3xl md:text-4xl">Why early support matters</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              The earlier a family receives accurate information and support, the more
              options they have. Early identification, consistent listening practice, and a
              supportive environment can make a meaningful difference in a child's
              communication, education, and confidence.
            </p>
          </div>

          <div className="rounded-3xl bg-primary p-10 text-primary-foreground shadow-elegant">
            <Users className="h-8 w-8" />
            <h3 className="mt-4 font-serif text-2xl md:text-3xl">You don't have to figure this out alone.</h3>
            <p className="mt-3 leading-relaxed text-primary-foreground/85">
              Reach out to us — we'll help you understand your next steps, connect you with
              other families, and point you to professionals you can trust.
            </p>
            <a href="/contact" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-smooth hover:bg-accent/90">Talk to us</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Understanding;
