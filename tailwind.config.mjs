/** @type {import('tailwindcss').Config} */
export default {
  // ✨ CRUCIAL: This enables manual theme switching
  darkMode: 'class', 
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};