"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClientLogoutButton } from "./ClientLogoutButton";
import { CancelBookingButton } from "./CancelBookingButton";
import { generateSlug } from "@/lib/slug";
import type { Professional } from "@/types/professional";

// Fonction pour obtenir le slug d'un professionnel
function getProfessionalSlug(pro: Professional): string {
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

export default function MyBookingsPage() {
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [emailSearch, setEmailSearch] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    async function loadClientAndBookings() {
      try {
        // Vérifier si le client est connecté
        const clientRes = await fetch("/api/client/me");
        if (clientRes.ok) {
          const clientData = await clientRes.json();
          setClient(clientData);
          setEmailSearch(clientData.email); // Pré-remplir avec l'email du client connecté
          
          // Charger les réservations automatiquement si connecté
          await loadBookingsByEmail(clientData.email);
        } else {
          // Pas connecté, on laisse l'utilisateur chercher par email
          setClient(null);
        }
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("Erreur chargement client:", error.message);
        setClient(null);
      } finally {
        setLoading(false);
      }
    }

    loadClientAndBookings();
  }, [router]);

  async function loadBookingsByEmail(email: string) {
    if (!email || !email.includes("@")) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const bookingsRes = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`, {
        credentials: "include",
      });
      
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        const bookingsArray = Array.isArray(bookingsData) ? bookingsData : (bookingsData.bookings || []);
        setBookings(bookingsArray);
        
        if (bookingsArray.length === 0) {
          setError("Aucune réservation trouvée pour cet email.");
        }
      } else {
        const errorData = await bookingsRes.json().catch(() => ({}));
        setError(errorData.error || "Erreur lors du chargement des réservations");
        setBookings([]);
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Erreur lors du chargement");
      setBookings([]);
    } finally {
      setSearching(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    await loadBookingsByEmail(emailSearch);
  }

  function getStatusBadge(status: string) {
    const statusConfig = {
      confirmed: {
        label: "Confirmé",
        className: "bg-emerald-50 text-emerald-700",
      },
      pending: {
        label: "En attente",
        className: "bg-amber-50 text-amber-700",
      },
      cancelled: {
        label: "Annulé",
        className: "bg-red-50 text-red-700",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
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

  if (loading && !emailSearch) {
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
            href="/"
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 transition"
          >
            ← Retour à l'accueil
          </Link>
          <div className="flex gap-2">
            {client && (
              <>
                <Link
                  href="/client/dashboard"
                  className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50"
                >
                  Tableau de bord
                </Link>
                <ClientLogoutButton />
              </>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-100">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Mes réservations
            </h1>
            {client ? (
              <p className="mt-2 text-sm text-zinc-500">
                Bonjour {client.name} · {bookings.length} réservation{bookings.length > 1 ? "s" : ""}
              </p>
            ) : (
              <p className="mt-2 text-sm text-zinc-500">
                Entrez votre email pour voir vos réservations
              </p>
            )}
          </div>

          {!client && (
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailSearch}
                  onChange={(e) => setEmailSearch(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="rounded-xl bg-zinc-900 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searching ? "Recherche..." : "Rechercher"}
                </button>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                💡 <Link href="/client/login" className="text-zinc-900 hover:underline">Connectez-vous</Link> pour accéder automatiquement à vos réservations
              </p>
            </form>
          )}

          {error && (
            <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              error.includes("Aucune") 
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}>
              {error}
            </div>
          )}

          {bookings.length === 0 && !loading && !searching && (client || emailSearch) && (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
              Aucune réservation pour le moment.
            </div>
          )}

          {!client && !emailSearch && !loading && (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center">
              <p className="text-sm text-zinc-500 mb-4">
                Entrez votre email ci-dessus pour voir vos réservations
              </p>
              <Link
                href="/client/login"
                className="inline-block rounded-xl bg-zinc-900 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
              >
                Se connecter
              </Link>
            </div>
          )}

          {bookings.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-semibold text-zinc-900">
                            {booking.professional.name}
                          </h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        <p className="mt-1 text-xs text-zinc-500">
                          {booking.professional.serviceType} · {booking.professional.city}
                        </p>
                        <div className="mt-3 space-y-1 text-sm">
                          <p className="text-zinc-700">
                            <span className="font-medium">Date :</span> {formatDate(booking.startTime)}
                          </p>
                          <p className="text-zinc-700">
                            <span className="font-medium">Heure :</span> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Link
                          href={`/professionals/${getProfessionalSlug(booking.professional)}`}
                          className="text-xs text-zinc-500 hover:text-zinc-700 transition"
                        >
                          Voir le profil →
                        </Link>
                        {booking.status !== "cancelled" && (
                          <Link
                            href={`/bookings/${booking.id}/chat`}
                            className="text-xs text-primary hover:text-primary-dark transition font-medium flex items-center gap-1"
                          >
                            💬 Chat
                          </Link>
                        )}
                        {booking.status === "confirmed" && (
                          <>
                            <Link
                              href={`/professionals/${getProfessionalSlug(booking.professional)}?review=${booking.id}`}
                              className="text-xs text-emerald-600 hover:text-emerald-700 transition font-medium"
                            >
                              Laisser un avis ⭐
                            </Link>
                            <CancelBookingButton 
                              bookingId={booking.id} 
                              startTime={booking.startTime}
                              onCancel={() => {
                                setBookings(bookings.filter(b => b.id !== booking.id));
                              }} 
                            />
                          </>
                        )}
                        {booking.status === "pending" && (
                          <CancelBookingButton 
                            bookingId={booking.id} 
                            startTime={booking.startTime}
                            onCancel={() => {
                              setBookings(bookings.map(b => b.id === booking.id ? {...b, status: "cancelled"} : b));
                            }} 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
