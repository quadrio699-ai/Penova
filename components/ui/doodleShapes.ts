// Hand-drawn style line icons shared by Atmosphere (decor), PlayDoodles
// (interactive) and HeroStack (3D panels). Strokes are drawn at a constant
// width, so the same shape looks right at any size.

export type Kind =
  | "bulb"
  | "pencil"
  | "book"
  | "cap"
  | "sprout"
  | "compass"
  | "stairs"
  | "spark"
  | "chat"
  | "key"
  | "squiggle"
  | "arrow"
  | "loop"
  | "plus";

export const shapes: Record<Kind, { vb: string; d: string[] }> = {
  bulb: {
    vb: "0 0 64 64",
    d: [
      "M32 8c-9 0-16 7-16 16 0 6 3 10 7 14 2 2 3 4 3 7h12c0-3 1-5 3-7 4-4 7-8 7-14 0-9-7-16-16-16z",
      "M26 50h12",
      "M28 55h8",
      "M28 38V29l4 4 4-4v9",
      "M32 2v3",
      "M8 24H5",
      "M59 24h-3",
      "M13 8l2 2",
      "M51 8l-2 2",
    ],
  },
  pencil: {
    vb: "0 0 64 64",
    d: [
      "M10 54l5-15 31-31a4 4 0 0 1 6 0l4 4a4 4 0 0 1 0 6L25 49z",
      "M15 39l10 10",
      "M42 12l10 10",
    ],
  },
  book: {
    vb: "0 0 64 64",
    d: [
      "M32 14c-5-4-14-5-22-4v36c8-1 17 0 22 4 5-4 14-5 22-4V10c-8-1-17 0-22 4z",
      "M32 14v36",
      "M16 20c4 0 7 1 10 2",
      "M16 28c4 0 7 1 10 2",
      "M38 22c3-1 6-2 10-2",
      "M38 30c3-1 6-2 10-2",
    ],
  },
  cap: {
    vb: "0 0 64 64",
    d: [
      "M32 14L4 28l28 14 28-14z",
      "M16 35v10c0 4 7 8 16 8s16-4 16-8V35",
      "M60 28v16",
    ],
  },
  sprout: {
    vb: "0 0 64 64",
    d: [
      "M32 56V30",
      "M32 36c0-10-8-16-20-16 0 10 8 16 20 16z",
      "M32 30c0-9 7-15 18-15 0 9-7 15-18 15z",
      "M22 56h20",
    ],
  },
  compass: {
    vb: "0 0 64 64",
    d: [
      "M32 6a26 26 0 1 0 0 52 26 26 0 0 0 0-52z",
      "M42 22L36 36 22 42 28 28z",
      "M32 8v4",
      "M32 52v4",
      "M8 32h4",
      "M52 32h4",
    ],
  },
  stairs: {
    vb: "0 0 64 64",
    d: [
      "M6 56h14V44h14V32h14V20h10",
      "M12 30c8-8 18-14 32-15",
      "M44 15l-9-4",
      "M44 15l-4 9",
    ],
  },
  spark: {
    vb: "0 0 64 64",
    d: [
      "M32 6v14",
      "M32 44v14",
      "M6 32h14",
      "M44 32h14",
      "M14 14l9 9",
      "M41 41l9 9",
      "M50 14l-9 9",
      "M23 41l-9 9",
    ],
  },
  chat: {
    vb: "0 0 64 64",
    d: [
      "M8 10h30a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H22l-8 7v-7H8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z",
      "M46 24h10a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-2v7l-8-7H34a4 4 0 0 1-4-4v-2",
    ],
  },
  key: {
    vb: "0 0 64 64",
    d: [
      "M22 20a10 10 0 1 0 0 20 10 10 0 0 0 0-20z",
      "M32 30h26",
      "M50 30v8",
      "M42 30v6",
      "M18 30h.01",
    ],
  },
  squiggle: {
    vb: "0 0 64 20",
    d: ["M3 10c6-8 10 8 16 0s10 8 16 0 10 8 16 0"],
  },
  arrow: {
    vb: "0 0 64 48",
    d: ["M4 40C16 14 36 8 56 16", "M56 16l-11-1", "M56 16l-5 10"],
  },
  loop: {
    vb: "0 0 64 64",
    d: ["M32 8c15 0 25 11 24 25S45 56 30 55 7 44 8 31 20 10 36 9"],
  },
  plus: {
    vb: "0 0 64 64",
    d: ["M32 12v40", "M12 32h40"],
  },
};
