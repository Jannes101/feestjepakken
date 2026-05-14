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
        'fp-bg':       '#FAF7F4',
        'fp-s1':       '#FFFFFF',
        'fp-s2':       '#F2EDE8',
        'fp-s3':       '#E8E0D8',
        'fp-ink':      '#1C1510',
        'fp-ink2':     '#3A2E26',
        'fp-muted':    '#8A7D72',
        'fp-muted2':   '#BFB5AC',
        'fp-amber':    '#FF6B2B',
        'fp-amber2':   '#FF9A6C',
      },
      fontFamily: {
        display: ["'Bebas Neue'", 'sans-serif'],
        body:    ["'DM Sans'", 'sans-serif'],
      },
      borderRadius: {
        'fp': '12px',
      },
      animation: {
        ticker:   'ticker 26s linear infinite',
        carousel: 'carousel 34s linear infinite',
      },
      keyframes: {
        ticker:   { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        carousel: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}

export default config
