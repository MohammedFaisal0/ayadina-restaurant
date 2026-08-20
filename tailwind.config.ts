import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-gold": "#F3A712",
        "brand-goldHover": "#D9910D",
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
