import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-gold": "var(--brand-gold, #f3a712)",
        "brand-goldHover": "var(--brand-gold-hover, #d9910d)",
        "brand-dark": "#121212",
        "brand-card": "#1E1E1E",
        "brand-border": "#2A2A2A",
      },
      fontFamily: {
        arabic: ["var(--font-cairo)", "sans-serif"],
        body: ["var(--font-readex-pro)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
