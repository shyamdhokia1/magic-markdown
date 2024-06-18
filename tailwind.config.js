/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
import tailwindscrollbar from "tailwind-scrollbar"
export default {
  content: [
    "./index.html",
    "./src/App.jsx"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
    tailwindscrollbar
  ],
}
