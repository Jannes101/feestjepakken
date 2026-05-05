import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'fp-bg':       '#0E121A',
        'fp-surface':  '#151C27',
        'fp-surface2': '#1C2535',
        'fp-surface3': '#232E42',
        'fp-white':    '#EEF0F4',
        'fp-offwhite': '#C4CAD6',
        'fp-muted':    '#6B7590',
        'fp-muted2':   '#3E4A60',
        'fp-red':      '#E8352A',
      },
      fontFamily: {
        display: ["'Bebas Neue'", 'sans-serif'],
        mono:    ["'IBM Plex Mono'", 'monospace'],
        body:    ["'IBM Plex Sans'", 'sans-serif'],
      },
      animation: {
        ticker:   'ticker 24s linear infinite',
        carousel: 'carousel 32s linear infinite',
      },
      keyframes: {
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        carousel: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
