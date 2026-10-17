import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PENOVA brand tokens — blue for trust, possibility and connection;
        // gold remains the opportunity/light accent.
        canopy: {
          DEFAULT: "#155E9A",
          50: "#EDF5FC",
          100: "#D5E8F7",
          200: "#ADD0EC",
          300: "#7FB1D8",
          400: "#4E91C3",
          500: "#2876AE",
          600: "#155E9A",
          700: "#104A7A",
          800: "#0C3559",
          900: "#08243D",
        },
        gold: {
          DEFAULT: "#E8A33D",
          100: "#FBEAD0",
          300: "#F2C57E",
          500: "#E8A33D",
          700: "#B87A20",
        },
        paper: "#F2F7FB",
        ink: "#14283D",
        clay: "#C45F4A",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      maxWidth: {
        prose: "68ch",
      },
      backgroundImage: {
        "canopy-fade":
          "linear-gradient(180deg, #0C3559 0%, #155E9A 55%, #2876AE 100%)",
      },
      // Depth layers, tinted with the brand ink colour rather than pure black.
      boxShadow: {
        "layer-1":
          "0 1px 2px rgba(20,40,61,.06), 0 2px 6px rgba(20,40,61,.06)",
        "layer-2":
          "0 2px 4px rgba(20,40,61,.06), 0 8px 16px rgba(20,40,61,.08), 0 16px 32px rgba(20,40,61,.06)",
        "layer-3":
          "0 4px 8px rgba(20,40,61,.08), 0 16px 32px rgba(20,40,61,.12), 0 32px 64px rgba(20,40,61,.12)",
      },
    },
  },
  plugins: [],
};

export default config;
