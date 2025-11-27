"use client";

import { useState } from "react";
import Link from "next/link";

type Slot = {
  time: string;
  available: boolean;
};

export function CalendarView({ professionalId }: { professionalId: number }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadSlots(date: string) {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/professionals/${professionalId}/slots?date=${date}`
      );
      if (response.ok) {
        const data = await response.json();
        setSlots(
          data.availableSlots.map((time: string) => ({
            time,
            available: true,
          }))
        );
      }
    } catch (error) {
      console.error("Erreur chargement créneaux", error);
    } finally {
      setLoading(false);
    }
  }

  function handleDateChange(date: string) {
    setSelectedDate(date);
    loadSlots(date);
  }

  // Générer les jours du mois actuel
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-zinc-500">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = dateStr === new Date().toISOString().split("T")[0];
          const isSelected = dateStr === selectedDate;
          const isPast = new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <button
              key={day}
              onClick={() => !isPast && handleDateChange(dateStr)}
              disabled={isPast}
              className={`aspect-square rounded-lg text-sm font-medium transition ${
                isSelected
                  ? "bg-zinc-900 text-white"
                  : isToday
                  ? "bg-zinc-100 text-zinc-900"
                  : isPast
                  ? "bg-zinc-50 text-zinc-300 cursor-not-allowed"
                  : "bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4">
          <h3 className="mb-3 text-sm font-semibold text-zinc-900">
            Créneaux disponibles le{" "}
            {new Date(selectedDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
            })}
          </h3>
          {loading ? (
            <p className="text-sm text-zinc-500">Chargement...</p>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot) => (
                <Link
                  key={slot.time}
                  href={`/?proId=${professionalId}&date=${selectedDate}&time=${slot.time}`}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-center text-xs font-medium text-zinc-700 transition hover:border-zinc-900 hover:bg-zinc-50"
                >
                  {slot.time}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Aucun créneau disponible</p>
          )}
        </div>
      )}
    </div>
  );
}

