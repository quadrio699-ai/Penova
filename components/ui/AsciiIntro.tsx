"use client";

import { useEffect, useRef, useState } from "react";

/**
 * PENOVA intro loader.
 *
 * Ported from Animmaster/Interactive-ASCII. Same core ideas: the wordmark is
 * sampled onto a coarse grid, every lit cell becomes a random character,
 * the cursor pushes cells away, and a gravity phase drops them at the end.
 * Differences from the original:
 *  - the source is the word "PENOVA" drawn on an offscreen canvas (no image)
 *  - letters assemble slowly, then wait: the visitor moves across them
 *    (cursor or finger), "enter" unlocks, and a click/tap drops the letters
 *    and fades the intro out. Skip and Escape always work.
 *  - it works on phones with a smaller grid instead of switching off
 *  - it plays once per browser session and is skipped for reduced motion
 */

const WORD = "PENOVA";
const SESSION_KEY = "penova-intro-seen";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Colours come from the Tailwind tokens (paper, gold).
const COLOR_REST = "#F2F7FB";
const COLOR_MOVING = "#E8A33D";

const BRIGHTNESS_THRESHOLD = 0.5;
const HOVER_RADIUS = 10;
const HOVER_PUSH = 7;
const EASE = 0.1;
const GRAVITY = 0.05;
const BOUNCE = 0.25;
const STAGGER_FRAMES = 18; // used when the letters fall
const ENTRY_STAGGER = 50; // used when the letters first arrive
const ENTRY_EASE = 0.06; // slower than hover easing, so the arrival feels longer
const ENTRY_SPREAD = 40; // how far (in cells) letters start from home

const ASSEMBLE_MS = 1800;
const EXIT_MS = 800;
// How far the pointer (or finger) must travel across the letters before
// "enter" unlocks.
const UNLOCK_DISTANCE = 320;

type Stage = "assembling" | "explore" | "ready";

type Cell = {
  col: number;
  row: number;
  char: string;
  offsetX: number;
  offsetY: number;
  fallSpeed: number;
  wait: number;
};

type Phase = "assemble" | "hold" | "fall";

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export default function AsciiIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [stage, setStage] = useState<Stage>("assembling");
  const [touch, setTouch] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* storage unavailable: just play the intro */
    }

    if (reduceMotion || seen) {
      setVisible(false);
      return;
    }

    // On a very slow connection the CSS failsafe may already have hidden the
    // overlay before JavaScript arrived. Don't pop the intro back in late.
    const overlay = overlayRef.current;
    if (overlay && getComputedStyle(overlay).visibility === "hidden") {
      setVisible(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      setVisible(false);
      return;
    }

    // Tells the CSS failsafe that JavaScript is running, so it must not hide us.
    overlayRef.current?.setAttribute("data-js", "1");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setTouch(coarse);
    const unlockDistance = coarse ? 200 : UNLOCK_DISTANCE;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    let cancelled = false;
    let raf = 0;
    let exitTimer = 0;
    let cells: Cell[] = [];
    let cols = 0;
    let rows = 0;
    let size = 8;
    let step = 11;
    let phase: Phase = "assemble";
    let phaseStart = performance.now();
    const cursor = { col: -999, row: -999 };

    let stageNow: Stage = "assembling";
    const changeStage = (next: Stage) => {
      stageNow = next;
      setStage(next);
    };
    let lastX = -1;
    let lastY = -1;
    let travelled = 0;

    const family =
      getComputedStyle(document.body).getPropertyValue("--font-display").trim();
    const fontFamily = family ? `${family}, system-ui, sans-serif` : "system-ui, sans-serif";

    const build = (scatter: boolean) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      const small = w < 700;

      size = small ? 5 : 8;
      step = size + (small ? 1 : 3);
      cols = Math.floor(w / step);
      rows = Math.floor(h / step);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw the wordmark at grid resolution, centred and fitted to width.
      const sampler = document.createElement("canvas");
      sampler.width = cols;
      sampler.height = rows;
      const sctx = sampler.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;

      sctx.fillStyle = "#000";
      sctx.fillRect(0, 0, cols, rows);
      sctx.fillStyle = "#fff";
      sctx.textAlign = "center";
      sctx.textBaseline = "middle";

      const probe = 100;
      sctx.font = `700 ${probe}px ${fontFamily}`;
      const measured = sctx.measureText(WORD).width || probe * 4;
      const targetWidth = cols * (small ? 0.9 : 0.66);
      const fontPx = Math.min((probe * targetWidth) / measured, rows * 0.5);
      sctx.font = `700 ${fontPx}px ${fontFamily}`;
      sctx.fillText(WORD, cols / 2, rows / 2);

      const { data } = sctx.getImageData(0, 0, cols, rows);
      const lit = new Set<string>();
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = (row * cols + col) * 4;
          if (data[i] / 255 > BRIGHTNESS_THRESHOLD) {
            lit.add(`${col},${row}`);
            lit.add(`${col + 1},${row}`); // widen strokes, as in the original
          }
        }
      }

      cells = [];
      for (const key of lit) {
        const [col, row] = key.split(",").map(Number);
        cells.push({
          col,
          row,
          char: randomChar(),
          offsetX: scatter ? (Math.random() - 0.5) * ENTRY_SPREAD * 2 : 0,
          offsetY: scatter ? (Math.random() - 0.5) * ENTRY_SPREAD : 0,
          fallSpeed: 0,
          wait: scatter ? Math.floor(Math.random() * ENTRY_STAGGER) : 0,
        });
      }
    };

    const finish = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      // The effect cleanup only runs on unmount, so release the scroll lock here.
      root.style.overflow = previousOverflow;
      setVisible(false);
    };

    const startFall = (now: number) => {
      if (phase === "fall") return;
      phase = "fall";
      phaseStart = now;
      for (const cell of cells) {
        cell.fallSpeed = 0;
        cell.wait = Math.floor(Math.random() * STAGGER_FRAMES);
      }
      setLeaving(true);
      exitTimer = window.setTimeout(finish, EXIT_MS);
    };

    const update = (now: number) => {
      const elapsed = now - phaseStart;
      if (phase === "assemble" && elapsed > ASSEMBLE_MS) {
        // Wordmark is formed. Stay here until the visitor plays with it and
        // then clicks; nothing auto-exits.
        phase = "hold";
        phaseStart = now;
        lastX = -1;
        changeStage("explore");
      }

      for (const cell of cells) {
        if (cell.wait > 0) {
          cell.wait--;
          continue;
        }

        if (phase === "fall") {
          const floor = rows - 1 - cell.row;
          cell.fallSpeed += GRAVITY;
          cell.offsetY += cell.fallSpeed;
          if (cell.offsetY > floor) {
            cell.offsetY = floor;
            cell.fallSpeed *= -BOUNCE;
          }
          continue;
        }

        // assemble + hold: drift home, pushed away by the cursor
        let targetX = 0;
        let targetY = 0;
        const dx = cell.col - cursor.col;
        const dy = cell.row - cursor.row;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < HOVER_RADIUS && distance > 0) {
          const push = (1 - distance / HOVER_RADIUS) * HOVER_PUSH;
          targetX = (dx / distance) * push;
          targetY = (dy / distance) * push;
        }
        const ease = phase === "assemble" ? ENTRY_EASE : EASE;
        cell.offsetX += (targetX - cell.offsetX) * ease;
        cell.offsetY += (targetY - cell.offsetY) * ease;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = `${size + 2}px monospace`;
      ctx.textBaseline = "top";
      ctx.textAlign = "center";

      let current = "";
      for (const cell of cells) {
        // gold while a letter is in motion, paper once it is at rest
        const moving = Math.abs(cell.offsetX) + Math.abs(cell.offsetY) > 1.2;
        const color = moving ? COLOR_MOVING : COLOR_REST;
        if (color !== current) {
          ctx.fillStyle = color;
          current = color;
        }
        ctx.fillText(
          cell.char,
          (cell.col + cell.offsetX) * step + size / 2,
          (cell.row + cell.offsetY) * step
        );
      }
    };

    const loop = (now: number) => {
      if (cancelled) return;
      update(now);
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      cursor.col = event.clientX / step;
      cursor.row = event.clientY / step;

      // Once the wordmark has formed, count how far the visitor moves across it.
      if (stageNow === "explore") {
        if (lastX >= 0) {
          travelled += Math.hypot(event.clientX - lastX, event.clientY - lastY);
          if (travelled > unlockDistance) changeStage("ready");
        }
        lastX = event.clientX;
        lastY = event.clientY;
      }
    };
    const onPointerLeave = () => {
      cursor.col = -999;
      cursor.row = -999;
    };
    const onPointerUp = (event: PointerEvent) => {
      // A lifted finger shouldn't leave a push-away hole in the letters.
      if (event.pointerType !== "mouse") onPointerLeave();
      lastX = -1;
    };
    const onClick = () => {
      if (stageNow === "ready") startFall(performance.now());
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") startFall(performance.now());
    };
    const onResize = () => build(false);

    skipRef.current = () => startFall(performance.now());

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    // Make sure the display font is ready before sampling the wordmark.
    const fontReady = Promise.race([
      document.fonts.load(`700 64px ${fontFamily}`),
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);

    fontReady.then(() => {
      if (cancelled) return;
      build(true);
      if (cells.length < 30) {
        // Sampling failed for some reason: skip the intro rather than
        // leaving visitors on an empty screen.
        finish();
        return;
      }
      setReady(true);
      phaseStart = performance.now();
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(exitTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      root.style.overflow = previousOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-label="PENOVA intro"
      style={{ touchAction: "none" }}
      className={`ascii-intro fixed inset-0 z-[100] bg-canopy-900 transition-opacity duration-500 ease-out ${
        leaving ? "pointer-events-none opacity-0 delay-200" : "opacity-100"
      }`}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />

      {/* Shown from the first paint until the ASCII canvas is ready, so slow
          connections never see an empty blue screen. */}
      {!ready && (
        <p
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-4xl font-bold text-paper/80 md:text-6xl"
        >
          PENOVA
        </p>
      )}

      {/* Skip is always available, so nobody is ever trapped behind the intro. */}
      <button
        type="button"
        onClick={() => skipRef.current()}
        className="absolute right-6 top-6 rounded px-3 py-2 font-display text-sm text-canopy-200 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        Skip intro
      </button>

      {!leaving && (
        <div className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-center px-6">
          {stage === "explore" && (
            <p className="animate-pulse font-display text-sm text-canopy-200">
              {touch
                ? "Drag your finger across the letters"
                : "Move your cursor across the letters"}
            </p>
          )}
          {stage === "ready" && (
            <button
              type="button"
              onClick={() => skipRef.current()}
              className="pointer-events-auto rounded-full border border-gold px-6 py-2.5 font-display text-sm text-gold transition-colors hover:bg-gold hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {touch ? "Tap to enter" : "Click to enter"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
