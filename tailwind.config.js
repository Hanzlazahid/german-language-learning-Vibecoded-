/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8e1',        // much deeper yellow
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffc107',      // deeper true gold
          500: '#ffb300',      // deep gold for buttons, accents
          600: '#ffa000',
          700: '#ff8f00',
          800: '#ff6f00',
          900: '#b26a00',
        },
        accent: {
          500: '#dd0000',      // German flag red
          600: '#b30000',
          700: '#7a0000',
        },
        germanblack: {
          DEFAULT: '#000000',  // German flag black
          900: '#000000',
        },
        masculine: '#3b82f6',
        feminine: '#ef4444',
        neuter: '#10b981',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
