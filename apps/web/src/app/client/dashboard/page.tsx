"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClientLogoutButton } from "@/app/my-bookings/ClientLogoutButton";

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
  const [client, setClient] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          setFavorites(favoritesData);
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
                      <Link
                        href={`/professionals/${booking.professional.id}`}
                        className="text-xs text-zinc-500 hover:text-zinc-700 transition"
                      >
                        Voir →
                      </Link>
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
                {favorites.map((fav) => (
                  <Link
                    key={fav.id}
                    href={`/professionals/${fav.professional.id}`}
                    className="block rounded-lg border border-zinc-100 bg-zinc-50 p-3 transition hover:border-zinc-200 hover:bg-zinc-100"
                  >
                    <p className="text-sm font-medium text-zinc-900">
                      {fav.professional.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {fav.professional.serviceType} · {fav.professional.city}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

