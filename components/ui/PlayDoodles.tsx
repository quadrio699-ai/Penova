"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { shapes, type Kind } from "./doodleShapes";

/**
 * Interactive doodles: small line drawings you can hover and tap.
 *
 * Hover grows and warms the colour to gold. Click or tap makes the doodle pop
 * (wiggle + a little burst of sparks) and shows a short handwritten line
 * beside it.
 *
 * They only sit in a section's top/bottom padding, so they never cover text,
 * buttons or links. Put one `<PlayDoodles set="..." />` inside a
 * `relative` section. They are toys, not controls, so they are left out of
 * the tab order and hidden from screen readers.
 */

type PlayItem = {
  kind: Kind;
  caption: string;
  from?: "left" | "right";
  x: string;
  y: string;
  anchor?: "top" | "bottom";
  size?: number;
};

export type PlaySet =
  | "hero"
  | "bigIdea"
  | "whatIs"
  | "ecosystem"
  | "impact"
  | "testimonials"
  | "cta";

const sets: Record<PlaySet, PlayItem[]> = {
  hero: [
    { kind: "sprout", caption: "potential grows", x: "52%", y: "22px", anchor: "bottom", size: 46 },
  ],
  bigIdea: [
    { kind: "bulb", caption: "ideas start here", x: "42%", y: "14px", anchor: "bottom", size: 46 },
    { kind: "key", caption: "access opens doors", x: "48%", y: "16px", size: 48 },
  ],
  whatIs: [
    { kind: "pencil", caption: "make your mark", x: "38%", y: "16px", size: 46 },
    { kind: "chat", caption: "let's talk", x: "48%", y: "14px", anchor: "bottom", size: 46 },
  ],
  ecosystem: [
    { kind: "sprout", caption: "grow at your pace", x: "44%", y: "16px", size: 46 },
    { kind: "stairs", caption: "one step at a time", x: "38%", y: "14px", anchor: "bottom", size: 50 },
  ],
  impact: [
    { kind: "spark", caption: "impact, one person at a time", x: "40%", y: "16px", size: 44 },
    { kind: "book", caption: "keep learning", x: "46%", y: "14px", anchor: "bottom", size: 46 },
  ],
  testimonials: [
    { kind: "cap", caption: "your story next?", x: "42%", y: "16px", size: 48 },
    { kind: "bulb", caption: "be inspired", x: "40%", y: "14px", anchor: "bottom", size: 44 },
  ],
  cta: [
    { kind: "compass", caption: "pick a direction", x: "48%", y: "10px", size: 40 },
  ],
};

const SPARKS = 7;

function PlayDoodle({ item, tone }: { item: PlayItem; tone: "light" | "dark" }) {
  const [active, setActive] = useState(false);
  const [burst, setBurst] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const shape = shapes[item.kind];
  const size = item.size ?? 46;

  const position: CSSProperties = { width: size };
  if (item.from === "right") position.right = item.x;
  else position.left = item.x;
  if (item.anchor === "bottom") position.bottom = item.y;
  else position.top = item.y;

  const pop = () => {
    setActive(true);
    setBurst((b) => b + 1);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setActive(false), 2400);
  };

  const colour =
    tone === "dark"
      ? active
        ? "text-gold"
        : "text-canopy-200/60 hover:text-gold"
      : active
        ? "text-gold-700"
        : "text-canopy/55 hover:text-gold-700";

  return (
    <div className="pointer-events-none absolute" style={position}>
      <button
        type="button"
        tabIndex={-1}
        onClick={pop}
        className={`pointer-events-auto block w-full cursor-pointer rounded-full transition duration-200 hover:scale-110 ${colour}`}
        style={active ? { animation: "play-wiggle 0.6s ease" } : undefined}
      >
        <svg
          viewBox={shape.vb}
          width="100%"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            display: "block",
            overflow: "visible",
            filter: active ? "drop-shadow(0 0 8px currentColor)" : undefined,
          }}
        >
          {shape.d.map((d) => (
            <path key={d} d={d} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      </button>

      {burst > 0 && (
        <span
          key={burst}
          className="pointer-events-none absolute left-1/2 top-1/2 block h-0 w-0"
        >
          {Array.from({ length: SPARKS }, (_, i) => {
            const angle = (i / SPARKS) * Math.PI * 2;
            const style = {
              "--bx": `${Math.round(Math.cos(angle) * 40)}px`,
              "--by": `${Math.round(Math.sin(angle) * 40)}px`,
              animation: "play-burst 0.7s ease-out forwards",
            } as CSSProperties;
            return (
              <span
                key={i}
                className="absolute -ml-[3px] -mt-[3px] block h-1.5 w-1.5 rounded-full bg-gold"
                style={style}
              />
            );
          })}
        </span>
      )}

      {active && (
        <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2">
          <span
            className={`block whitespace-nowrap font-hand text-2xl leading-none ${
              tone === "dark" ? "text-gold-300" : "text-clay"
            }`}
            style={{ animation: "play-caption 2.4s ease forwards" }}
          >
            {item.caption}
          </span>
        </span>
      )}
    </div>
  );
}

export default function PlayDoodles({
  set,
  tone = "light",
}: {
  set: PlaySet;
  tone?: "light" | "dark";
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      {sets[set].map((item) => (
        <PlayDoodle key={item.caption} item={item} tone={tone} />
      ))}
    </div>
  );
}
