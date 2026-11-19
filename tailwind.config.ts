import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{astro,ts,tsx}",
    "./components/**/*.{astro,ts,tsx}",
    "./app/**/*.{astro,ts,tsx}",
    "./src/**/*.{astro,ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "var(--border)",
        input: "var(--border-strong)",
        ring: "var(--text)",
        background: "var(--bg)",
        foreground: "var(--text)",
        primary: {
          DEFAULT: "var(--lavender)",
          foreground: "var(--on-accent)",
        },
        secondary: {
          DEFAULT: "var(--tile)",
          foreground: "var(--chip-text)",
        },
        destructive: {
          DEFAULT: "#f38ba8",
          foreground: "var(--on-accent)",
        },
        muted: {
          DEFAULT: "var(--track)",
          foreground: "var(--subtext)",
        },
        accent: {
          DEFAULT: "var(--track)",
          foreground: "var(--chip-text)",
        },
        popover: {
          DEFAULT: "var(--tile)",
          foreground: "var(--text)",
        },
        card: {
          DEFAULT: "var(--tile)",
          foreground: "var(--text)",
        },
        peach: "var(--peach)",
        lavender: "var(--lavender)",
        mauve: "var(--mauve)",
      },
      borderRadius: {
        lg: "var(--radius-tile)",
        md: "var(--radius-tile)",
        sm: "var(--radius-chip)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.7s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;