import { defineConfig } from 'windicss/helpers'
import snap from 'windicss/plugin/scroll-snap'
import filters from 'windicss/plugin/filters'


export default defineConfig({
  separator: "_",
  darkMode: 'class',

  plugins: [
    snap,
    filters
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-family-base)',
        mono: 'var(--font-family-mono)',
      },
      screens: {
        xxs: '240px',
        xs: '340px',
        md: '720px',
      },
      cursor: {
        'crosshair': 'crosshair',
      },
    },
  },
})
