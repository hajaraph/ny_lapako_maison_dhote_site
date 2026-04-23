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

              "secondary": "#00658e", // Bleu Mer (Inchangé)
              
              "tertiary": "#006d36", // Émeraude (Ancien Primary)
              "on-tertiary": "#ffffff",
              "tertiary-container": "#50c878",
              "on-tertiary-container": "#005025",
              "tertiary-fixed": "#83fba5",
              "tertiary-fixed-dim": "#66dd8b",

              "background": "#fdfaf1", // Un blanc encore plus chaud, ivoire
              "surface": "#fdfaf1",
              "on-surface": "#1c1b12",
              "outline": "#7a776e",
              "surface-container": "#f4f1e6",
              "surface-container-low": "#faf7ec",
              "surface-container-high": "#eeebe0"
      },
      "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
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
