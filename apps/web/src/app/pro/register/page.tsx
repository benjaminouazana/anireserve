"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { CITIES, SERVICES, SERVICE_SUBCATEGORIES } from "./constants";

export default function ProRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    additionalCities: [] as string[],
    services: [] as string[], // Services multiples
    subcategories: [] as string[],
    description: "",
    teoudatZeout: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function handleCityToggle(city: string) {
    if (city === formData.city) return;
    setFormData((prev) => ({
      ...prev,
      additionalCities: prev.additionalCities.includes(city)
        ? prev.additionalCities.filter((c) => c !== city)
        : [...prev.additionalCities, city],
    }));
  }

  function handleServiceToggle(service: string) {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
      // Reset subcategories when services change
      subcategories: [],
    }));
  }

  async function handleFileUpload(file: File): Promise<string> {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("folder", "teoudat-zeout");

    try {
      const response = await fetch("/api/upload/register", {
        method: "POST",
        body: uploadFormData,
      });

      // Vérifier le Content-Type avant de parser JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Réponse non-JSON reçue:", text.substring(0, 200));
        throw new Error("Le serveur a retourné une erreur. Vérifiez que l'API est correctement configurée.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'upload du fichier");
      }

      // Même en mode simulé, on accepte l'URL
      if (data.simulated) {
        console.log("⚠️ Upload en mode simulé:", data.message || "");
      }

      if (!data.url) {
        throw new Error("L'URL du fichier n'a pas été retournée par le serveur");
      }

      return data.url;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("Erreur handleFileUpload:", err);
      // Si c'est une erreur de parsing JSON, donner un message plus clair
      if (err.message && err.message.includes("JSON")) {
        throw new Error("Erreur de communication avec le serveur. Veuillez réessayer.");
      }
      throw err;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validations
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Le prénom et le nom sont obligatoires");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (!formData.city) {
      setError("La ville principale est obligatoire");
      return;
    }

    if (formData.services.length === 0) {
      setError("Tu dois sélectionner au moins un service");
      return;
    }

    if (!formData.teoudatZeout) {
      setError("L'upload de la Teoudate Zeoute est obligatoire");
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      // Upload de la Teoudate Zeoute
      let teoudatZeoutUrl: string;
      try {
        teoudatZeoutUrl = await handleFileUpload(formData.teoudatZeout);
      } catch (uploadError: unknown) {
        const err = uploadError instanceof Error ? uploadError : new Error(String(uploadError));
        setUploading(false);
        setError(err.message || "Erreur lors de l'upload de la Teoudate Zeoute. Veuillez réessayer.");
        setLoading(false);
        return;
      }
      setUploading(false);

      const response = await fetch("/api/pro/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone.trim() || null,
          city: formData.city,
          cities: [formData.city, ...formData.additionalCities].join(","),
          serviceType: formData.services[0], // Service principal (premier sélectionné)
          services: formData.services.join(","), // Tous les services
          subcategories: formData.subcategories.join(","),
          description: formData.description.trim() || null,
          teoudatZeout: teoudatZeoutUrl,
          languages: "fr",
          status: "pending", // Statut en attente de validation
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      // Rediriger vers la page de vérification
      router.push("/pro/verification-pending");
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Erreur inscription complète:", error);
      setError(error.message || "Erreur lors de l'inscription. Veuillez réessayer.");
      setUploading(false);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="rounded-3xl glass p-8 shadow-2xl border-2 border-purple-200/50">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Inscription professionnel
            </h1>
            <p className="mt-2 text-sm text-zinc-600 font-medium">
              Remplis ce formulaire pour créer ton profil. Ton compte sera vérifié par notre équipe avant activation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Prénom *
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                  placeholder="Sarah"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Nom *
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                  placeholder="Cohen"
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
                  className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                  placeholder="sarah@example.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Numéro de téléphone *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                  placeholder="+972 50-123-4567"
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
                  className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                >
                  <option value="">Sélectionne une ville</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
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
                          ? "bg-purple-600 text-white"
                          : "bg-purple-100 text-purple-700 hover:bg-purple-200"
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
                <label className="block text-sm font-medium text-zinc-800">
                  Services * (sélectionne un ou plusieurs)
                </label>
                <p className="mb-2 text-xs text-zinc-500">
                  Choisis tous les services que tu proposes
                </p>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        formData.services.includes(service)
                          ? "bg-pink-600 text-white"
                          : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
                {formData.services.length > 0 && (
                  <p className="mt-2 text-xs text-zinc-600">
                    Services sélectionnés : {formData.services.join(", ")}
                  </p>
                )}
              </div>

              {formData.services.length > 0 && (
                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-sm font-medium text-zinc-800">
                    Sous-catégories (optionnel)
                  </label>
                  <p className="mb-2 text-xs text-zinc-500">
                    Sélectionne les sous-catégories pour tes services
                  </p>
                  <div className="space-y-3">
                    {formData.services.map((service) => {
                      const subcats = SERVICE_SUBCATEGORIES[service];
                      if (!subcats) return null;
                      return (
                        <div key={service}>
                          <p className="mb-2 text-xs font-medium text-zinc-700">
                            {service}:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {subcats.map((sub) => (
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
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                }`}
                              >
                                {sub}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="teoudatZeout"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Teoudate Zeoute * (carte d'identité israélienne)
                </label>
                <p className="mb-2 text-xs text-zinc-500">
                  Upload une photo ou scan de ta Teoudate Zeoute (PDF, JPG, PNG - max 5MB)
                </p>
                <input
                  id="teoudatZeout"
                  type="file"
                  required
                  accept="image/*,.pdf"
                  capture="environment"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 10 * 1024 * 1024) {
                        setError("Le fichier est trop volumineux (max 10MB)");
                        return;
                      }
                      setFormData({ ...formData, teoudatZeout: file });
                    }
                  }}
                  className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                />
                <p className="mt-2 text-xs text-zinc-500">
                  Tu peux prendre une photo directement avec ton appareil photo ou choisir une image depuis ta galerie
                </p>
                {formData.teoudatZeout && (
                  <p className="mt-2 text-xs text-emerald-600">
                    ✓ Fichier sélectionné : {formData.teoudatZeout.name}
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
                  className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                  placeholder="Décris ton activité, tes spécialités..."
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
                  className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
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
                  className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || uploading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all disabled:cursor-not-allowed disabled:opacity-70 animate-gradient"
            >
              {uploading
                ? "📤 Upload en cours..."
                : loading
                ? "⏳ Création du compte..."
                : "✨ Soumettre ma demande d'inscription"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/pro/login"
              className="text-sm text-zinc-600 hover:text-purple-600 transition font-medium"
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
