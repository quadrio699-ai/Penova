import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Atmosphere from "@/components/ui/Atmosphere";
import PlayDoodles from "@/components/ui/PlayDoodles";

export default function CTASection({
  headline,
  body,
  cta,
}: {
  headline: string;
  body?: string;
  cta: { label: string; href: string };
}) {
  return (
    // `sheet` (see globals.css) slides this section ~2rem over the one above it.
    <section className="sheet isolate overflow-hidden bg-canopy-800 text-canopy-50">
      <Atmosphere tone="dark" doodles="cta" />
      <PlayDoodles set="cta" tone="dark" />
      <Container className="flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-white">{headline}</h2>
          {body && <p className="mt-3 text-canopy-100">{body}</p>}
        </div>
        <Button href={cta.href} variant="primary">
          {cta.label}
        </Button>
      </Container>
    </section>
  );
}
