/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        elderBlue: "#4A90E2",
        elderLight: "#EAF4FF",
        elderText: "#1E3A8A",
      },
    },
  },
  plugins: [],
};
