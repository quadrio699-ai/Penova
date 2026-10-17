"use client";

import { useEffect, useRef } from "react";

/**
 * A page-wide field of floating particles with real depth.
 *
 * Every particle has its own distance from the "camera". Near ones are larger,
 * softer and travel faster; far ones are tiny and slow. Moving the pointer
 * shifts the camera and scrolling flies the camera past the field, so the
 * layers slide over each other in true parallax.
 *
 * Fixed overlay, never blocks clicks, sits under the grain, intro and page
 * transition. Pauses when the tab is hidden. With reduced motion it draws a
 * single still frame.
 */

type Particle = {
  u: number; // 0..1 base position
  v: number;
  z: number; // 0.25 (near) .. 1 (far)
  shape: 0 | 1 | 2; // dot | ring | cross
  gold: boolean;
  phase: number;
  speed: number;
};

const BLUE = "78,145,195"; // canopy-400
const GOLD = "232,163,61"; // gold

export default function DepthField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let particles: Particle[] = [];
    const cam = { x: 0, y: 0, tx: 0, ty: 0 };

    const build = () => {
      const count = window.innerWidth < 700 ? 22 : 64;
      particles = Array.from({ length: count }, (_, i) => ({
        u: Math.random(),
        v: Math.random(),
        z: 0.25 + Math.random() * 0.75,
        shape: i % 7 === 0 ? 1 : i % 11 === 0 ? 2 : 0,
        gold: Math.random() < 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.00004 + Math.random() * 0.00008,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduceMotion) draw(0);
    };

    const draw = (t: number) => {
      cam.x += (cam.tx - cam.x) * 0.05;
      cam.y += (cam.ty - cam.y) * 0.05;
      const scroll = reduceMotion ? 0 : window.scrollY / Math.max(h, 1);

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        const inv = 1 / p.z; // 1 (far) .. 4 (near)
        const near = (1 - p.z) / 0.75; // 0 (far) .. 1 (near)

        const driftX = Math.sin(t * p.speed * 3 + p.phase) * 0.02;
        const driftY = Math.cos(t * p.speed * 2 + p.phase) * 0.02;

        // Wrap around the screen so the field never runs out.
        let x = (p.u + driftX - cam.x * 0.05 * inv) % 1;
        if (x < 0) x += 1;
        let y = (p.v + driftY - scroll * 0.35 * inv - cam.y * 0.04 * inv) % 1;
        if (y < 0) y += 1;

        const px = x * w;
        const py = y * h;
        const rgb = p.gold ? GOLD : BLUE;
        const twinkle = 0.78 + 0.22 * Math.sin(t * 0.002 + p.phase);

        if (p.shape === 0) {
          if (near > 0.5) {
            // Near: soft out-of-focus glow
            const radius = 6 + near * 14;
            const g = ctx.createRadialGradient(px, py, 0, px, py, radius);
            g.addColorStop(0, `rgba(${rgb},${0.05 + near * 0.2})`);
            g.addColorStop(1, `rgba(${rgb},0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Far: tiny crisp dot
            ctx.fillStyle = `rgba(${rgb},${(0.25 + near * 0.3) * twinkle})`;
            ctx.beginPath();
            ctx.arc(px, py, 1 + near * 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (p.shape === 1) {
          ctx.strokeStyle = `rgba(${rgb},${0.22 + near * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, py, 4 + near * 8, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          const s = 3 + near * 5;
          ctx.strokeStyle = `rgba(${rgb},${0.28 + near * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px - s, py);
          ctx.lineTo(px + s, py);
          ctx.moveTo(px, py - s);
          ctx.lineTo(px, py + s);
          ctx.stroke();
        }
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      cam.tx = event.clientX / Math.max(w, 1) - 0.5;
      cam.ty = event.clientY / Math.max(h, 1) - 0.5;
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduceMotion) raf = requestAnimationFrame(loop);
    };

    build();
    resize();
    window.addEventListener("resize", resize);

    if (!reduceMotion) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  );
}
