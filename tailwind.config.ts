import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      transitionProperty: {
        height: "height",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        pulsate: {
          "0%": { transform: "scale(0.1)", opacity: "0.0" },
          "50%": { opacity: "1.0" },
          "100%": { transform: "scale(1.2)", opacity: "0.0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "max-height-scale": {
          from: { maxHeight: "0%", opacity: "0%" },
          to: { maxHeight: "100%", opacity: "100%" },
        },
        "slide-down": {
          from: {
            transform: "translateY(-100%)",
            maxHeight: "0px",
            opacity: "0%",
          },
          to: {
            transform: "translateY(0%)",
            maxHeight: "500px",
            opacity: "100%",
          },
        },
        "width-scale": {
          from: { maxWidth: "0%" },
          to: { maxWidth: "100%" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "height-scale": "max-height-scale 0.5s ease-out",
        "slide-down": "slide-down 1s forwards",
        "width-scale": "width-scale 1s forwards",
        pulsate: "pulsate 1s ease-out infinite",
        fadeIn: "fadeIn 1s forwards",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-animation-delay"),
  ],
} satisfies Config;
