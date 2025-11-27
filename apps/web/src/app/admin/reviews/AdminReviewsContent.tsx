"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  professional: {
    id: number;
    name: string;
    serviceType: string;
  };
  client: {
    id: number;
    name: string;
    email: string;
  };
  booking: {
    id: number;
    startTime: string;
  };
}

export function AdminReviewsContent({ admin }: { admin: Admin }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/reviews", {
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur API" }));
        throw new Error(errorData.error || "Erreur API");
      }
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Erreur chargement avis:", error);
      alert(error instanceof Error ? error.message : "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(reviewId: number) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return;

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        loadReviews();
      } else {
        const errorData = await response.json().catch(() => ({ error: "Erreur" }));
        alert(errorData.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              ⭐ Modération des avis
            </h1>
            <p className="mt-2 text-sm text-zinc-600 font-medium">
              Gérez et modérez les avis clients
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-semibold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
          >
            ← Dashboard
          </Link>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl font-bold text-purple-600">Chargement...</div>
          </div>
        ) : (
          <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50">
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-purple-200/30 pb-4 last:border-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-zinc-900">
                          {review.professional.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          ({review.professional.serviceType})
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < review.rating ? "text-amber-400" : "text-zinc-300"}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-zinc-600 mb-1">
                        👤 Par {review.client.name} ({review.client.email})
                      </div>
                      {review.comment && (
                        <div className="text-sm text-zinc-700 mt-2 p-3 bg-zinc-50 rounded-lg">
                          "{review.comment}"
                        </div>
                      )}
                      <div className="text-xs text-zinc-500 mt-2">
                        📅 {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-bold hover:bg-red-200 transition-all"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-8">
                  Aucun avis trouvé
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

