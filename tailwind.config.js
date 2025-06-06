/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        "3xl": "3rem",
      },
      animation: {
        "spin-slow": "spin-slow 8s linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
        reverse: "reverse-spin 2s linear infinite",
      },
    },
  },
  plugins: [],
};
