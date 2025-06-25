/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-teal': '#0ABAB5',
        'custom-teal-light': '#56DFCF',
        'custom-green': '#ADEED9',
        'custom-pink': '#FFEDF3',
      }
    },
  },
  plugins: [],
}