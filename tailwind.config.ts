import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        hairline: "var(--hairline)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "'Hanken Grotesk'", "system-ui", "sans-serif"],
        sans: ["'Galano Grotesque'", "'Hanken Grotesk'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        label: "0.14em",
      },
      borderRadius: {
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        dock: "0 1px 2px rgba(12,12,11,0.04), 0 8px 24px -8px rgba(12,12,11,0.18)",
        sheet: "0 -2px 8px rgba(12,12,11,0.04), 0 -24px 60px -20px rgba(12,12,11,0.28)",
        card: "0 1px 2px rgba(12,12,11,0.05)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        grain: {
          "0%,100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-3%,-4%)" },
          "30%": { transform: "translate(2%,-2%)" },
          "50%": { transform: "translate(-1%,3%)" },
          "70%": { transform: "translate(3%,1%)" },
          "90%": { transform: "translate(-2%,2%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s var(--ease-editorial, cubic-bezier(0.22,1,0.36,1)) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
