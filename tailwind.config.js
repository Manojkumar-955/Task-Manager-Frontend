export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        zoomInSlow: {
          "0%": { transform: "scale(0.7)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUpFade: {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        dots: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
      },
      animation: {
        zoomSlow: "zoomInSlow 1.8s ease-out forwards",
        slideUp: "slideUpFade 1.2s ease-out forwards",
        floatSlow: "float 3s ease-in-out infinite",
        shimmerText: "shimmer 2s linear infinite",
        dot: "dots 1.4s infinite ease-in-out both",
      },
    },
  },
  plugins: [],
};
