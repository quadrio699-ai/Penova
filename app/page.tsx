import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Atmosphere from "@/components/ui/Atmosphere";
import PlayDoodles from "@/components/ui/PlayDoodles";
import Hero from "@/components/sections/Hero";
import PathwayStrip from "@/components/sections/PathwayStrip";
import EcosystemGrid from "@/components/sections/EcosystemGrid";
import ImpactStats from "@/components/sections/ImpactStats";
import Testimonials from "@/components/sections/Testimonials";
import CTASection from "@/components/sections/CTASection";
import { bigIdea, whatIsPenova, hero } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="sheet isolate overflow-hidden bg-paper py-20 md:py-28">
        <Atmosphere doodles="bigIdea" />
        <PlayDoodles set="bigIdea" />
        <Container>
          <SectionHeading eyebrow={bigIdea.eyebrow} title={bigIdea.headline} />
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <div className="space-y-5 text-ink/75">
              {bigIdea.paragraphs.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            <div className="flex flex-col justify-center gap-4 border-l border-canopy/15 pl-8">
              <p className="text-sm text-ink/60">Our pathway</p>
              <PathwayStrip steps={bigIdea.pathway} />
            </div>
          </div>
          <p className="mt-10 max-w-2xl text-lg text-ink/70">
            {hero.body}
          </p>
        </Container>
      </section>

      <section className="relative isolate overflow-hidden bg-canopy-50/60 py-20 md:py-28">
        <Atmosphere doodles="whatIs" />
        <PlayDoodles set="whatIs" />
        <Container>
          <SectionHeading title={whatIsPenova.headline} body={whatIsPenova.intro} />
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {whatIsPenova.cutsAcross.map((item) => (
              <li
                key={item}
                className="rounded-sm bg-white px-3 py-1.5 text-sm text-ink/75 shadow-layer-1"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 font-display text-xl text-canopy">{whatIsPenova.why}</p>
        </Container>
      </section>

      <section className="relative isolate overflow-hidden py-20 md:py-28">
        <Atmosphere doodles="ecosystem" />
        <PlayDoodles set="ecosystem" />
        <Container>
          <SectionHeading
            eyebrow="Our ecosystem"
            title="One ecosystem. Multiple pathways."
            body="PENOVA operates through interconnected platforms designed to meet people at different stages of their journey."
          />
        </Container>
        <div className="mt-10">
          <Container>
            <EcosystemGrid />
          </Container>
        </div>
      </section>

      <section className="relative isolate overflow-hidden py-20 md:py-28">
        <Atmosphere doodles="impact" />
        <PlayDoodles set="impact" />
        <Container>
          <SectionHeading eyebrow="PENOVA in numbers" title="Our impact" />
          <div className="mt-10">
            <ImpactStats />
          </div>
        </Container>
      </section>

      <section className="relative isolate overflow-hidden bg-canopy-50/60 py-20 md:py-28">
        <Atmosphere doodles="testimonials" />
        <PlayDoodles set="testimonials" />
        <Container>
          <SectionHeading title="What people are saying" />
          <div className="mt-10">
            <Testimonials />
          </div>
        </Container>
      </section>

      <CTASection
        headline="Don't just watch opportunities pass by."
        body="Build where opportunities can find you."
        cta={{ label: "Join PENOVA", href: "/community" }}
      />
    </>
  );
}
