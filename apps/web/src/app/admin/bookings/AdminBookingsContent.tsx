"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  professional: {
    id: number;
    name: string;
    email: string;
    serviceType: string;
    city: string;
  };
  client: {
    id: number;
    name: string;
    email: string;
  };
}

export function AdminBookingsContent({ admin }: { admin: Admin }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  async function loadBookings() {
    setLoading(true);
    try {
      const url = statusFilter === "all" 
        ? "/api/admin/bookings"
        : `/api/admin/bookings?status=${statusFilter}`;
      const response = await fetch(url, {
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur API" }));
        throw new Error(errorData.error || "Erreur API");
      }
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Erreur chargement réservations:", error);
      alert(error instanceof Error ? error.message : "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              📅 Gestion des réservations
            </h1>
            <p className="mt-2 text-sm text-zinc-600 font-medium">
              Consultez et gérez toutes les réservations
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-semibold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
          >
            ← Dashboard
          </Link>
        </header>

        {/* Filtres */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              statusFilter === "all"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "glass text-purple-700 shadow-lg hover-lift"
            }`}
          >
            Toutes ({bookings.length})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              statusFilter === "pending"
                ? "bg-amber-600 text-white shadow-lg"
                : "glass text-amber-700 shadow-lg hover-lift"
            }`}
          >
            ⏳ En attente
          </button>
          <button
            onClick={() => setStatusFilter("confirmed")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              statusFilter === "confirmed"
                ? "bg-emerald-600 text-white shadow-lg"
                : "glass text-emerald-700 shadow-lg hover-lift"
            }`}
          >
            ✅ Confirmées
          </button>
          <button
            onClick={() => setStatusFilter("cancelled")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              statusFilter === "cancelled"
                ? "bg-red-600 text-white shadow-lg"
                : "glass text-red-700 shadow-lg hover-lift"
            }`}
          >
            ❌ Annulées
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl font-bold text-purple-600">Chargement...</div>
          </div>
        ) : (
          <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50">
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border-b border-purple-200/30 pb-4 last:border-0"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-zinc-900">
                          {booking.professional.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          ({booking.professional.serviceType})
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {booking.status === "confirmed"
                            ? "✅ Confirmée"
                            : booking.status === "cancelled"
                            ? "❌ Annulée"
                            : "⏳ En attente"}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-600 mb-1">
                        👤 Client: {booking.client.name} ({booking.client.email})
                      </div>
                      <div className="text-xs text-zinc-600 mb-1">
                        📍 {booking.professional.city}
                      </div>
                      <div className="text-xs text-zinc-600">
                        📅 {new Date(booking.startTime).toLocaleString("fr-FR", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-8">
                  Aucune réservation trouvée
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

