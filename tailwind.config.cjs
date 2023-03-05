/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
moduxle.exports = {
  content: ["./index.html", "./src/**/*.{html,js,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        "world-map": "url('../assets/img/world.svg')",
      },

      keyframes: {
        flight: {
          from: {
            transform: "rotate(0deg) translate(4.5rem)",
          },
          to: {
            transform: "rotate(-360deg) translate(4.5rem)",
          },
        },
        loadAnime: {
          from: {
            width: "100%",
            height: "100%",
          },
          to: {
            width: "11rem",
            height: "11rem",
            "background-color": "transparent",
            "border-radius": "50%",
          },
        },
      },
      animation: {
        flight: "flight 8s infinite",
        loadAnime: "loadAnime 3s forwards",
      },
      screens: {
        md: "480px",
        lg: "769px",
        xl: "1024px",
      },
      colors: {
        "secondary": "#00539cff",
        "primary": "#21447f",
        "screen-bg-color": "#36312e",
        "screen-border-color": "#171214",
        "screen-font-color": "#faf755",
      },
    },
  },
  plugins: [],
};
