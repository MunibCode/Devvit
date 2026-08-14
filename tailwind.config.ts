import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      screens: {
        xsm: "500px",
        sm: "600px",
        md: "690px",
        lg: "988px",
        xl: "1078px",
        xxl: "1265px",
      },
      colors: {
        textGray: "rgb(var(--text-gray) / <alpha-value>)",
        textGrayLight: "rgb(var(--text-gray-light) / <alpha-value>)",
        borderGray: "rgb(var(--border-gray) / <alpha-value>)",
        inputGray: "rgb(var(--input-gray) / <alpha-value>)",
        iconBlue: "rgb(var(--icon-blue) / <alpha-value>)",
        iconGreen: "rgb(var(--icon-green) / <alpha-value>)",
        iconPink: "rgb(var(--icon-pink) / <alpha-value>)",
        page: "rgb(var(--page) / <alpha-value>)",
      },
    },
  },
  plugins: [],
} satisfies Config;
