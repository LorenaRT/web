const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#F2F2F2",
            foreground: "#000000",
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#086FC1",
            },
            content1: "#F8F8F8",

            default: {
              100: "#E8E8E8",
            },
          },
        },
        dark: {
          colors: {
            background: "#121212",
            foreground: "#FFFFFF",
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#086FC1",
            },
            content1: "#252525",
            default: {
              100: "#1D1D1D",
            },
          },
        },
      },
    }),
  ],
};
