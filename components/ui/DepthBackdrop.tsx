"use client";

import { useEffect, useRef } from "react";

/**
 * Three quiet depth planes behind a section's content:
 *   far  - soft canopy glow
 *   mid  - faint dotted floor in perspective
 *   near - one thin ring and one gold glint
 *
 * Place it as the first child of a `relative overflow-hidden` section.
 * Planes shift a few pixels with the pointer on desktop; on touch devices
 * or with reduced motion they stay still but the layering remains.
 * Colours are tuned for the dark canopy sections (canopy-fade gradient).
 */

const plane = (depth: number): React.CSSProperties => ({
  transform: `translate3d(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px), 0)`,
  transition: "transform 450ms ease-out",
});

export default function DepthBackdrop({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    const canMove =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canMove) return;

    let raf = 0;
    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", x.toFixed(3));
        el.style.setProperty("--py", y.toFixed(3));
      });
    };
    const onLeave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {/* far: soft canopy glow (canopy-300) */}
      <div className="absolute inset-0" style={plane(-6)}>
        <div
          className="absolute inset-[-10%]"
          style={{
            background:
              "radial-gradient(55% 45% at 72% 28%, rgba(127,177,216,0.5), transparent 70%)",
          }}
        />
      </div>

      {/* mid: dotted floor in perspective */}
      <div className="absolute inset-0" style={plane(14)}>
        <div
          className="absolute inset-x-[-15%] bottom-[-12%] h-[62%]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(242,247,251,0.32) 1px, transparent 1.6px)",
            backgroundSize: "30px 30px",
            transform: "perspective(700px) rotateX(62deg)",
            transformOrigin: "50% 100%",
            WebkitMaskImage: "linear-gradient(to top, #000 25%, transparent)",
            maskImage: "linear-gradient(to top, #000 25%, transparent)",
          }}
        />
      </div>

      {/* near: one ring, one gold glint */}
      <div className="absolute inset-0" style={plane(32)}>
        <div
          className="absolute right-[9%] top-[16%] hidden h-56 w-56 rounded-full border md:block"
          style={{ borderColor: "rgba(173,208,236,0.4)" }}
        />
        <div
          className="absolute right-[17%] top-[30%] h-2.5 w-2.5 rounded-full bg-gold"
          style={{ boxShadow: "0 0 18px 4px rgba(232,163,61,0.45)" }}
        />
      </div>
    </div>
  );
}
