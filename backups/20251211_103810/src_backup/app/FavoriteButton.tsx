"use client";

import { useState, useEffect } from "react";

export function FavoriteButton({ professionalId }: { professionalId: number }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkFavorite() {
      try {
        const response = await fetch("/api/favorites");
        if (response.ok) {
          const favorites = await response.json();
          setIsFavorite(favorites.some((f: { professionalId: number }) => f.professionalId === professionalId));
        }
      } catch {
        // Pas connecté, ignorer
      }
    }
    checkFavorite();
  }, [professionalId]);

  async function handleToggle() {
    setLoading(true);
    try {
      if (isFavorite) {
        await fetch(`/api/favorites?professionalId=${professionalId}`, {
          method: "DELETE",
        });
        setIsFavorite(false);
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ professionalId }),
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Erreur favoris", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-full px-2 py-1 text-xs transition ${
        isFavorite
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100"
      }`}
      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      {isFavorite ? "❤️" : "🤍"}
    </button>
  );
}




