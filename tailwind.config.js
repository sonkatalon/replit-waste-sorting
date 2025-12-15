/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        recycle: '#22c55e',
        landfill: '#6b7280',
        compost: '#a16207',
        special: '#f97316',
      }
    },
  },
  plugins: [],
}
