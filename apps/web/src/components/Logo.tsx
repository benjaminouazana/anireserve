"use client";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export function Logo({ className = "", width = 300, height = 120, showTagline = false }: { className?: string; width?: number; height?: number; showTagline?: boolean }) {
  return (
    <div className={`${montserrat.variable} font-montserrat ${className}`} style={{ width, height }}>
      <div className="flex items-center gap-3">
        {/* Ampoule */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-400 shadow-lg"></div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-zinc-800 rounded-sm"></div>
        </div>
        
        {/* Texte Ani */}
        <span 
          className="text-3xl sm:text-4xl lg:text-5xl font-bold"
          style={{ 
            color: "#2FB190",
            letterSpacing: "0.02em"
          }}
        >
          Ani
        </span>
        
        {/* Trait jaune */}
        <div className="w-12 h-2 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full"></div>
      </div>
      
      {/* RESERVE */}
      <div className="mt-2 ml-14">
        <span className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-wider" style={{ color: "#18223b" }}>
          RESERVE
        </span>
      </div>
      
      {showTagline && (
        <p className="mt-3 ml-14 text-sm text-zinc-600 font-medium leading-relaxed">
          La plateforme de réservation en Israël<br />
          Pour les Français
        </p>
      )}
    </div>
  );
}

// Version simplifiée pour les petits espaces
export function LogoCompact({ className = "", width = 150, height = 60 }: { className?: string; width?: number; height?: number }) {
  return (
    <div className={`${montserrat.variable} font-montserrat flex items-center gap-2 ${className}`} style={{ width, height }}>
      {/* Ampoule miniature */}
      <div className="relative">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-400"></div>
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-zinc-800 rounded-sm"></div>
      </div>
      
      {/* Texte */}
      <div className="flex items-center gap-1">
        <span className="text-xl font-bold" style={{ color: "#2FB190" }}>Ani</span>
        <span className="text-xl font-black" style={{ color: "#18223b" }}>R</span>
      </div>
    </div>
  );
}

