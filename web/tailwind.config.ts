import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f5f0',
          100: '#ebe6db',
          200: '#d4ccba',
          300: '#b8ad95',
          400: '#8c8068',
          500: '#5e5340',
          600: '#3d3526',
          700: '#27220f',
          800: '#1a1709',
          900: '#0f0d05'
        },
        ember: {
          400: '#ff8a3d',
          500: '#f25c1f',
          600: '#c2410c'
        },
        motion: {
          quake: '#7c5cff',
          drift: '#34d6c4',
          fog: '#9aa5b8',
          spiral: '#ff6fa3',
          ash: '#5a5a5a',
          spark: '#ffd166'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif']
      },
      maxWidth: {
        prose: '68ch'
      }
    }
  },
  plugins: []
};

export default config;
