"use client";

import { useState, useEffect } from "react";

type Booking = {
  id: number;
  startTime: Date;
  endTime: Date;
  client: { name: string; email: string };
  status: string;
};

type CalendarViewProps = {
  bookings: Array<{
    id: number;
    startTime: Date | string;
    endTime: Date | string;
    client: { name: string; email: string };
    status: string;
  }>;
};

export function CalendarView({ bookings }: CalendarViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Grouper les rendez-vous par jour
  const bookingsByDate = bookings.reduce((acc, booking) => {
    const start = new Date(booking.startTime);
    const dateKey = start.toISOString().split("T")[0];
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(booking);
    return acc;
  }, {} as Record<string, typeof bookings>);

  // Obtenir les 7 prochains jours - utiliser une date fixe pour éviter les problèmes d'hydratation
  const today = mounted ? new Date() : new Date(0);
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Ne pas rendre avant le montage pour éviter les différences serveur/client
  if (!mounted) {
    return (
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 bg-white p-3"
          >
            <div className="mb-2">
              <p className="text-xs font-semibold text-zinc-500">---</p>
              <p className="text-sm font-bold text-zinc-700">--</p>
            </div>
            <p className="text-[11px] text-zinc-400">Chargement...</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
      {next7Days.map((day) => {
        const dateKey = day.toISOString().split("T")[0];
        const dayBookings = bookingsByDate[dateKey] || [];
        const isToday = dateKey === new Date().toISOString().split("T")[0];

        return (
          <div
            key={dateKey}
            className={`rounded-xl border p-3 ${
              isToday
                ? "border-zinc-900 bg-zinc-50"
                : "border-zinc-200 bg-white"
            }`}
          >
            <div className="mb-2">
              <p
                className={`text-xs font-semibold ${
                  isToday ? "text-zinc-900" : "text-zinc-500"
                }`}
              >
                {day.toLocaleDateString("fr-FR", { weekday: "short" })}
              </p>
              <p
                className={`text-sm font-bold ${
                  isToday ? "text-zinc-900" : "text-zinc-700"
                }`}
              >
                {day.getDate()}
              </p>
            </div>

            <div className="space-y-1.5">
              {dayBookings.length === 0 ? (
                <p className="text-[11px] text-zinc-400">Aucun RDV</p>
              ) : (
                dayBookings.map((booking) => {
                  const start = new Date(booking.startTime);
                  const end = new Date(booking.endTime);
                  const statusColor =
                    booking.status === "confirmed"
                      ? "bg-emerald-100 border-emerald-300"
                      : booking.status === "cancelled"
                      ? "bg-red-100 border-red-300"
                      : "bg-amber-100 border-amber-300";

                  return (
                    <div
                      key={booking.id}
                      className={`rounded border px-1.5 py-1 text-[10px] ${statusColor}`}
                    >
                      <p className="font-medium text-zinc-900">
                        {start.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="truncate text-zinc-700">
                        {booking.client.name}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

