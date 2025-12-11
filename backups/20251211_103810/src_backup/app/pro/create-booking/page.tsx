"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

export default function ProCreateBookingPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [professional, setProfessional] = useState<any>(null);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  useEffect(() => {
    async function loadProfessional() {
      try {
        const res = await fetch("/api/pro/me", { credentials: "include" });
        if (!res.ok) {
          router.push("/pro/login");
          return;
        }
        const data = await res.json();
        setProfessional(data);
      } catch (error) {
        router.push("/pro/login");
      }
    }
    loadProfessional();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.clientName.trim() || !formData.clientEmail.trim()) {
        throw new Error("Le nom et l'email du client sont requis");
      }

      if (!formData.date || !formData.startTime || !formData.endTime) {
        throw new Error("La date et les heures sont requises");
      }

      // Créer la réservation (l'API gère automatiquement la création/récupération du client via upsert)
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId: professional.id,
          clientName: formData.clientName.trim(),
          clientEmail: formData.clientEmail.trim(),
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
        }),
        credentials: "include",
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.error || "Erreur lors de la création de la réservation");
      }

      toast.showToast("Réservation créée avec succès !", "success");
      
      // Réinitialiser le formulaire
      setFormData({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        date: "",
        startTime: "",
        endTime: "",
        notes: "",
      });

      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        router.push("/pro/dashboard");
      }, 2000);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.showToast(err.message || "Erreur lors de la création de la réservation", "error");
    } finally {
      setLoading(false);
    }
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <p className="text-zinc-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8 lg:px-12">
        <div className="mb-6">
          <Link
            href="/pro/dashboard"
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 transition mb-4"
          >
            ← Retour au tableau de bord
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Créer une réservation manuelle
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Enregistrez vous-même votre client et réservez son créneau directement
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="clientName" className="block text-sm font-medium text-zinc-800">
                Nom complet du client *
              </label>
              <input
                id="clientName"
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="Jean Dupont"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="clientEmail" className="block text-sm font-medium text-zinc-800">
                Email du client *
              </label>
              <input
                id="clientEmail"
                type="email"
                required
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="jean@example.com"
              />
              <p className="text-xs text-zinc-500">
                Si le client n'a pas d'email, utilisez un email temporaire (ex: client+{Date.now()}@anireserve.com)
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="clientPhone" className="block text-sm font-medium text-zinc-800">
                Téléphone du client (optionnel)
              </label>
              <input
                id="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="+972 50 123 4567"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-zinc-800">
                  Date *
                </label>
                <input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="startTime" className="block text-sm font-medium text-zinc-800">
                  Heure début *
                </label>
                <input
                  id="startTime"
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endTime" className="block text-sm font-medium text-zinc-800">
                  Heure fin *
                </label>
                <input
                  id="endTime"
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium text-zinc-800">
                Notes (optionnel)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="Informations supplémentaires sur cette réservation..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Création en cours..." : "Créer la réservation"}
              </button>
              <Link
                href="/pro/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50"
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

