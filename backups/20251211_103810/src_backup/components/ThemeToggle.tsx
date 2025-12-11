"use client";

import { useTheme } from "@/app/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full glass px-4 py-2 text-sm font-bold shadow-lg hover-lift hover:shadow-xl transition-all dark:glass-dark"
      style={{
        color: theme === "light" ? "#18223b" : "#FFDE59",
      }}
      title={theme === "light" ? "Mode sombre" : "Mode clair"}
      aria-label={theme === "light" ? "Activer le mode sombre" : "Activer le mode clair"}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

