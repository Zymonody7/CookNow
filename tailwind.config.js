/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cny-red': '#D32F2F',
        'cny-darkRed': '#B71C1C',
        'cny-gold': '#FFD700',
        'cny-lightGold': '#FFF8DC',
        'cny-accent': '#FF6F00',
        'cny-bg': '#FFF5E6',
      },
      fontFamily: {
        'cursive': ['cursive'],
        'serif': ['serif'],
        'sans': ['sans-serif'],
      },
      boxShadow: {
        'float': '0 10px 30px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 15px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
