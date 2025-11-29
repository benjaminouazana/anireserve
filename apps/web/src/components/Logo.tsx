"use client";

import Image from "next/image";
import { useState } from "react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export function Logo({ className = "", width = 200, height = 80 }: { className?: string; width?: number; height?: number }) {
  const [imageError, setImageError] = useState(false);
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  
  const logoSources = ["/logo.png", "/logo.jpg", "/logo.jpeg", "/logo.svg", "/logo.webp"];

  const handleError = () => {
    if (currentSrcIndex < logoSources.length - 1) {
      setCurrentSrcIndex(currentSrcIndex + 1);
    } else {
      setImageError(true);
    }
  };

  // Fallback text logo si aucune image ne fonctionne - avec les couleurs de la charte
  if (imageError) {
    return (
      <div className={`${montserrat.variable} font-montserrat flex items-center gap-2 ${className}`}>
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
    );
  }

  return (
    <div className={`${montserrat.variable} font-montserrat flex items-center ${className}`}>
      <Image
        src={logoSources[currentSrcIndex]}
        alt="AniReserve Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
        onError={handleError}
        unoptimized={logoSources[currentSrcIndex].endsWith('.svg')}
      />
    </div>
  );
}

// Version simplifiée pour les petits espaces
export function LogoCompact({ className = "", width = 150, height = 60, src = "/logo.png" }: { className?: string; width?: number; height?: number; src?: string }) {
  const [imageError, setImageError] = useState(false);
  const [triedSources, setTriedSources] = useState<string[]>([src]);
  
  const logoSources = ["/logo.png", "/logo.jpg", "/logo.jpeg", "/logo.svg", "/logo.webp"];
  const currentSrc = triedSources[triedSources.length - 1];
  const nextSource = logoSources.find(s => !triedSources.includes(s));

  const handleError = () => {
    if (nextSource) {
      setTriedSources([...triedSources, nextSource]);
    } else {
      setImageError(true);
    }
  };

  if (imageError && triedSources.length >= logoSources.length) {
    return (
      <div className={`${montserrat.variable} font-montserrat flex items-center gap-1.5 ${className}`}>
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

  return (
    <div className={`${montserrat.variable} font-montserrat flex items-center ${className}`}>
      <Image
        src={currentSrc}
        alt="AniReserve Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
        onError={handleError}
      />
    </div>
  );
}

