"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClientLogoutButton } from "@/app/my-bookings/ClientLogoutButton";
import { useToast } from "@/components/ToastProvider";
import { generateSlug } from "@/lib/slug";

// Fonction pour obtenir le slug d'un professionnel
function getProfessionalSlug(pro: any): string {
  if (pro.slug) return pro.slug;
  return generateSlug(pro.name);
}

type Booking = {
  id: number;
  professional: {
    id: number;
    name: string;
    serviceType: string;
    city: string;
  };
  startTime: string;
  endTime: string;
  status: string;
};

export default function ClientDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [client, setClient] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const clientRes = await fetch("/api/client/me");
        if (!clientRes.ok) {
          router.push("/client/login");
          return;
        }

        const clientData = await clientRes.json();
        setClient(clientData);

        // Charger les réservations
        const bookingsRes = await fetch(`/api/bookings?email=${encodeURIComponent(clientData.email)}`);
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData);
        }

        // Charger les favoris
        const favoritesRes = await fetch("/api/favorites");
        if (favoritesRes.ok) {
          const favoritesData = await favoritesRes.json();
          // L'API retourne { favorites: [...] } ou directement un tableau
          const favoritesArray = Array.isArray(favoritesData) 
            ? favoritesData 
            : (favoritesData.favorites || []);
          setFavorites(favoritesArray);
        } else {
          // En cas d'erreur, initialiser avec un tableau vide
          setFavorites([]);
        }
      } catch (err) {
        console.error("Erreur chargement", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
      const response = await fetch("/api/client/change-password", {
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
    } catch (error: any) {
      toast.showToast(error.message || "Erreur lors du changement de mot de passe", "error");
    } finally {
      setPasswordLoading(false);
    }
  }

  const upcomingBookings = bookings
    .filter((b) => b.status === "confirmed" && new Date(b.startTime) > new Date())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-8 lg:px-12">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 transition"
          >
            ← Retour à l'accueil
          </Link>
          <ClientLogoutButton />
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Mon tableau de bord
          </h1>
          {client && (
            <p className="mt-2 text-sm text-zinc-500">
              Bonjour {client.name} · {bookings.length} réservation{bookings.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Prochaines réservations */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900">
              Prochaines réservations
            </h2>
            {upcomingBookings.length === 0 ? (
              <p className="text-sm text-zinc-500">Aucune réservation à venir</p>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-lg border border-zinc-100 bg-zinc-50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-900">
                          {booking.professional.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {formatDate(booking.startTime)} à {formatTime(booking.startTime)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/bookings/${booking.id}/chat`}
                          className="text-xs text-primary hover:text-primary-dark transition font-medium"
                        >
                          💬 Chat
                        </Link>
                        <Link
                          href={`/professionals/${getProfessionalSlug(booking.professional)}`}
                          className="text-xs text-zinc-500 hover:text-zinc-700 transition"
                        >
                          Voir →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/my-bookings"
              className="mt-4 inline-block text-sm text-zinc-600 hover:text-zinc-900 transition"
            >
              Voir toutes mes réservations →
            </Link>
          </div>

          {/* Favoris */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900">
              Mes favoris
            </h2>
            {favorites.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Aucun professionnel en favoris. Ajoute-en depuis la recherche !
              </p>
            ) : (
              <div className="space-y-3">
                {favorites.map((fav) => {
                  // Gérer les deux formats possibles : { professional: {...} } ou directement les données
                  const pro = fav.professional || fav;
                  return (
                    <Link
                      key={fav.id || pro.id}
                      href={`/professionals/${getProfessionalSlug(pro)}`}
                      className="block rounded-lg border border-zinc-100 bg-zinc-50 p-3 transition hover:border-zinc-200 hover:bg-zinc-100"
                    >
                      <p className="text-sm font-medium text-zinc-900">
                        {pro.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {pro.serviceType} · {pro.city}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Section changement de mot de passe */}
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Sécurité
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
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
            <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
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




