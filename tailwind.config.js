/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        insta: ["Billabong", "sans-serif"],
        body: ["Roboto", "sans-serif"],
      },
      keyframes: {
        animatedImage: {
          "0%": { opacity: "0.2" },
        },
        "100%": {
          opacity: "1",
        },
      },
      animation: {
        imgAnimate: "animatedImage 3s ease-in-out",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
