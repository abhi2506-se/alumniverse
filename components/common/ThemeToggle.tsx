"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export default function ThemeToggle({ size = 36 }: { size?: number }) {
  const { theme, toggleTheme } = useThemeStore();

  // Apply theme class on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      style={{
        width: size, height: size,
        borderRadius: 10,
        background: theme === "dark"
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.06)",
        border: theme === "dark"
          ? "1px solid rgba(255,255,255,0.12)"
          : "1px solid rgba(0,0,0,0.12)",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.45,
        transition: "all 0.25s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
