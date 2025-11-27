"use client";

import { useTheme } from "@/app/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-bold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
      title={theme === "light" ? "Mode sombre" : "Mode clair"}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

