"use client";

import { useState } from "react";
import { CITIES, SERVICES, SERVICE_SUBCATEGORIES } from "@/app/pro/register/constants";

interface SearchFormProps {
    onSearch: (params: {
        city: string;
        service: string;
        subcategory: string;
        availableToday: boolean;
        sortBy: string;
        keyword: string;
    }) => void;
    loading?: boolean;
}

export function SearchForm({ onSearch, loading = false }: SearchFormProps) {
    const [city, setCity] = useState("");
    const [service, setService] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [availableToday, setAvailableToday] = useState(false);
    const [sortBy, setSortBy] = useState("name");
    const [keyword, setKeyword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({ city, service, subcategory, availableToday, sortBy, keyword });
    };

    return (
        <section className="rounded-2xl sm:rounded-3xl glass p-3 sm:p-4 lg:p-6 shadow-2xl hover-lift" style={{ border: "2px solid #2FB190" }}>
            <h2 className="text-lg sm:text-xl font-bold" style={{ color: "#18223b" }}>
                🔍 Trouver un professionnel
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-zinc-600 font-medium">
                Choisis ta ville et le service dont tu as besoin ✨
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* Ville */}
                <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium text-zinc-800">
                        Ville
                    </label>
                    <select
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="block w-full rounded-lg sm:rounded-xl glass border-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg outline-none ring-0 transition-all"
                        style={{ borderColor: "#2FB190" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47, 177, 144, 0.2)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                        <option value="">Toutes les villes</option>
                        {CITIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Service */}
                <div className="space-y-2">
                    <label htmlFor="service" className="block text-sm font-medium text-zinc-800">
                        Type de service
                    </label>
                    <select
                        id="service"
                        value={service}
                        onChange={(e) => {
                            setService(e.target.value);
                            setSubcategory("");
                        }}
                        className="block w-full rounded-lg sm:rounded-xl glass border-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg outline-none ring-0 transition-all"
                        style={{ borderColor: "#2FB190" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47, 177, 144, 0.2)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                        <option value="">Tous les services</option>
                        {SERVICES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* Mot-clés */}
                <div className="space-y-2">
                    <label htmlFor="keyword" className="block text-sm font-medium text-zinc-800">
                        Recherche par mots-clés
                    </label>
                    <input
                        id="keyword"
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Ex: spécialisé, expérimenté, moderne..."
                        className="block w-full rounded-lg sm:rounded-xl glass border-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg outline-none ring-0 transition-all"
                        style={{ borderColor: "#2FB190" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47, 177, 144, 0.2)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                </div>

                {/* Sous-catégorie */}
                {service && SERVICE_SUBCATEGORIES[service] && (
                    <div className="space-y-2">
                        <label htmlFor="subcategory" className="block text-sm font-medium text-zinc-800">
                            Sous-catégorie ({service})
                        </label>
                        <select
                            id="subcategory"
                            value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}
                            className="block w-full rounded-lg sm:rounded-xl glass border-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg outline-none ring-0 transition-all"
                            style={{ borderColor: "#2FB190" }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47, 177, 144, 0.2)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "none"; }}
                        >
                            <option value="">Toutes les sous-catégories</option>
                            {SERVICE_SUBCATEGORIES[service].map((sub) => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Trier par */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-800">
                        Trier par
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="block w-full rounded-lg sm:rounded-xl glass border-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg outline-none ring-0 transition-all"
                        style={{ borderColor: "#2FB190" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47, 177, 144, 0.2)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                        <option value="name">Nom (A-Z)</option>
                        <option value="rating">Meilleure note</option>
                        <option value="reviews">Plus d'avis</option>
                    </select>
                </div>

                {/* Disponible aujourd'hui */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="availableToday"
                        checked={availableToday}
                        onChange={(e) => setAvailableToday(e.target.checked)}
                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    <label htmlFor="availableToday" className="text-sm text-zinc-700">
                        Disponible aujourd'hui
                    </label>
                </div>

                {/* Bouton */}
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all disabled:cursor-not-allowed disabled:opacity-70"
                    style={{ background: "linear-gradient(135deg, #18223b 0%, #2FB190 100%)" }}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "linear-gradient(135deg, #2FB190 0%, #FFDE59 100%)"; }}
                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "linear-gradient(135deg, #18223b 0%, #2FB190 100%)"; }}
                >
                    {loading ? "🔍 Recherche en cours..." : "🚀 Rechercher des professionnels"}
                </button>
            </form>
        </section>
    );
}
