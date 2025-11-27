"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentProfessional } from "@/lib/auth";
import { ImageUploadButton } from "./ImageUploadButton";

export default function ProSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState<any>(null);
  const [formData, setFormData] = useState({
    bio: "",
    profileImage: "",
    gallery: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        setFormData({
          bio: data.bio || "",
          profileImage: data.profileImage || "",
          gallery: data.gallery || "",
          phone: data.phone || "",
        });
      } catch (err) {
        router.push("/pro/login");
      } finally {
        setLoading(false);
      }
    }
    loadProfessional();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/pro/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
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
      </div>
    </div>
  );
}

