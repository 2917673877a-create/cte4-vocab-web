import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f8f2",
          100: "#dbe8d5",
          500: "#5b8c51",
          700: "#2f4b2f",
          900: "#182712",
        },
      },
      boxShadow: {
        soft: "0 20px 45px rgba(24, 39, 18, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
