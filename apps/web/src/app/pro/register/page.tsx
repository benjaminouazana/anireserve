"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { CITIES, SERVICES, SERVICE_SUBCATEGORIES } from "./constants";

// Le site est entièrement en français, donc on ne demande plus les langues

export default function ProRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    additionalCities: [] as string[],
    serviceType: "",
    subcategories: [] as string[],
    description: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCityToggle(city: string) {
    if (city === formData.city) return; // Ne pas ajouter la ville principale
    setFormData((prev) => ({
      ...prev,
      additionalCities: prev.additionalCities.includes(city)
        ? prev.additionalCities.filter((c) => c !== city)
        : [...prev.additionalCities, city],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    // Plus besoin de vérifier les langues, le site est en français uniquement

    setLoading(true);

    try {
      const response = await fetch("/api/pro/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          city: formData.city,
          cities: [formData.city, ...formData.additionalCities].join(","),
          serviceType: formData.serviceType,
          subcategories: formData.subcategories.join(","),
          description: formData.description,
          phone: formData.phone,
          languages: "fr", // Site entièrement en français
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      // Rediriger vers la page de login avec un message de succès
      router.push("/pro/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-100">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Inscription professionnel
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Créez votre compte pour commencer à recevoir des réservations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Nom complet *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="Sarah Cohen"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="sarah@example.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Mot de passe *
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Confirmer le mot de passe *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Ville principale *
                </label>
                <select
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                >
                  <option value="">Sélectionne une ville</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="serviceType"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Type de service *
                </label>
                <select
                  id="serviceType"
                  required
                  value={formData.serviceType}
                  onChange={(e) =>
                    setFormData({ 
                      ...formData, 
                      serviceType: e.target.value,
                      subcategories: [] // Reset subcategories when service changes
                    })
                  }
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                >
                  <option value="">Sélectionne un service</option>
                  {SERVICES.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {formData.serviceType && SERVICE_SUBCATEGORIES[formData.serviceType] && (
                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-sm font-medium text-zinc-800">
                    Sous-catégories ({formData.serviceType}) <span className="text-zinc-400 text-xs">(optionnel)</span>
                  </label>
                  <p className="mb-2 text-xs text-zinc-500">
                    Sélectionne les sous-catégories qui correspondent à tes services pour aider les clients à te trouver plus facilement
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_SUBCATEGORIES[formData.serviceType].map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            subcategories: prev.subcategories.includes(sub)
                              ? prev.subcategories.filter((s) => s !== sub)
                              : [...prev.subcategories, sub],
                          }));
                        }}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                          formData.subcategories.includes(sub)
                            ? "bg-purple-600 text-white"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                  {formData.subcategories.length > 0 && (
                    <p className="mt-2 text-xs text-zinc-600">
                      Sous-catégories sélectionnées : {formData.subcategories.join(", ")}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Téléphone (optionnel)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="+972 50-123-4567"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-800">
                  Villes supplémentaires (optionnel)
                </label>
                <p className="mb-2 text-xs text-zinc-500">
                  Sélectionne d'autres villes où tu travailles
                </p>
                <div className="flex flex-wrap gap-2">
                  {CITIES.filter((c) => c !== formData.city).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCityToggle(city)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        formData.additionalCities.includes(city)
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
                {formData.additionalCities.length > 0 && (
                  <p className="mt-2 text-xs text-zinc-600">
                    Villes sélectionnées : {formData.additionalCities.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Description (optionnel)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="Décris ton activité, tes spécialités..."
                />
              </div>

            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Inscription en cours..." : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/pro/login"
              className="text-sm text-zinc-500 hover:text-zinc-700 transition"
            >
              Déjà un compte ? Se connecter
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-700 transition"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

