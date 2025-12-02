"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 10);

    // Auto close
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  const colors = {
    success: "bg-emerald-50 text-emerald-900 ring-emerald-200",
    error: "bg-rose-50 text-rose-900 ring-rose-200",
    info: "bg-blue-50 text-blue-900 ring-blue-200",
    warning: "bg-amber-50 text-amber-900 ring-amber-200",
  };

  const iconColors = {
    success: "text-emerald-600",
    error: "text-rose-600",
    info: "text-blue-600",
    warning: "text-amber-600",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg ring-1 transition-all duration-300 ${
        colors[type]
      } ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      role="alert"
    >
      <span className={`text-lg font-bold ${iconColors[type]}`}>
        {icons[type]}
      </span>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-zinc-400 hover:text-zinc-600 transition"
        aria-label="Fermer"
      >
        ✕
      </button>
    </div>
  );
}
