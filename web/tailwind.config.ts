import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Mo Town canon palette — pulled from the character portraits + title cards
        cream: {
          DEFAULT: '#f4ead5',
          50: '#fbf6ea',
          100: '#f4ead5',
          200: '#ead8b3',
          300: '#dec38a'
        },
        ink: {
          DEFAULT: '#1a2027',
          50: '#f7f5f0',
          100: '#e6e4dd',
          200: '#b8b3a4',
          400: '#5e6b75',
          700: '#2c3a44',
          800: '#1f2832',
          900: '#11171d'
        },
        teal: {
          DEFAULT: '#1d4a52',
          400: '#3d7a83',
          500: '#1d4a52',
          600: '#143840',
          700: '#0e2a30',
          800: '#091e22'
        },
        terracotta: {
          DEFAULT: '#e87454',
          300: '#f29278',
          400: '#e87454',
          500: '#d85a3a',
          600: '#b8462a'
        },
        mustard: {
          DEFAULT: '#f7c948',
          300: '#fad879',
          400: '#f7c948',
          500: '#e8b32a'
        },
        motion: {
          quake: '#1d4a52',
          drift: '#3d7a83',
          flow: '#5fb3a8',
          spark: '#f7c948',
          ember: '#e87454',
          fog: '#9aa5b8',
          shade: '#2c3a44'
        }
      },
      fontFamily: {
        // Bowlby One = chunky cartoon display, free on Google Fonts
        display: ['var(--font-display)', 'Bowlby One', 'Cooper Black', 'serif'],
        // Fraunces kept for italic affirmations
        editorial: ['var(--font-editorial)', 'Fraunces', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif']
      },
      maxWidth: {
        prose: '68ch'
      },
      boxShadow: {
        'cartoon-sm': '4px 4px 0 0 #1a2027',
        cartoon: '6px 6px 0 0 #1a2027',
        'cartoon-lg': '10px 10px 0 0 #1a2027',
        'cartoon-terracotta': '6px 6px 0 0 #e87454',
        'cartoon-teal': '6px 6px 0 0 #1d4a52'
      },
      borderWidth: {
        3: '3px'
      },
      keyframes: {
        wobble: {
          '0%,100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' }
        },
        bobble: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        wobble: 'wobble 4s ease-in-out infinite',
        bobble: 'bobble 5s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
