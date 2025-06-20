/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0E1111',
        container: '#191D1D',
        primary: '#2AF5C1',
        'light-gray': '#C4C4C4',
        error: '#EF4444',
        white: '#FFFFFF',
      },
      borderRadius: {
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
} 