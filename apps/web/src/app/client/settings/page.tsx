"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";
import { ClientLogoutButton } from "@/app/my-bookings/ClientLogoutButton";

export default function ClientSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    profileImage: "",
  });

  useEffect(() => {
    loadClient();
  }, []);

  async function loadClient() {
    try {
      const res = await fetch("/api/client/me");
      if (!res.ok) {
        router.push("/client/login");
        return;
      }

      const clientData = await res.json();
      setClient(clientData);
      setFormData({
        name: clientData.name || "",
        firstName: clientData.firstName || "",
        lastName: clientData.lastName || "",
        email: clientData.email || "",
        phone: clientData.phone || "",
        city: clientData.city || "",
        address: clientData.address || "",
        profileImage: clientData.profileImage || "",
      });
    } catch (error) {
      console.error("Erreur chargement client:", error);
      router.push("/client/login");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/client/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedClient = await res.json();
        setClient(updatedClient);
        toast.showToast("Profil mis à jour avec succès !", "success");
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.showToast(err.message || "Erreur lors de la mise à jour", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      toast.showToast("Veuillez sélectionner une image", "error");
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.showToast("L'image est trop grande (max 5MB)", "error");
      return;
    }

    setSaving(true);

    try {
      // Créer un FormData pour l'upload
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("type", "client-profile");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        setFormData({ ...formData, profileImage: uploadData.url });
        toast.showToast("Image téléchargée avec succès", "success");
      } else {
        const errorData = await uploadRes.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors du téléchargement");
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.showToast(err.message || "Erreur lors du téléchargement", "error");
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
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-10 sm:px-8 lg:px-12">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/client/dashboard"
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 transition"
          >
            ← Retour au tableau de bord
          </Link>
          <ClientLogoutButton />
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-100">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Paramètres du profil
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Gérez vos informations personnelles
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo de profil */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-800">
                Photo de profil
              </label>
              <div className="flex items-center gap-4">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Photo de profil"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200 text-2xl font-semibold text-zinc-400">
                    {formData.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block text-sm text-zinc-600 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-800"
                    disabled={saving}
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    JPG, PNG ou GIF (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Nom complet */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-zinc-800">
                Nom complet *
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="Jean Dupont"
              />
            </div>

            {/* Prénom et Nom séparés */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-zinc-800">
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="Jean"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-zinc-800">
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="Dupont"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-800">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="jean.dupont@example.com"
              />
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-800">
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            {/* Ville */}
            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-medium text-zinc-800">
                Ville
              </label>
              <select
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              >
                <option value="">Sélectionner une ville</option>
                <option value="Tel Aviv">Tel Aviv</option>
                <option value="Jérusalem">Jérusalem</option>
                <option value="Haïfa">Haïfa</option>
                <option value="Rishon LeZion">Rishon LeZion</option>
                <option value="Petah Tikva">Petah Tikva</option>
                <option value="Beer Sheva">Beer Sheva</option>
                <option value="Netanya">Netanya</option>
                <option value="Ashdod">Ashdod</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            {/* Adresse */}
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-zinc-800">
                Adresse complète
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="Rue, numéro, code postal..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-zinc-900 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Sauvegarde..." : "💾 Enregistrer les modifications"}
              </button>
              <Link
                href="/client/dashboard"
                className="rounded-xl border border-zinc-200 bg-white px-6 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}






