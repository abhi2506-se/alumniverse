import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        sans: ["Space Grotesk", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        background: "#050510",
        surface: "rgba(255,255,255,0.03)",
        border: "rgba(255,255,255,0.08)",
        accent: { DEFAULT: "#6366f1", foreground: "#ffffff" },
        cyan: { DEFAULT: "#06b6d4" },
        emerald: { DEFAULT: "#10b981" },
        rose: { DEFAULT: "#f43f5e" },
        amber: { DEFAULT: "#f59e0b" },
        violet: { DEFAULT: "#8b5cf6" },
        muted: { DEFAULT: "#64748b", foreground: "#94a3b8" },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-aurora": "linear-gradient(135deg, #6366f1, #06b6d4, #8b5cf6)",
        "gradient-mesh": "radial-gradient(at 40% 20%, #6366f120 0, transparent 50%), radial-gradient(at 80% 0%, #8b5cf610 0, transparent 50%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "aurora": "aurora 8s ease infinite",
        "shimmer": "shimmer 2s infinite",
        "slide-up": "slide-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "spin-slow": "spin 3s linear infinite",
        "border-anim": "border-anim 3s linear infinite",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 20px rgba(99,102,241,0.3)" },
          "50%": { boxShadow: "0 0 60px rgba(99,102,241,0.8), 0 0 100px rgba(99,102,241,0.3)" },
        },
        aurora: { "0%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" }, "100%": { backgroundPosition: "0% 50%" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "slide-up": { from: { transform: "translateY(30px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        "scale-in": { from: { transform: "scale(0.9)", opacity: "0" }, to: { transform: "scale(1)", opacity: "1" } },
        "border-anim": { "0%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" }, "100%": { backgroundPosition: "0% 50%" } },
      },
      boxShadow: {
        glow: "0 0 20px rgba(99,102,241,0.4)",
        "glow-lg": "0 0 60px rgba(99,102,241,0.3)",
        glass: "0 8px 32px rgba(0,0,0,0.4)",
      },
      borderRadius: { xl: "16px", "2xl": "20px", "3xl": "24px" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
