import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens driven by CSS variables (see globals.css)
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-2": "rgb(var(--accent-2) / <alpha-value>)",
        "accent-soft": "rgb(var(--accent-soft) / <alpha-value>)",
        "accent-text": "rgb(var(--accent-text) / <alpha-value>)",
        "accent-fill": "rgb(var(--accent-fill) / <alpha-value>)",
        python: "rgb(var(--python) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--accent) / 0.25), 0 8px 40px -8px rgb(var(--accent) / 0.35)",
        soft: "0 1px 2px rgb(var(--shadow) / calc(var(--shadow-op) * 0.4)), 0 8px 30px -12px rgb(var(--shadow) / var(--shadow-op))",
        card: "0 1px 0 rgb(255 255 255 / 0.03) inset, 0 18px 50px -20px rgb(var(--shadow) / var(--shadow-op))",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "gradient-pan": "gradient-pan 8s ease infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};

export default config;
