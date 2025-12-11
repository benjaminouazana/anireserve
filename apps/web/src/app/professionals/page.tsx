"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/slug-utils";
import type { Professional } from "@/types/professional";

// Fonction pour obtenir le slug d'un professionnel
function getProfessionalSlug(pro: Professional): string {
  if (pro.slug) return pro.slug;
  return generateSlug(pro.name);
}

interface ProfessionalWithDetails extends Professional {
  cities: string | null;
  services: string | null;
  rating?: number;
  reviewCount?: number;
}

export default function ProfessionalsPage() {
  const router = useRouter();
  const [professionals, setProfessionals] = useState<ProfessionalWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");
  const [searchService, setSearchService] = useState("");

  useEffect(() => {
    loadProfessionals();
  }, []);

  async function loadProfessionals() {
    setLoading(true);
    try {
      const response = await fetch("/api/professionals");
      if (!response.ok) throw new Error("Erreur API");
      const data = await response.json();
      setProfessionals(data.professionals || []);
    } catch (error) {
      console.error("Erreur chargement professionnels:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProfessionals = professionals.filter((pro) => {
    const cityMatch = !searchCity || 
      pro.city.toLowerCase().includes(searchCity.toLowerCase()) ||
      (pro.cities && typeof pro.cities === 'string' && pro.cities.toLowerCase().includes(searchCity.toLowerCase()));
    const serviceMatch = !searchService || 
      pro.serviceType.toLowerCase().includes(searchService.toLowerCase()) ||
      (pro.services && typeof pro.services === 'string' && pro.services.toLowerCase().includes(searchService.toLowerCase()));
    return cityMatch && serviceMatch;
  });

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
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 mb-6 transition"
          >
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            👥 Trouver un professionnel
          </h1>
          <p className="text-lg text-zinc-600 font-medium">
            Recherchez parmi nos professionnels vérifiés
          </p>
        </div>

        {/* Filtres de recherche */}
        <div className="mb-8 rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-zinc-700 mb-2">
                🔍 Rechercher par ville
              </label>
              <input
                type="text"
                id="city"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Ex: Tel Aviv, Jérusalem..."
                className="w-full rounded-xl glass border-2 border-purple-200/50 px-4 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
              />
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-zinc-700 mb-2">
                🔍 Rechercher par service
              </label>
              <input
                type="text"
                id="service"
                value={searchService}
                onChange={(e) => setSearchService(e.target.value)}
                placeholder="Ex: Coiffeur, Coach sportif..."
                className="w-full rounded-xl glass border-2 border-purple-200/50 px-4 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
              />
            </div>
          </div>
        </div>

        {/* Liste des professionnels */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl font-bold text-purple-600">Chargement...</div>
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="rounded-3xl glass p-8 shadow-2xl border-2 border-purple-200/50 text-center">
            <p className="text-lg text-zinc-600 font-medium mb-4">
              {professionals.length === 0 
                ? "Aucun professionnel disponible pour le moment" 
                : "Aucun professionnel ne correspond à votre recherche"}
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all"
            >
              Retour à l'accueil
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfessionals.map((pro) => (
              <div
                key={pro.id}
                className="rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50 animate-fade-in hover-lift transition-all cursor-pointer"
                onClick={() => router.push(`/professionals/${getProfessionalSlug(pro)}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-1">
                      {pro.name}
                    </h3>
                    {pro.verified && (
                      <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        ✓ Vérifié
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div>
                    <span className="font-medium text-zinc-700">📍 Ville :</span>{" "}
                    <span className="text-zinc-600">{pro.city}</span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-700">🛠️ Service :</span>{" "}
                    <span className="text-zinc-600">{pro.serviceType}</span>
                  </div>
                  {pro.services && (
                    <div>
                      <span className="font-medium text-zinc-700">📋 Services :</span>{" "}
                      <span className="text-zinc-600">{pro.services}</span>
                    </div>
                  )}
                  {pro.rating && (
                    <div>
                      <span className="font-medium text-zinc-700">⭐ Note :</span>{" "}
                      <span className="text-zinc-600">
                        {pro.rating.toFixed(1)}/5 ({pro.reviewCount || 0} avis)
                      </span>
                    </div>
                  )}
                </div>

                {pro.description && (
                  <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                    {pro.description}
                  </p>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/professionals/${getProfessionalSlug(pro)}`);
                  }}
                  className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover-lift transition"
                >
                  Voir le profil →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Section CTA */}
        <div className="mt-12 rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-purple-200/50 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Vous êtes professionnel ?
          </h2>
          <p className="text-zinc-700 mb-6">
            Rejoignez notre plateforme et développez votre clientèle dans la communauté francophone d'Israël.
          </p>
          <Link
            href="/pro/register"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all"
          >
            S'inscrire comme professionnel
          </Link>
        </div>
      </div>
    </div>
  );
}




