import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getCurrentProfessional } from "@/lib/auth";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { generateSlug } from "@/lib/slug-utils";
import type { Professional } from "@/types/professional";

// Fonction pour obtenir le slug d'un professionnel
function getProfessionalSlug(pro: Professional): string {
  if (pro.slug) return pro.slug;
  return generateSlug(pro.name);
}

// Lazy loading des composants lourds (sans ssr: false car c'est un Server Component)
const BookingActions = dynamic(() => import("./BookingActions").then(mod => ({ default: mod.BookingActions })), {
  loading: () => <div className="text-center py-4 text-zinc-500">Chargement...</div>,
});

const LogoutButton = dynamic(() => import("./LogoutButton").then(mod => ({ default: mod.LogoutButton })), {
  loading: () => <div className="text-center py-2 text-zinc-500">Chargement...</div>,
});

const CalendarView = dynamic(() => import("./CalendarView").then(mod => ({ default: mod.CalendarView })), {
  loading: () => <div className="text-center py-8 text-zinc-500">Chargement du calendrier...</div>,
});

export default async function ProDashboardPage() {
  const professional = await getCurrentProfessional();

  if (!professional) {
    redirect("/pro/login");
  }

  // Optimisation : ne charger que les champs nécessaires et limiter aux prochains 30 jours
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const bookings = await prisma.booking.findMany({
    where: {
      professionalId: professional.id,
      startTime: {
        gte: now,
        lte: thirtyDaysFromNow,
      },
    },
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      client: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    take: 100, // Limiter à 100 réservations max
  });

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10 sm:px-8 lg:px-12">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Tableau de bord professionnel
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Bonjour {professional.name} · {bookings.length} rendez-vous
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/professionals/${getProfessionalSlug(professional)}`}
              className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              Voir mon profil
            </Link>
            <Link
              href="/pro/analytics"
              className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              📊 Statistiques
            </Link>
            <Link
              href="/pro/availability"
              className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              📅 Disponibilités
            </Link>
            <Link
              href="/pro/settings"
              className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              ⚙️ Paramètres
            </Link>
            <Link
              href="/pro/create-booking"
              className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-100"
            >
              ➕ Créer une réservation
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              ← Accueil
            </Link>
            <LogoutButton />
          </div>
        </header>

        <main className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            <h2 className="text-lg font-semibold text-zinc-900">
              Calendrier (7 prochains jours)
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Vue d'ensemble de tes rendez-vous
            </p>
            <CalendarView bookings={bookings} />
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            <h2 className="text-lg font-semibold text-zinc-900">
              Liste des rendez-vous
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {bookings.length} rendez-vous au total
            </p>

            {bookings.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
              Aucun rendez-vous pour le moment.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-xs text-zinc-700">
                <thead>
                  <tr className="border-b border-zinc-100 text-[11px] uppercase tracking-wide text-zinc-400">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Heure</th>
                    <th className="py-2 pr-4">Client</th>
                    <th className="py-2 pr-4">Email client</th>
                    <th className="py-2 pr-4">Statut</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const start = new Date(b.startTime);
                    const end = new Date(b.endTime);
                    const dateStr = start.toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });
                    const timeStr = `${start.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} - ${end.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`;

                    const statusColor =
                      b.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-700"
                        : b.status === "cancelled"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700";

                    return (
                      <tr
                        key={b.id}
                        className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition"
                      >
                        <td className="py-3 pr-4 text-xs text-zinc-700 font-medium">
                          {dateStr}
                        </td>
                        <td className="py-3 pr-4 text-xs text-zinc-700">
                          {timeStr}
                        </td>
                        <td className="py-3 pr-4 text-xs text-zinc-900 font-medium">
                          {b.client.name}
                        </td>
                        <td className="py-3 pr-4 text-xs text-zinc-500">
                          {b.client.email}
                        </td>
                        <td className="py-3 pr-4 text-xs">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColor}`}
                          >
                            {b.status === "confirmed"
                              ? "Confirmé"
                              : b.status === "cancelled"
                              ? "Annulé"
                              : "En attente"}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <BookingActions
                            bookingId={b.id}
                            currentStatus={b.status}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          </section>
        </main>
      </div>
    </div>
  );
}


