"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentProfessional } from "@/lib/auth";
import { ImageUploadButton } from "./ImageUploadButton";
import { useToast } from "@/components/ToastProvider";

export default function ProSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState<any>(null);
  const [formData, setFormData] = useState({
    bio: "",
    profileImage: "",
    gallery: "",
    phone: "",
    pricing: "",
  });
  const [pricingEntries, setPricingEntries] = useState<Array<{service: string; price: string}>>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    async function loadProfessional() {
      try {
        const response = await fetch("/api/pro/me");
        if (!response.ok) {
          router.push("/pro/login");
          return;
        }
        const data = await response.json();
        setProfessional(data);
        
        // Parser les prix existants
        let existingPricing: Record<string, number> = {};
        if (data.pricing) {
          try {
            existingPricing = JSON.parse(data.pricing);
          } catch (e) {
            // Ignorer les erreurs de parsing
          }
        }
        
        setPricingEntries(
          Object.entries(existingPricing).map(([service, price]) => ({
            service,
            price: price.toString(),
          }))
        );
        
        setFormData({
          bio: data.bio || "",
          profileImage: data.profileImage || "",
          gallery: data.gallery || "",
          phone: data.phone || "",
          pricing: data.pricing || "",
        });
      } catch (err) {
        router.push("/pro/login");
      } finally {
        setLoading(false);
      }
    }
    loadProfessional();
  }, [router]);

  function updatePricing() {
    const pricingObj: Record<string, number> = {};
    pricingEntries.forEach((entry) => {
      if (entry.service.trim() && entry.price.trim()) {
        const price = parseFloat(entry.price);
        if (!isNaN(price) && price > 0) {
          pricingObj[entry.service.trim()] = price;
        }
      }
    });
    return JSON.stringify(pricingObj);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const pricingJson = updatePricing();
      const response = await fetch("/api/pro/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pricing: pricingJson,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.showToast("Les mots de passe ne correspondent pas", "error");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.showToast("Le mot de passe doit contenir au moins 6 caractères", "error");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch("/api/pro/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du changement de mot de passe");
      }

      toast.showToast("Mot de passe modifié avec succès", "success");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.showToast(err.message || "Erreur lors du changement de mot de passe", "error");
    } finally {
      setPasswordLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-10 sm:px-8 lg:px-12">
        <Link
          href="/pro/dashboard"
          className="mb-6 inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 transition"
        >
          ← Retour au tableau de bord
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-100">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Personnaliser mon profil
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Ajoute des photos, une bio et personnalise ta page professionnelle
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-zinc-800"
              >
                Bio personnalisée
              </label>
              <textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="Parle de toi, de ton expérience, de tes spécialités..."
              />
              <p className="text-xs text-zinc-500">
                Cette bio remplacera la description simple sur ta page de profil
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-zinc-800"
              >
                Photo de profil
              </label>
              <div className="flex gap-3">
                <input
                  id="profileImage"
                  type="url"
                  value={formData.profileImage}
                  onChange={(e) =>
                    setFormData({ ...formData, profileImage: e.target.value })
                  }
                  className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="https://example.com/photo.jpg"
                />
                <ImageUploadButton
                  onUpload={(url) =>
                    setFormData({ ...formData, profileImage: url })
                  }
                />
              </div>
              <p className="text-xs text-zinc-500">
                Colle une URL ou uploade une image
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="gallery"
                className="block text-sm font-medium text-zinc-800"
              >
                Galerie de photos (URLs séparées par des virgules)
              </label>
              <textarea
                id="gallery"
                rows={3}
                value={formData.gallery}
                onChange={(e) =>
                  setFormData({ ...formData, gallery: e.target.value })
                }
                className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
              />
              <p className="text-xs text-zinc-500">
                Ajoute plusieurs URLs d'images séparées par des virgules pour créer une galerie
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-zinc-800"
              >
                Téléphone
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

            {/* Section Prix */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-800">
                Tarifs par service
              </label>
              <div className="space-y-3">
                {pricingEntries.map((entry, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={entry.service}
                      onChange={(e) => {
                        const newEntries = [...pricingEntries];
                        newEntries[index].service = e.target.value;
                        setPricingEntries(newEntries);
                      }}
                      className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                      placeholder="Nom du service (ex: Consultation)"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={entry.price}
                      onChange={(e) => {
                        const newEntries = [...pricingEntries];
                        newEntries[index].price = e.target.value;
                        setPricingEntries(newEntries);
                      }}
                      className="w-32 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                      placeholder="Prix (₪)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPricingEntries(
                          pricingEntries.filter((_, i) => i !== index)
                        );
                      }}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 transition hover:bg-red-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setPricingEntries([...pricingEntries, { service: "", price: "" }]);
                  }}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
                >
                  + Ajouter un service
                </button>
              </div>
              <p className="text-xs text-zinc-500">
                Ajoute tes tarifs pour chaque service que tu proposes
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                ✅ Profil mis à jour avec succès !
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Sauvegarde..." : "Sauvegarder les modifications"}
            </button>
          </form>
        </div>

        {/* Section changement de mot de passe */}
        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                Sécurité
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Modifier ton mot de passe
              </p>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              {showPasswordForm ? "Annuler" : "Modifier le mot de passe"}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-800 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  required
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-800 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                  minLength={6}
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Au moins 6 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-800 mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                  minLength={6}
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {passwordLoading ? "Modification..." : "Modifier le mot de passe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

