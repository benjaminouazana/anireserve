"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface Stats {
  totalClients: number;
  totalProfessionals: number;
  totalBookings: number;
  totalReviews: number;
  averageRating: number;
  bookingsByStatus: {
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  bookingsLast30Days: number;
}

interface ProfessionalByService {
  service: string;
  count: number;
}

interface ProfessionalByCity {
  city: string;
  count: number;
}

export function AdminDashboardContent({ admin }: { admin: Admin }) {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [professionalsByService, setProfessionalsByService] = useState<
    ProfessionalByService[]
  >([]);
  const [professionalsByCity] = useState<
    ProfessionalByCity[]
  >([]);
  const [recentBookings, setRecentBookings] = useState<Array<{
    id: number;
    professional: { name: string; serviceType: string };
    client: { name: string; email: string };
    startTime: string;
    status: string;
  }>>([]);
  const [recentClients, setRecentClients] = useState<Array<{
    id: number;
    name: string;
    email: string;
  }>>([]);
  const [recentProfessionals, setRecentProfessionals] = useState<Array<{
    id: number;
    name: string;
    email: string;
    serviceType: string;
    city: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const response = await fetch("/api/admin/stats", {
        credentials: "include",
        cache: "no-store", // Stats admin ne doivent pas être cachées
      });
      if (!response.ok) throw new Error("Erreur API");
      const data = await response.json();
      setStats(data.stats);
      setProfessionalsByService(data.professionalsByService);
      // setProfessionalsByCity(data.professionalsByCity); // Utilisé plus tard
      setRecentBookings(data.recentBookings);
      setRecentClients(data.recentClients);
      setRecentProfessionals(data.recentProfessionals);
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-xl font-bold text-purple-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              🛡️ Dashboard Administrateur
            </h1>
            <p className="mt-2 text-sm text-zinc-600 font-medium">
              Connecté en tant que {admin.name} ({admin.email})
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/admin/professionals/pending"
              className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-semibold text-amber-700 shadow-lg hover-lift hover:shadow-xl transition-all"
            >
              ⏳ Valider les profils
            </Link>
            <Link
              href="/admin/users"
              className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-semibold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
            >
              👥 Utilisateurs
            </Link>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-semibold text-blue-700 shadow-lg hover-lift hover:shadow-xl transition-all"
            >
              📅 Réservations
            </Link>
            <Link
              href="/admin/reviews"
              className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-semibold text-pink-700 shadow-lg hover-lift hover:shadow-xl transition-all"
            >
              ⭐ Avis
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-semibold text-zinc-700 shadow-lg hover-lift hover:shadow-xl transition-all"
            >
              🏠 Accueil
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-semibold text-red-700 shadow-lg hover-lift hover:shadow-xl transition-all"
            >
              🚪 Déconnexion
            </button>
          </div>
        </header>

        {/* Statistiques principales */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50 hover-lift">
              <div className="text-3xl font-bold text-purple-600">{stats.totalClients}</div>
              <div className="text-sm text-zinc-600 font-medium mt-1">👥 Clients</div>
            </div>
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-pink-200/50 hover-lift">
              <div className="text-3xl font-bold text-pink-600">{stats.totalProfessionals}</div>
              <div className="text-sm text-zinc-600 font-medium mt-1">💼 Professionnels</div>
            </div>
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-blue-200/50 hover-lift">
              <div className="text-3xl font-bold text-blue-600">{stats.totalBookings}</div>
              <div className="text-sm text-zinc-600 font-medium mt-1">📅 Réservations</div>
            </div>
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-emerald-200/50 hover-lift">
              <div className="text-3xl font-bold text-emerald-600">{stats.averageRating.toFixed(1)}</div>
              <div className="text-sm text-zinc-600 font-medium mt-1">⭐ Note moyenne</div>
            </div>
          </div>
        )}

        {/* Réservations par statut */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50">
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                📊 Réservations par statut
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-700">⏳ En attente</span>
                  <span className="text-lg font-bold text-amber-600">{stats.bookingsByStatus.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-700">✅ Confirmées</span>
                  <span className="text-lg font-bold text-emerald-600">{stats.bookingsByStatus.confirmed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-700">❌ Annulées</span>
                  <span className="text-lg font-bold text-red-600">{stats.bookingsByStatus.cancelled}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-200/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-700">📈 30 derniers jours</span>
                  <span className="text-lg font-bold text-purple-600">{stats.bookingsLast30Days}</span>
                </div>
              </div>
            </div>

            {/* Professionnels par service */}
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-pink-200/50">
              <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
                🏷️ Professionnels par service
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {professionalsByService.slice(0, 10).map((item) => (
                  <div key={item.service} className="flex items-center justify-between">
                    <span className="text-sm text-zinc-700">{item.service}</span>
                    <span className="text-sm font-bold text-pink-600">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tableaux récents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Réservations récentes */}
          <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-blue-200/50">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              📅 Réservations récentes
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="border-b border-blue-200/30 pb-3 last:border-0">
                  <div className="text-xs font-medium text-zinc-700">
                    {booking.professional.name} - {booking.professional.serviceType}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Client: {booking.client.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {new Date(booking.startTime).toLocaleDateString("fr-FR")} -{" "}
                    <span className={`font-medium ${
                      booking.status === "confirmed" ? "text-emerald-600" :
                      booking.status === "cancelled" ? "text-red-600" :
                      "text-amber-600"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clients récents */}
          <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              👥 Clients récents
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentClients.map((client) => (
                <div key={client.id} className="border-b border-purple-200/30 pb-3 last:border-0">
                  <div className="text-sm font-medium text-zinc-700">{client.name}</div>
                  <div className="text-xs text-zinc-500">{client.email}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Professionnels récents */}
          <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-pink-200/50">
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              💼 Professionnels récents
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentProfessionals.map((pro) => (
                <div key={pro.id} className="border-b border-pink-200/30 pb-3 last:border-0">
                  <div className="text-sm font-medium text-zinc-700">{pro.name}</div>
                  <div className="text-xs text-zinc-500">{pro.serviceType} · {pro.city}</div>
                  <div className="text-xs text-zinc-500">{pro.email}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

