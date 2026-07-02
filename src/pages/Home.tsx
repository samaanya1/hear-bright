import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { seoRoutes } from "@/lib/seo-routes";
import heroImg from "@/assets/hero-family.jpg";
import communityImg from "@/assets/community.jpg";
import joyImg from "@/assets/child-ci.jpg";
import leaf from "@/assets/leaf.png";

const Home = () => {
  return (
    <>
      <Seo {...seoRoutes["/"]} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-6 fade-in-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Samaanya Foundation
            </p>
            <h1 className="font-serif text-5xl leading-[1.05] text-balance text-foreground md:text-7xl">
              You are not <em className="text-accent not-italic">alone</em> on this journey.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Samaanya Foundation supports families and individuals navigating hearing disability in
              India — through awareness, guidance, and a community that understands.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/contact">Get help <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="soft" size="lg">
                <Link to="/about">Our story</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/donate">Donate</Link>
              </Button>
            </div>
          </div>

          <div className="relative md:col-span-6">
            <img
              src={heroImg}
              alt="A mother holding her young child who wears a cochlear implant"
              width={1600}
              height={1200}
              className="aspect-[5/4] w-full rounded-3xl object-cover shadow-elegant"
            />
            <img
              src={leaf}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -left-10 -top-10 hidden h-32 w-32 opacity-70 md:block"
            />
            <div className="absolute -bottom-6 -left-6 hidden max-w-[240px] rounded-2xl border border-border bg-card p-5 shadow-soft md:block">
              <p className="font-serif text-2xl text-primary">“Access, not charity.”</p>
              <p className="mt-1 text-xs text-muted-foreground">— Samay Tulsyan, Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION STRIP */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container-narrow py-16 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Our purpose</p>
          <h2 className="mt-3 font-serif text-3xl text-balance md:text-5xl">
            Building a support system for families who don't know where to begin.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Founded by someone who has lived this journey, Samaanya Foundation focuses on awareness,
            information, and dignity — for everyone touched by hearing loss.
          </p>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">What we do</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">Three ways we help</h2>
          </div>
          <Link to="/programs" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent">
            All programs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Heart,
              title: "Family guidance",
              text: "One-on-one support for parents who've just received a diagnosis — what to ask, where to go, what to expect.",
            },
            {
              icon: BookOpen,
              title: "Awareness & education",
              text: "Workshops, resources and conversations that demystify hearing loss for schools, workplaces, and society.",
            },
          ].map((c) => (
            <div key={c.title} className="group rounded-2xl border border-border bg-card p-8 transition-smooth hover:-translate-y-1 hover:shadow-soft">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-serif text-2xl">{c.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY NOW — we're just getting started */}
      <section className="gradient-warm">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <img
            src={communityImg}
            alt="Indian families gathered together at a community event"
            width={1400}
            height={1000}
            loading="lazy"
            className="aspect-[5/4] w-full rounded-3xl object-cover shadow-elegant"
          />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">We're just getting started</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">A new foundation. A long road ahead.</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Samaanya Foundation was founded in 2026 — born out of personal experience and a belief
              that no Indian family should have to navigate hearing disability alone.
              We're building this from the ground up, one conversation, one family,
              one workshop at a time. Your support shapes what comes next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/programs">See our programs</Link>
              </Button>
              <Button asChild variant="soft" size="lg">
                <Link to="/fundraisers">Help a family</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER VOICE */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <img
              src={joyImg}
              alt="A child laughing joyfully with a cochlear implant"
              width={1200}
              height={1400}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-elegant"
            />
          </div>
          <div className="flex flex-col justify-center md:col-span-7">
            <Sparkles className="h-8 w-8 text-accent" />
            <blockquote className="mt-5 font-serif text-3xl leading-snug text-balance md:text-4xl">
              “True inclusion begins when society learns to listen beyond a disability.”
            </blockquote>
            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-muted-foreground">
              — Samay Tulsyan, Founder
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Samaanya Foundation was born from lived experience — of rejection, of working twice as
              hard, and of the belief that people with hearing disabilities deserve dignity,
              confidence, and equal opportunities, not pity.
            </p>
            <div className="mt-8">
              <Button asChild variant="warm" size="lg">
                <Link to="/about">Read our full story <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl bg-primary px-8 py-16 text-center shadow-elegant md:px-16 md:py-20">
          <h2 className="font-serif text-4xl text-primary-foreground md:text-5xl">
            Be part of the journey.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
            Whether you're a parent looking for answers, a volunteer who wants to help, or
            a donor who believes in dignity — there's a place for you here.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/donate">Donate</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/contact">Join us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
