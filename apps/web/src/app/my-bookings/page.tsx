"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClientLogoutButton } from "./ClientLogoutButton";
import { CancelBookingButton } from "./CancelBookingButton";
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

export default function MyBookingsPage() {
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClientAndBookings() {
      try {
        // Vérifier si le client est connecté
        const clientRes = await fetch("/api/client/me");
        if (!clientRes.ok) {
          // Pas connecté, rediriger vers login
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
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    }

    loadClientAndBookings();
  }, [router]);

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
            {client && (
              <p className="mt-2 text-sm text-zinc-500">
                Bonjour {client.name} · {bookings.length} réservation{bookings.length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {bookings.length === 0 && !loading && (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
              Aucune réservation pour le moment.
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
