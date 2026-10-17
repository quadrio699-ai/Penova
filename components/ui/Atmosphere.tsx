import type { CSSProperties } from "react";
import { shapes, type Kind } from "./doodleShapes";

/**
 * Atmosphere = a soft fog layer + hand-drawn doodles for a section background.
 *
 * Usage: make the section `relative isolate overflow-hidden`, then put this as
 * its first child:
 *
 *   <section className="relative isolate overflow-hidden py-20 md:py-28">
 *     <Atmosphere doodles="bigIdea" />
 *     <Container>...</Container>
 *   </section>
 *
 * On dark sections pass tone="dark". Everything is decorative (aria-hidden,
 * pointer-events none), sits behind content, and is mostly hidden on small
 * screens so phones stay clean. Motion is slow and switches off for
 * prefers-reduced-motion (see globals.css).
 */

type Tone = "line" | "gold" | "accent";
type Breakpoint = "all" | "md" | "lg";

type Item = {
  kind?: Kind;
  text?: string;
  from?: "left" | "right";
  x: string;
  y: string;
  anchor?: "top" | "bottom";
  size?: number; // doodle width in px, or font size in px for text
  rot?: number;
  tone?: Tone;
  bp?: Breakpoint;
  float?: boolean;
};

export type PresetName =
  | "hero"
  | "bigIdea"
  | "whatIs"
  | "ecosystem"
  | "impact"
  | "testimonials"
  | "cta"
  | "generalA"
  | "generalB"
  | "generalC";

const presets: Record<PresetName, Item[]> = {
  hero: [
    { kind: "bulb", from: "right", x: "30%", y: "56px", size: 64, rot: 10, tone: "gold", float: true, bp: "md" },
    { kind: "bulb", from: "right", x: "6%", y: "18px", size: 40, rot: 10, tone: "gold", bp: "all" },
    { text: "learn · build · grow", x: "5%", y: "16px", anchor: "bottom", size: 24, rot: -2, tone: "line", bp: "all" },
    { text: "from potential to impact", from: "right", x: "6%", y: "34px", size: 30, rot: -5, tone: "line" },
    { kind: "spark", from: "right", x: "4%", y: "46%", size: 40, tone: "gold", float: true },
    { kind: "compass", x: "47%", y: "26px", size: 52, rot: -12, tone: "line", bp: "lg" },
    { kind: "squiggle", x: "4%", y: "22px", anchor: "bottom", size: 90, tone: "line", bp: "md" },
  ],
  bigIdea: [
    { kind: "sprout", x: "2%", y: "20px", size: 44, rot: -6, tone: "line", bp: "all" },
    { kind: "book", from: "right", x: "3%", y: "28px", size: 70, rot: 8, tone: "line", float: true },
    { text: "potential is everywhere", from: "right", x: "14%", y: "96px", size: 28, rot: -4, tone: "accent", bp: "lg" },
    { text: "learn · build · connect", x: "3%", y: "26px", anchor: "bottom", size: 26, rot: -2, tone: "line", bp: "all" },
    { kind: "key", from: "right", x: "5%", y: "30px", anchor: "bottom", size: 56, rot: -14, tone: "gold", float: true, bp: "md" },
    { text: "access matters", from: "right", x: "15%", y: "44px", anchor: "bottom", size: 26, rot: 3, tone: "accent", bp: "lg" },
    { kind: "spark", from: "right", x: "6%", y: "18px", anchor: "bottom", size: 34, tone: "gold", bp: "all" },
  ],
  whatIs: [
    { kind: "loop", from: "right", x: "5%", y: "18px", size: 40, tone: "gold", bp: "all" },
    { kind: "cap", from: "right", x: "4%", y: "30px", size: 66, rot: 12, tone: "line", float: true, bp: "md" },
    { text: "ask questions", from: "right", x: "15%", y: "100px", size: 28, rot: -5, tone: "accent", bp: "lg" },
    { kind: "pencil", x: "3%", y: "24px", anchor: "bottom", size: 60, rot: -20, tone: "line", bp: "md" },
    { text: "find your people", x: "12%", y: "34px", anchor: "bottom", size: 26, rot: -3, tone: "gold", bp: "all" },
    { kind: "chat", from: "right", x: "6%", y: "26px", anchor: "bottom", size: 54, rot: 6, tone: "line", bp: "md" },
  ],
  ecosystem: [
    { kind: "compass", from: "right", x: "6%", y: "44px", size: 80, rot: 10, tone: "line", float: true },
    { text: "one ecosystem, many paths", from: "right", x: "16%", y: "150px", size: 30, rot: -4, tone: "accent", bp: "lg" },
    { kind: "spark", from: "right", x: "2%", y: "150px", size: 38, tone: "gold", bp: "lg" },
    { kind: "stairs", x: "3%", y: "28px", anchor: "bottom", size: 84, tone: "line", bp: "md" },
    { text: "keep growing", x: "16%", y: "40px", anchor: "bottom", size: 26, rot: -3, tone: "accent", bp: "all" },
    { kind: "sprout", from: "right", x: "6%", y: "20px", anchor: "bottom", size: 48, rot: 8, tone: "gold", bp: "all" },
  ],
  impact: [
    { kind: "spark", x: "2%", y: "22px", size: 36, tone: "gold", bp: "all" },
    { kind: "bulb", from: "right", x: "5%", y: "34px", size: 62, rot: 8, tone: "gold", float: true, bp: "md" },
    { text: "numbers tell part of the story", from: "right", x: "12%", y: "112px", size: 26, rot: -3, tone: "accent", bp: "lg" },
    { kind: "stairs", from: "right", x: "4%", y: "28px", anchor: "bottom", size: 100, tone: "line", bp: "md" },
    { text: "small steps, real impact", from: "right", x: "6%", y: "150px", anchor: "bottom", size: 30, rot: -5, tone: "accent", bp: "lg" },
    { kind: "squiggle", x: "3%", y: "30px", anchor: "bottom", size: 90, tone: "line", bp: "lg" },
  ],
  testimonials: [
    { kind: "spark", from: "right", x: "8%", y: "26px", anchor: "bottom", size: 40, tone: "gold", bp: "all" },
    { kind: "chat", from: "right", x: "6%", y: "34px", size: 68, rot: -6, tone: "line", float: true, bp: "md" },
    { text: "real people, real stories", from: "right", x: "15%", y: "108px", size: 28, rot: -4, tone: "accent", bp: "lg" },
    { kind: "squiggle", x: "4%", y: "30px", anchor: "bottom", size: 100, tone: "gold", bp: "md" },
    { text: "your story could be next", x: "14%", y: "28px", anchor: "bottom", size: 26, rot: -2, tone: "accent", bp: "all" },
  ],
  cta: [
    { kind: "spark", x: "3%", y: "14px", size: 34, tone: "gold", bp: "all" },
    { text: "your move", from: "right", x: "24%", y: "20px", size: 30, rot: -6, tone: "line", bp: "lg" },
    { kind: "arrow", from: "right", x: "17%", y: "64px", size: 64, tone: "gold", bp: "lg" },
    { kind: "compass", from: "right", x: "3%", y: "18px", anchor: "bottom", size: 48, rot: 12, tone: "line", bp: "lg" },
  ],
  generalA: [
    { kind: "bulb", from: "right", x: "5%", y: "30px", size: 60, rot: 8, tone: "gold", float: true },
    { text: "ideas welcome", from: "right", x: "14%", y: "100px", size: 28, rot: -4, tone: "accent", bp: "lg" },
    { kind: "pencil", x: "3%", y: "24px", anchor: "bottom", size: 56, rot: -18, tone: "line", bp: "md" },
  ],
  generalB: [
    { kind: "book", from: "right", x: "5%", y: "30px", size: 64, rot: 8, tone: "line", float: true },
    { text: "keep learning", from: "right", x: "14%", y: "100px", size: 28, rot: -4, tone: "accent", bp: "lg" },
    { kind: "sprout", x: "3%", y: "24px", anchor: "bottom", size: 52, rot: -6, tone: "gold", bp: "md" },
  ],
  generalC: [
    { kind: "compass", from: "right", x: "5%", y: "30px", size: 66, rot: 10, tone: "line", float: true },
    { text: "find your way", from: "right", x: "14%", y: "100px", size: 28, rot: -4, tone: "accent", bp: "lg" },
    { kind: "stairs", x: "3%", y: "24px", anchor: "bottom", size: 76, tone: "line", bp: "md" },
  ],
};

const bpClass: Record<Breakpoint, string> = {
  all: "",
  md: "hidden md:block",
  lg: "hidden lg:block",
};

const toneClass: Record<"light" | "dark", Record<Tone, string>> = {
  light: {
    line: "text-canopy/40",
    gold: "text-gold-700/45",
    accent: "text-clay/50",
  },
  dark: {
    line: "text-canopy-200/45",
    gold: "text-gold/60",
    accent: "text-gold-300/55",
  },
};

const fogColors = {
  light: [
    "rgba(127,177,216,0.30)",
    "rgba(173,208,236,0.55)",
    "rgba(232,163,61,0.10)",
  ],
  dark: [
    "rgba(127,177,216,0.22)",
    "rgba(78,145,195,0.28)",
    "rgba(232,163,61,0.08)",
  ],
};

// Bigger doodles read as nearer, so they travel further as you scroll.
function shiftFor(item: Item): number {
  return Math.min(Math.max(Math.round((item.size ?? 40) * 0.55), 18), 56);
}

function placement(item: Item): CSSProperties {
  const style: CSSProperties = {
    transform: `rotate(${item.rot ?? 0}deg)`,
  };
  if (item.from === "right") style.right = item.x;
  else style.left = item.x;
  if (item.anchor === "bottom") style.bottom = item.y;
  else style.top = item.y;
  if (!item.text) style.width = item.size ?? 56;
  return style;
}

export default function Atmosphere({
  tone = "light",
  doodles,
  fog = true,
}: {
  tone?: "light" | "dark";
  doodles?: PresetName;
  fog?: boolean;
}) {
  const items = doodles ? presets[doodles] : [];
  const [c1, c2, c3] = fogColors[tone];

  return (
    <>
      {fog && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div
            className="fog-drift absolute -left-[12%] -top-[10%] h-[75%] w-[60%]"
            style={{ background: `radial-gradient(closest-side, ${c1}, transparent)` }}
          />
          <div
            className="fog-drift-slow absolute -bottom-[15%] -right-[10%] h-[80%] w-[60%]"
            style={{ background: `radial-gradient(closest-side, ${c2}, transparent)` }}
          />
          <div
            className="fog-drift absolute left-[35%] top-[30%] h-[45%] w-[35%]"
            style={{ background: `radial-gradient(closest-side, ${c3}, transparent)` }}
          />
        </div>
      )}

      {items.length > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          {items.map((item, i) => {
            const shape = item.kind ? shapes[item.kind] : null;
            return (
              <div
                key={i}
                className={`absolute ${bpClass[item.bp ?? "md"]} ${
                  toneClass[tone][item.tone ?? "line"]
                }`}
                style={placement(item)}
              >
                <div
                  className="doodle-parallax"
                  style={{ "--shift": shiftFor(item) } as CSSProperties}
                >
                <div
                  className={item.float ? "doodle-float" : undefined}
                  style={item.float ? { animationDelay: `${(i * 1.3) % 6}s` } : undefined}
                >
                  {shape ? (
                    <svg
                      viewBox={shape.vb}
                      width="100%"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ display: "block", overflow: "visible" }}
                    >
                      {shape.d.map((d) => (
                        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
                      ))}
                    </svg>
                  ) : (
                    <span
                      className="block whitespace-nowrap font-hand leading-none"
                      style={{ fontSize: item.size ?? 28 }}
                    >
                      {item.text}
                    </span>
                  )}
                </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
