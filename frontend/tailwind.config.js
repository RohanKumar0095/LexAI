/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#08070D',
          secondary: '#100D18',
        },
        surface: {
          DEFAULT: '#15111F',
          elevated: '#1C1728',
        },
        primary: {
          DEFAULT: '#A855F7',
          bright: '#C084FC',
          deep: '#7C3AED',
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7C3AED',
          800: '#6B21A8',
          900: '#581C87',
          glow: 'rgba(168, 85, 247, 0.25)',
        },
        midnight: {
          base: 'var(--lexai-background)',
          surface: 'var(--lexai-surface)',
          card: 'var(--lexai-surface)',
          elevated: 'var(--lexai-surface-elevated)',
          border: 'var(--lexai-border)',
        },
        // Legacy aliases mapped to luminous purple for visual consistency
        saffron: {
          DEFAULT: 'var(--lexai-primary-accent)',
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: 'var(--lexai-primary-accent)',
          600: '#9333EA',
          glow: 'rgba(168, 85, 247, 0.25)',
        },
        electric: {
          DEFAULT: 'var(--lexai-secondary-accent)',
          400: '#C084FC',
          500: 'var(--lexai-secondary-accent)',
          600: '#9333EA',
          glow: 'rgba(192, 132, 252, 0.25)',
        },
        emerald: {
          DEFAULT: 'var(--lexai-success)',
          400: '#34D399',
          500: 'var(--lexai-success)',
          600: '#059669',
          glow: 'rgba(16, 185, 129, 0.25)',
        },
        crimson: {
          DEFAULT: 'var(--lexai-danger)',
          400: '#F87171',
          500: 'var(--lexai-danger)',
          600: '#DC2626',
          glow: 'rgba(239, 68, 68, 0.25)',
        },
        text: {
          primary: 'var(--lexai-foreground)',
          secondary: 'var(--lexai-secondary-foreground)',
          muted: 'var(--lexai-muted-foreground)',
        }
      },
      fontFamily: {
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'hero': '30px',
      },
      boxShadow: {
        'lexai-glass': '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'lexai-glow-primary': '0 0 25px rgba(168, 85, 247, 0.3)',
        'lexai-glow-saffron': '0 0 25px rgba(168, 85, 247, 0.25)',
        'lexai-glow-electric': '0 0 25px rgba(192, 132, 252, 0.25)',
        'lexai-glow-emerald': '0 0 25px rgba(16, 185, 129, 0.25)',
        'lexai-glow-crimson': '0 0 25px rgba(239, 68, 68, 0.25)',
      },
      backgroundImage: {
        'lexai-gradient': 'linear-gradient(135deg, #08070D 0%, #15111F 100%)',
        'lexai-accent-gradient': 'linear-gradient(135deg, #A855F7 0%, #C084FC 100%)',
        'lexai-glow-radial': 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15) 0%, rgba(124, 58, 237, 0.06) 40%, rgba(8, 7, 13, 0) 70%)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
