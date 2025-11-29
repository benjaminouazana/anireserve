import { prisma } from "@/lib/prisma";
import { getCurrentProfessional } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AnalyticsCharts } from "./AnalyticsCharts";

export default async function AnalyticsPage() {
  const professional = await getCurrentProfessional();

  if (!professional) {
    redirect("/pro/login");
  }

  // Récupérer toutes les réservations
  const bookings = await prisma.booking.findMany({
    where: {
      professionalId: professional.id,
    },
    include: {
      client: true,
    },
    orderBy: { startTime: "desc" },
  });

  // Calculer les statistiques
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length;
  const confirmationRate = totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0;

  // Statistiques par mois (6 derniers mois)
  const monthlyStats = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const monthBookings = bookings.filter((b) => {
      const bookingDate = new Date(b.startTime);
      return bookingDate >= monthStart && bookingDate <= monthEnd;
    });

    return {
      month: date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" }),
      total: monthBookings.length,
      confirmed: monthBookings.filter((b) => b.status === "confirmed").length,
      cancelled: monthBookings.filter((b) => b.status === "cancelled").length,
    };
  }).reverse();

  // Prochaines réservations
  const upcomingBookings = bookings
    .filter((b) => b.status === "confirmed" && new Date(b.startTime) > new Date())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-8 lg:px-12">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/pro/dashboard"
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 transition"
          >
            ← Retour au tableau de bord
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Statistiques et analytics
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Analyse de tes performances et de tes réservations
          </p>
        </div>

        {/* Métriques principales */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-zinc-500">Total réservations</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">{totalBookings}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-zinc-500">Confirmées</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-600">{confirmedBookings}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-zinc-500">En attente</p>
            <p className="mt-1 text-2xl font-semibold text-amber-600">{pendingBookings}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-zinc-500">Taux de confirmation</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">
              {Math.round(confirmationRate)}%
            </p>
          </div>
        </div>

        {/* Graphiques */}
        <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Évolution sur 6 mois
          </h2>
          <AnalyticsCharts monthlyStats={monthlyStats} />
        </div>

        {/* Prochaines réservations */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Prochaines réservations confirmées
          </h2>
          {upcomingBookings.length === 0 ? (
            <p className="text-sm text-zinc-500">Aucune réservation à venir</p>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => {
                const date = new Date(booking.startTime);
                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-900">
                        {booking.client.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {date.toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        à {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




