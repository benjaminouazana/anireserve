"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";
import { generateSlug } from "@/lib/slug";
import type { Professional as ProfessionalType } from "@/types/professional";

// Fonction pour obtenir le slug d'un professionnel
function getProfessionalSlug(pro: ProfessionalType): string {
  if (pro.slug) return pro.slug;
  return generateSlug(pro.name);
}

interface Professional {
  id: number;
  name: string;
  city: string;
  serviceType: string;
  description: string | null;
  averageRating: number;
  totalReviews: number;
  slug?: string | null;
}

export default function MyFavoritesPage() {
  const router = useRouter();
  const toast = useToast();
  const [favorites, setFavorites] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    setLoading(true);
    try {
      const response = await fetch("/api/favorites", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/client/login");
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors du chargement");
      }

      const data = await response.json();
      // Gérer les deux formats possibles : {favorites: [...]} ou [...]
      const favoritesList = Array.isArray(data) ? data : (data.favorites || []);
      setFavorites(favoritesList);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("Erreur chargement favoris:", err);
      toast.showToast(err.message || "Erreur lors du chargement de tes favoris", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFavorite(professionalId: number) {
    try {
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professionalId }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      toast.showToast("Professionnel retiré de tes favoris", "success");
      loadFavorites();
    } catch (error) {
      toast.showToast("Erreur lors de la suppression", "error");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 mb-6 transition"
          >
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            ⭐ Mes favoris
          </h1>
          <p className="text-lg text-zinc-600 font-medium">
            Tes professionnels favoris en un coup d'œil
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl font-bold text-purple-600">Chargement...</div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="rounded-3xl glass p-8 shadow-2xl border-2 border-purple-200/50 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <p className="text-lg text-zinc-600 font-medium mb-4">
              Tu n'as pas encore de favoris
            </p>
            <p className="text-sm text-zinc-500 mb-6">
              Ajoute des professionnels à tes favoris pour les retrouver facilement !
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all"
            >
              Rechercher des professionnels
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((pro) => (
              <div
                key={pro.id}
                className="rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50 animate-fade-in hover-lift transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-zinc-900 mb-1">
                      {pro.name}
                    </h3>
                    <p className="text-sm text-zinc-600">
                      {pro.serviceType} · {pro.city}
                    </p>
                    {pro.averageRating > 0 && (
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-sm font-medium text-amber-600">
                          ⭐ {pro.averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-zinc-400">
                          ({pro.totalReviews} avis)
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(pro.id)}
                    className="text-red-500 hover:text-red-700 transition text-xl"
                    title="Retirer des favoris"
                  >
                    ❌
                  </button>
                </div>

                {pro.description && (
                  <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                    {pro.description}
                  </p>
                )}

                <div className="flex gap-2">
                  <Link
                    href={`/professionals/${getProfessionalSlug(pro)}`}
                    className="flex-1 text-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover-lift transition"
                  >
                    Voir le profil
                  </Link>
                  <Link
                    href={`/?city=${encodeURIComponent(pro.city)}&service=${encodeURIComponent(pro.serviceType)}`}
                    className="flex-1 text-center rounded-full glass border-2 border-purple-200/50 px-4 py-2 text-sm font-semibold text-purple-700 shadow-lg hover-lift transition"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

