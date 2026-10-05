/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          base: 'var(--lexai-background)',
          surface: 'var(--lexai-surface)',
          card: 'var(--lexai-surface)',
          elevated: 'var(--lexai-surface)',
          border: 'var(--lexai-border)',
        },
        saffron: {
          DEFAULT: 'var(--lexai-primary-accent)',
          50: '#f0f9ff',
          100: '#e0f2fe',
          400: '#38bdf8',
          500: 'var(--lexai-primary-accent)',
          600: '#0369a1',
          glow: 'rgba(2, 132, 199, 0.25)',
        },
        electric: {
          DEFAULT: 'var(--lexai-secondary-accent)',
          400: '#c084fc',
          500: 'var(--lexai-secondary-accent)',
          600: '#9333ea',
          glow: 'rgba(168, 85, 247, 0.25)',
        },
        emerald: {
          DEFAULT: 'var(--lexai-success)',
          400: '#34d399',
          500: 'var(--lexai-success)',
          600: '#059669',
          glow: 'rgba(16, 185, 129, 0.25)',
        },
        crimson: {
          DEFAULT: 'var(--lexai-danger)',
          400: '#f87171',
          500: 'var(--lexai-danger)',
          600: '#dc2626',
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
        'lexai-glass': '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'lexai-glow-saffron': '0 0 25px rgba(2, 132, 199, 0.25)',
        'lexai-glow-electric': '0 0 25px rgba(168, 85, 247, 0.25)',
        'lexai-glow-emerald': '0 0 25px rgba(16, 185, 129, 0.25)',
        'lexai-glow-crimson': '0 0 25px rgba(239, 68, 68, 0.25)',
      },
      backgroundImage: {
        'lexai-gradient': 'none',
        'lexai-accent-gradient': 'none',
        'lexai-glow-radial': 'radial-gradient(circle at 50% 0%, rgba(2, 132, 199, 0.12) 0%, rgba(168, 85, 247, 0.05) 40%, rgba(13, 15, 19, 0) 70%)',
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
