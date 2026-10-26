/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: { 50: '#fbf6ea', 100: '#f4ead5', 200: '#ecdcba', 300: '#dcc794', 400: '#c9ae71' },
        burgundy: { 400: '#9a3a52', 500: '#7d2a40', 600: '#6b1a2d', 700: '#531222', 800: '#3d0c18', 900: '#27080f' },
        gold: { 300: '#e6c677', 400: '#d4a94c', 500: '#b8893a', 600: '#946a27' },
        ink: { 700: '#2b211c', 800: '#1d1613', 900: '#120d0b' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"EB Garamond"', 'Georgia', 'serif'],
        caps: ['"IM Fell English SC"', '"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        page: '0 1px 0 rgba(255,250,235,.7) inset, 0 10px 30px -12px rgba(39,8,15,.35), 0 2px 6px rgba(39,8,15,.12)',
        gold: '0 0 0 1px rgba(184,137,58,.55), 0 6px 18px -6px rgba(107,26,45,.4)',
      },
    },
  },
  plugins: [],
}
