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
        // VelociPlan brand colors: dark navy + electric blue + white
        brand: {
          navy: "#0D1B2A",
          blue: "#1E90FF",
          "blue-dark": "#1565C0",
          "blue-light": "#63B3ED",
          white: "#F7FAFC",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        condensed: ["Barlow Condensed", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
