import type { Config } from "tailwindcss";

const v = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        canvas: v("canvas"),
        surface: v("surface"),
        subtle: v("subtle"),
        ink: v("ink"),
        muted: v("muted"),
        line: v("line"),
        accent: {
          DEFAULT: v("accent"),
          fg: v("accent-fg"),
          soft: v("accent-soft"),
        },
        danger: {
          DEFAULT: v("danger"),
          soft: v("danger-soft"),
        },
      },
      borderRadius: {
        card: "20px",
        field: "14px",
      },
      boxShadow: {
        soft: "0 1px 2px hsl(160 10% 10% / 0.05), 0 6px 20px -10px hsl(160 10% 10% / 0.14)",
        lift: "0 2px 6px hsl(160 10% 10% / 0.05), 0 28px 56px -24px hsl(160 10% 10% / 0.28)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
