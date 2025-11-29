"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-amber-500",
  };

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-xl ${bgColors[type]} text-white px-6 py-4 shadow-2xl animate-fade-in flex items-center gap-3 min-w-[300px] max-w-[500px]`}
      role="alert"
    >
      <span className="text-2xl">{icons[type]}</span>
      <p className="flex-1 font-semibold text-sm">{message}</p>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 text-xl font-bold transition"
        aria-label="Fermer"
      >
        ×
      </button>
    </div>
  );
}




