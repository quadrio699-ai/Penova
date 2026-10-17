"use client";

import { useEffect, useRef } from "react";
import { shapes, type Kind } from "./doodleShapes";

/**
 * A small stack of translucent panels floating at different depths, stepping
 * up like the PENOVA pathway (Support -> Prepare -> Impact). Real CSS 3D:
 * each panel sits at its own translateZ and the whole stack tilts with the
 * pointer while the visitor is over the hero. On touch screens and with
 * reduced motion it stays at a fixed, slightly angled pose.
 *
 * Desktop only (hidden below lg). Decorative, so hidden from screen readers.
 */

const panels: {
  label: string;
  note: string;
  kind: Kind;
  z: number;
  x: number;
  y: number;
}[] = [
  { label: "Support", note: "you're not alone", kind: "chat", z: 0, x: 0, y: 0 },
  { label: "Prepare", note: "get ready", kind: "book", z: 46, x: 34, y: 52 },
  { label: "Impact", note: "make it count", kind: "spark", z: 92, x: 68, y: 104 },
];

const BASE_X = 12; // resting tilt, degrees
const BASE_Y = -22;

export default function HeroStack() {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stackRef.current;
    const host = el?.closest("section");
    if (!el || !host) return;

    const canMove =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canMove) return;

    let raf = 0;
    let visible = true;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `rotateX(${(BASE_X - cy * 14).toFixed(2)}deg) rotateY(${(
        BASE_Y +
        cx * 22
      ).toFixed(2)}deg)`;
      if (visible) raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      tx = (event.clientX - rect.left) / rect.width - 0.5;
      ty = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    // Stop animating while the hero is scrolled out of view.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    observer.observe(host);

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="mb-auto hidden lg:block" aria-hidden="true">
      <div className="hero-stack-float relative h-[270px] w-[330px] [perspective:1100px]">
        <div
          ref={stackRef}
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${BASE_X}deg) rotateY(${BASE_Y}deg)`,
          }}
        >
          {panels.map((panel) => {
            const shape = shapes[panel.kind];
            return (
              <div
                key={panel.label}
                className="absolute rounded-xl border border-canopy-100/30 bg-gradient-to-br from-white/15 to-white/5 p-4 shadow-[0_24px_40px_-12px_rgba(8,36,61,0.55)]"
                style={{
                  left: panel.x,
                  top: panel.y,
                  width: 214,
                  height: 116,
                  transform: `translateZ(${panel.z}px)`,
                }}
              >
                <svg
                  viewBox={shape.vb}
                  width="26"
                  height="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gold"
                >
                  {shape.d.map((d) => (
                    <path key={d} d={d} vectorEffect="non-scaling-stroke" />
                  ))}
                </svg>
                <p className="mt-2 font-display text-xs font-medium uppercase tracking-wide text-canopy-50">
                  {panel.label}
                </p>
                <p className="font-hand text-xl leading-tight text-canopy-100">
                  {panel.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
