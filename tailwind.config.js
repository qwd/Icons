/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './docs/**/*.html',
    './docs/**/*.md',
  ],
  darkMode: false,
  theme: {
    container: {
      center: true,
      padding: "15px",
    },
    extend: {
      colors: {
        linkblue: '#066ff5',
      },
    },
  },
  variants: {},
  plugins: [],
}
