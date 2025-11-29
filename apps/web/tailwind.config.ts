import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Charte graphique AniReserve
        primary: {
          dark: "#18223b",    // Bleu foncé
          DEFAULT: "#2FB190", // Teal/Vert
          light: "#2FB190",
        },
        accent: {
          DEFAULT: "#FFDE59", // Jaune
          dark: "#FFD700",
        },
        brand: {
          dark: "#18223b",
          teal: "#2FB190",
          yellow: "#FFDE59",
        },
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
