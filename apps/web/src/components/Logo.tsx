"use client";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export function Logo({ className = "", width = 300, height = 120, showTagline = false }: { className?: string; width?: number; height?: number; showTagline?: boolean }) {
  // Logo text uniquement - plus de tentative de chargement d'images
  return (
    <div className={`${montserrat.variable} font-montserrat ${className}`} style={{ width, height }}>
      <div className="flex items-center gap-2">
        <span 
          className="text-2xl sm:text-3xl lg:text-4xl font-bold"
          style={{ 
            color: "transparent",
            WebkitTextStroke: "2.5px #2FB190",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.05em"
          }}
        >
          Ani
        </span>
        <span className="text-2xl sm:text-3xl lg:text-4xl font-black" style={{ color: "#18223b" }}>
          RESERVE
        </span>
      </div>
      {showTagline && (
        <p className="mt-3 text-sm text-zinc-600 font-medium">
          La plateforme de réservation en Israel<br />Pour les Français.
        </p>
      )}
    </div>
  );
}

// Version simplifiée pour les petits espaces
export function LogoCompact({ className = "", width = 150, height = 60 }: { className?: string; width?: number; height?: number }) {
  // Logo text uniquement - plus de tentative de chargement d'images
  return (
    <div className={`${montserrat.variable} font-montserrat flex items-center gap-1.5 ${className}`} style={{ width, height }}>
      <span 
        className="text-2xl font-bold"
        style={{ 
          color: "transparent",
          WebkitTextStroke: "1.5px #2FB190",
          WebkitTextFillColor: "transparent",
          letterSpacing: "0.05em"
        }}
      >
        Ani
      </span>
      <span className="text-2xl font-black" style={{ color: "#18223b" }}>
        RESERVE
      </span>
    </div>
  );
}

