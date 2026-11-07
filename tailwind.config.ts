import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0faf9",
          100: "#d8f2f0",
          200: "#b4e4e2",
          300: "#82cfcc",
          400: "#4bb3b0",
          500: "#019393", // Official Maalon Brand Teal
          600: "#017a7a",
          700: "#016262",
          800: "#044f50",
          900: "#074243",
          950: "#002526",
          DEFAULT: "#019393",
        },
        charcoal: {
          DEFAULT: "#1E1E1E", // Official Brand Dark Slate
          800: "#2A2A2A",
          850: "#1E1E1E",
          900: "#171717",
          950: "#0F0F0F",
        },
        gold: {
          100: "#FDF8ED",
          300: "#EED7A1",
          500: "#D4AF37",
          600: "#B89426",
          700: "#8D7018",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(1, 147, 147, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 20px 30px -10px rgba(1, 147, 147, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.06)",
        dropdown: "0 10px 40px -5px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
