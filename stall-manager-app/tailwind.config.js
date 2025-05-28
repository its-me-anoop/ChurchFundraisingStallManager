module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Light theme colors
        'primary': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        'light': {
          'bg': '#f8fafc', // Light background
          'card': '#ffffff', // Card background
          'border': '#e2e8f0', // Border color
          'text': '#334155', // Text color
          'text-secondary': '#64748b', // Secondary text
        },
        // Dark theme colors
        'dark': {
          'bg': '#0f172a', // Dark background
          'card': '#1e293b', // Card background
          'border': '#334155', // Border color
          'text': '#f1f5f9', // Text color
          'text-secondary': '#94a3b8', // Secondary text
        },
      },
      borderRadius: {
        'xl': '1rem', // More pronounced rounding
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'light': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.18)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'gradient': 'gradient-shift 6s ease infinite',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
      borderColor: ['dark'],
    },
  },
  plugins: [],
}