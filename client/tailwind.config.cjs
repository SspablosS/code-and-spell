/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6B4EE6",
        secondary: "#4ECDC4",
        accent: "#FFE66D",
        success: "#97e195",
        error: "#F38181",
        background: "#1A1A2E",
        surface: "#16213E"
      }
    }
  },
  plugins: []
};

