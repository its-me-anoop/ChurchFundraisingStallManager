module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'vision-bg': 'rgba(20, 20, 20, 0.7)', // Semi-transparent dark background
        'vision-card': 'rgba(50, 50, 50, 0.6)', // Slightly lighter card background
        'vision-border': 'rgba(255, 255, 255, 0.2)', // Subtle white border
        'vision-text': '#EAEAEA', // Light text color
        'vision-text-secondary': '#A0A0A0', // Secondary text color
        'vision-accent': '#0A84FF', // Apple's blue accent
      },
      borderRadius: {
        'xl': '1rem', // More pronounced rounding
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )', // Example shadow for glass effect
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      }
    },
  },
  variants: {
    extend: {
      // backdropBlur is now core, no need to extend variants explicitly for it
      // unless you need other variants like focus-within etc.
    },
  },
  plugins: [
    // Remove the deprecated plugin
    // require('tailwindcss-filters'),
  ],
}