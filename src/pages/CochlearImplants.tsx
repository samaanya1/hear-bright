import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { seoRoutes } from "@/lib/seo-routes";
import { Check, X } from "lucide-react";
import audiologistImg from "@/assets/audiologist.jpg";

const myths = [
  { myth: "Cochlear implants restore 'normal' hearing.", fact: "They provide a different kind of hearing — useful and powerful, but it takes time and therapy to learn to use it well." },
  { myth: "Implants are only for children.", fact: "Adults of all ages can benefit. Eligibility depends on the type and degree of hearing loss." },
  { myth: "Once implanted, no more support is needed.", fact: "The implant is the start. Speech therapy, mapping sessions, and family support shape outcomes." },
  { myth: "Sign language is no longer needed.", fact: "Many families choose a combination — sign and spoken language are not in opposition." },
];

const CochlearImplants = () => {
  return (
    <>
      <Seo {...seoRoutes["/cochlear-implants"]} />
      <PageHero
        eyebrow="Cochlear implants"
        title="A clear, honest guide."
        description="What they are, who they help, and what life with one really looks like — without the jargon."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <img
            src={audiologistImg}
            alt="An audiologist fitting a cochlear implant on a young patient"
            width={1400}
            height={1000}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-elegant"
          />
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">What is a cochlear implant?</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              A cochlear implant is a small electronic device that helps a person with
              severe-to-profound hearing loss perceive sound. Unlike a hearing aid, which
              amplifies sound, an implant bypasses damaged parts of the ear and sends
              signals directly to the auditory nerve.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              It has two parts: an external sound processor worn behind the ear, and an
              internal component placed during a surgical procedure.
            </p>
          </div>
        </div>
      </section>

      <section className="gradient-sage border-y border-border">
        <div className="container-narrow py-20">
          <h2 className="text-center font-serif text-3xl md:text-4xl">Who it helps</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-muted-foreground">
            Implants can support children and adults whose hearing loss is significant
            enough that hearing aids no longer provide enough benefit. A qualified audiologist
            and ENT will assess whether an implant is appropriate.
          </p>
        </div>
      </section>

      <section className="container-narrow py-20">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Myths vs facts</p>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl">Clearing things up</h2>

        <div className="mt-10 space-y-5">
          {myths.map((m, i) => (
            <div key={i} className="grid gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-2 md:p-8">
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <X className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Myth</p>
                  <p className="mt-1 font-serif text-lg">{m.myth}</p>
                </div>
              </div>
              <div className="flex gap-4 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Fact</p>
                  <p className="mt-1 leading-relaxed text-foreground/85">{m.fact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="font-serif text-3xl md:text-4xl">The journey after surgery</h2>
        <ol className="mt-8 space-y-6">
          {[
            { step: "01", t: "Healing", d: "A few weeks of recovery before the device is switched on." },
            { step: "02", t: "Activation", d: "The audiologist 'maps' the device — your first day of new sound." },
            { step: "03", t: "Therapy", d: "Speech and listening therapy helps the brain learn to interpret sound." },
            { step: "04", t: "Daily life", d: "School, friendships, work — life continues, with new tools and new confidence." },
          ].map((s) => (
            <li key={s.step} className="flex gap-6 rounded-2xl border border-border bg-card p-6">
              <span className="font-serif text-3xl text-accent">{s.step}</span>
              <div>
                <h3 className="font-serif text-xl">{s.t}</h3>
                <p className="mt-1 text-muted-foreground">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
};

export default CochlearImplants;
