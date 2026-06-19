import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        pine:   '#1C2B1A',
        forest: '#2D5016',
        leaf:   '#4A7C2F',
        mist:   '#C8E6A0',
        birch:  '#F5F0E8',
        ember:  '#E8622A',
        sage: {
          50:  '#F0F6E8',
          100: '#D4E4B8',
          200: '#B8D288',
          300: '#9BBE82',
          400: '#6B8558',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['IBM Plex Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
