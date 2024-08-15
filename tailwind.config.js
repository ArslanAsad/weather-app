/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.js"],
  theme: {
    extend: {
      backgroundImage: {
        image: "url(/public/background.jpg)",
      },
    },
  },
  plugins: [],
};
