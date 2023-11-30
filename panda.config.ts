import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./app/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system
  outdir: "styled-system",

  jsxFramework: "react",

  globalCss: {
    "*, *::before, *::after": {
      boxSizing: "border-box",
      touchAction: "manipulation",
      WebkitTapHighlightColor: "transparent",
    },

    html: {
      scrollBehavior: "smooth",
      fontSize: "100%",
      height: "100%",
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "env(safe-area-inset-bottom)",
      paddingRight: "env(safe-area-inset-right)",
      paddingLeft: "env(safe-area-inset-left)",
    },

    body: {
      margin: 0,
      padding: 0,
      fontFamily: "sans-serif",
      fontSize: "1em",
      lineHeight: 1.5,
      color: "#333",
      backgroundColor: "#fff",
    },

    a: {
      color: "#555",
      textDecoration: "underline",

      "&:hover": {
        color: "#333",
      },
    },

    button: {
      cursor: "pointer",
    },

    "h1, h2, h3, h4, h5, h6": {
      margin: 0,
      fontWeight: "normal",
    },

    h1: {
      fontSize: "6xl",
    },

    h2: {
      fontSize: "5xl",
    },

    h3: {
      fontSize: "4xl",
    },

    h4: {
      fontSize: "3xl",
    },

    h5: {
      fontSize: "2xl",
    },

    h6: {
      fontSize: "xl",
    },
  },
});
