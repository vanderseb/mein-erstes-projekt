import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    extend: {
      // Corporate Design Farben
      colors: {
        evil: {
          dark: '#223E54',    // Yale Blue - Haupthintergrund
          mid: '#5A7E8E',     // Air Force Blue - Sekundäre Flächen
          light: '#A8DADC',   // Pale Sky - Text, Akzente, Borders
          red: '#DB162F',     // Flag Red - CTAs, Buttons
        }
      },
      // Corporate Design Fonts
      fontFamily: {
        headline: ['Dela Gothic One', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
      // Scharfe Kanten lt. Design Manual (max 2-4px)
      borderRadius: {
        'evil': '2px',
        'evil-md': '4px',
      }
    },
  },
  plugins: [],
} satisfies Config

