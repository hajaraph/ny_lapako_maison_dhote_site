/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
              "primary": "#c19a2e",
              "on-primary": "#1d1700",
              "primary-container": "#ecdb99",
              "on-primary-container": "#4a3800",
              "primary-fixed": "#ecdb99",
              "primary-fixed-dim": "#d0b34f",
              "on-primary-fixed": "#1d1700",
              "on-primary-fixed-variant": "#4a3800",

              "secondary": "#315c68",

              "tertiary": "#14563f",
              "on-tertiary": "#ffffff",
              "tertiary-container": "#bfe2ce",
              "on-tertiary-container": "#0e3928",
              "tertiary-fixed": "#d6f1df",
              "tertiary-fixed-dim": "#97d2aa",
              "on-tertiary-fixed": "#0e3928",

              "background": "#faf7f0",
              "surface": "#ffffff",
              "on-surface": "#1b1a14",
              "on-surface-variant": "#5f5a4f",
              "outline": "#776f61",
              "surface-container-lowest": "#fffdf8",
              "surface-container": "#f4ede2",
              "surface-container-low": "#faf5ec",
              "surface-container-high": "#eee5d6",
              "surface-container-highest": "#e2d7c5"
      },
      "fontSize": {
              "display-xl": ["clamp(3.5rem, 8vw, 7rem)", { "lineHeight": "0.95", "letterSpacing": "-0.06em" }],
              "headline-lg": ["clamp(2.5rem, 5vw, 4.75rem)", { "lineHeight": "1", "letterSpacing": "-0.05em" }],
              "headline-md": ["clamp(1.875rem, 3vw, 3rem)", { "lineHeight": "1.08", "letterSpacing": "-0.03em" }],
              "title-lg": ["1.375rem", { "lineHeight": "1.3", "letterSpacing": "-0.02em" }],
              "body-lg": ["1.125rem", { "lineHeight": "1.8" }],
              "body-md": ["1rem", { "lineHeight": "1.7" }],
              "label-sm": ["0.75rem", { "lineHeight": "1.1", "letterSpacing": "0.28em" }]
      },
      "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
      },
      "boxShadow": {
              "soft": "0 20px 60px rgba(28, 27, 18, 0.08)",
              "lift": "0 30px 100px rgba(28, 27, 18, 0.12)",
              "glow": "0 0 0 1px rgba(255, 255, 255, 0.35), 0 20px 80px rgba(28, 27, 18, 0.10)"
      },
      "spacing": {
              "xs": "4px",
              "sm": "12px",
              "margin-mobile": "20px",
              "md": "24px",
              "xl": "80px",
              "base": "8px",
              "gutter": "24px",
              "margin-desktop": "64px",
              "lg": "48px"
      },
      "fontFamily": {
              "display-xl": ["Noto Serif"],
              "headline-lg": ["Noto Serif"],
              "label-sm": ["Plus Jakarta Sans"],
              "body-md": ["Plus Jakarta Sans"],
              "body-lg": ["Plus Jakarta Sans"],
              "title-lg": ["Plus Jakarta Sans"],
              "headline-md": ["Noto Serif"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
