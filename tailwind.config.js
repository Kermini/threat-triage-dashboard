/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#07111f",
        panel: "#0c1726",
        panelAlt: "#101f33",
        line: "#1e3550",
        text: "#d7e6ff",
        muted: "#7f9bb8",
        neon: "#2dd4bf",
        alert: "#f97316",
        danger: "#ef4444",
        warn: "#facc15",
        safe: "#22c55e",
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(45,212,191,0.14), 0 18px 60px rgba(4,17,29,0.45)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(45,212,191,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.07) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
