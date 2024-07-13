/** @type {import('tailwindcss').Config} */
export default {
  mode:'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "dark-blue":"#0E162A",
        "light-white":"#94A2B9",
        "light-blue":"#0FA5E8"
      }
    },
  },
  plugins: [],
}

