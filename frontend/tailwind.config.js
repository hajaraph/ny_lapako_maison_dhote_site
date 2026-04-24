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
              "primary": "#d0af2f", // Jaune Moutarde / Or (Ancien Tertiary)
              "on-primary": "#231b00",
              "primary-container": "#ffe179",
              "on-primary-container": "#524300",
              "primary-fixed": "#ffe179",
              "primary-fixed-dim": "#e6c443",
              "on-primary-fixed": "#231b00",
              "on-primary-fixed-variant": "#524300",

              "secondary": "#00658e", // Bleu Mer (Inchangé)
              
              "tertiary": "#006d36", // Émeraude (Ancien Primary)
              "on-tertiary": "#ffffff",
              "tertiary-container": "#50c878",
              "on-tertiary-container": "#005025",
              "tertiary-fixed": "#83fba5",
              "tertiary-fixed-dim": "#66dd8b",
              "on-tertiary-fixed": "#005025",

              "background": "#fdfaf1", // Un blanc encore plus chaud, ivoire
              "surface": "#fdfaf1",
              "on-surface": "#1c1b12",
              "on-surface-variant": "#5f5a4f",
              "outline": "#7a776e",
              "surface-container-lowest": "#fffdf6",
              "surface-container": "#f4f1e6",
              "surface-container-low": "#faf7ec",
              "surface-container-high": "#eeebe0",
              "surface-container-highest": "#e7e1d3"
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
