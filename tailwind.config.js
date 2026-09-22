/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        feastiva: {
          black: '#0a0a0c',
          dark: '#111115',
          card: '#16161b',
          border: '#2a2620',
          burgundy: '#2d0c13',
          burgundyDark: '#1a060a',
          gold: {
            light: '#f5e4b2',
            DEFAULT: '#d4af37',
            dark: '#aa821c',
            glow: '#f0cf65',
          },
          veg: '#10b981',
          nonveg: '#ef4444'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 35px 0px rgba(212, 175, 55, 0.35)',
      }
    },
  },
  plugins: [],
}
