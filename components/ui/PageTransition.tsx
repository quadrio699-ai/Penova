"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Page-to-page transition for the Next.js App Router.
 *
 * Borrows one idea from Animmaster/Pixel-Page-Reveal: a grid of tiles that
 * grow and collapse vertically in a random stagger. Everything else from that
 * demo (lime palette, counter, hero text splitting, GSAP) is left out so the
 * transition matches PENOVA and adds no dependency.
 *
 * Flow: internal link click -> tiles cover the screen -> router.push ->
 * new route renders -> tiles collapse away.
 */

const FILL = "#0C3559"; // canopy-800
const COVER_MS = 420;
const REVEAL_MS = 520;
const STAGGER_MS = 320;
const FAILSAFE_MS = 2500;

type Mode = "cover" | "reveal";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function PageTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const covered = useRef(false); // true from click until the reveal finishes
  const failsafe = useRef(0);
  const revealTimer = useRef(0);
  const routerRef = useRef(router);
  routerRef.current = router;

  const run = useRef<(mode: Mode) => Promise<void>>(() => Promise.resolve());

  // Animation runner (canvas draws every tile each frame).
  useEffect(() => {
    run.current = (mode: Mode) =>
      new Promise<void>((resolve) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return resolve();

        const w = window.innerWidth;
        const h = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const tile = w < 700 ? 56 : 84;
        const cols = Math.ceil(w / tile);
        const rows = Math.ceil(h / tile);
        const delays = Array.from(
          { length: cols * rows },
          () => Math.random() * STAGGER_MS
        );
        const duration = mode === "cover" ? COVER_MS : REVEAL_MS;
        const total = duration + STAGGER_MS;
        const start = performance.now();

        const frame = (now: number) => {
          const t = now - start;
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = FILL;

          for (let i = 0; i < delays.length; i++) {
            const progress = Math.min(Math.max((t - delays[i]) / duration, 0), 1);
            const eased = easeOutCubic(progress);
            const scale = mode === "cover" ? eased : 1 - eased;
            if (scale <= 0) continue;
            const x = (i % cols) * tile;
            const y = Math.floor(i / cols) * tile;
            // +1px overlap hides hairline seams between tiles
            ctx.fillRect(x, y, tile + 1, tile * scale + 1);
          }

          if (t < total) {
            requestAnimationFrame(frame);
          } else {
            if (mode === "reveal") ctx.clearRect(0, 0, w, h);
            resolve();
          }
        };
        requestAnimationFrame(frame);
      });
  }, []);

  const reveal = () => {
    window.clearTimeout(failsafe.current);
    const canvas = canvasRef.current;
    run.current("reveal").then(() => {
      covered.current = false;
      if (canvas) canvas.style.pointerEvents = "none";
    });
  };

  // Intercept internal link clicks (capture phase, so we run before next/link).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // hash/search only

      event.preventDefault();
      event.stopPropagation();
      if (covered.current) return; // a transition is already running

      covered.current = true;
      const canvas = canvasRef.current;
      if (canvas) canvas.style.pointerEvents = "auto";

      run.current("cover").then(() => {
        routerRef.current.push(url.pathname + url.search + url.hash);
        // If the route never changes, don't leave the screen covered.
        failsafe.current = window.setTimeout(reveal, FAILSAFE_MS);
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // New route is in: wait a beat for it to paint, then uncover.
  useEffect(() => {
    if (!covered.current) return;
    revealTimer.current = window.setTimeout(reveal, 90);
    return () => window.clearTimeout(revealTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
    />
  );
}
