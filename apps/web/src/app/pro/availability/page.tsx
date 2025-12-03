"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type TimeSlot = {
  start: string;
  end: string;
};

type DaySchedule = {
  enabled: boolean;
  slots: TimeSlot[];
};

type Availability = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
  slotDuration: number;
  breakStart: string;
  breakEnd: string;
};

const defaultAvailability: Availability = {
  monday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
  tuesday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
  wednesday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
  thursday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
  friday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
  saturday: { enabled: false, slots: [{ start: "09:00", end: "18:00" }] },
  sunday: { enabled: false, slots: [{ start: "09:00", end: "18:00" }] },
  slotDuration: 30,
  breakStart: "12:00",
  breakEnd: "13:00",
};

export default function AvailabilityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState<Availability>(defaultAvailability);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadAvailability() {
      try {
        const response = await fetch("/api/pro/availability");
        if (response.ok) {
          const data = await response.json();
          if (data.availability) {
            const parsed = JSON.parse(data.availability);
            // Convertir l'ancien format (start/end) au nouveau format (slots[])
            const converted = { ...defaultAvailability };
            Object.keys(converted).forEach((day) => {
              if (day === "slotDuration" || day === "breakStart" || day === "breakEnd") return;
              const dayKey = day as keyof Availability;
              const dayData = parsed[day];
              if (dayData && (dayKey === "monday" || dayKey === "tuesday" || dayKey === "wednesday" || dayKey === "thursday" || dayKey === "friday" || dayKey === "saturday" || dayKey === "sunday")) {
                if (dayData.slots && Array.isArray(dayData.slots)) {
                  converted[dayKey] = dayData as DaySchedule;
                } else if (dayData.start && dayData.end) {
                  // Ancien format : convertir en nouveau format
                  converted[dayKey] = {
                    enabled: dayData.enabled || false,
                    slots: [{ start: dayData.start, end: dayData.end }],
                  };
                }
              }
            });
            if (parsed.slotDuration) converted.slotDuration = parsed.slotDuration;
            if (parsed.breakStart) converted.breakStart = parsed.breakStart;
            if (parsed.breakEnd) converted.breakEnd = parsed.breakEnd;
            setAvailability(converted);
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement", err);
      } finally {
        setLoading(false);
      }
    }
    loadAvailability();
  }, []);

  function updateDay(day: keyof Availability, field: keyof DaySchedule, value: boolean) {
    if (field === "enabled") {
      setAvailability((prev) => ({
        ...prev,
        [day]: {
          ...(prev[day] as DaySchedule),
          enabled: value,
        },
      } as Availability));
    }
  }

  function updateSlot(day: keyof Availability, slotIndex: number, field: "start" | "end", value: string) {
    setAvailability((prev) => {
      const daySchedule = prev[day] as DaySchedule;
      const newSlots = [...daySchedule.slots];
      newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value };
      return {
        ...prev,
        [day]: {
          ...daySchedule,
          slots: newSlots,
        },
      };
    });
  }

  function addSlot(day: keyof Availability) {
    setAvailability((prev) => {
      const daySchedule = prev[day] as DaySchedule;
      return {
        ...prev,
        [day]: {
          ...daySchedule,
          slots: [...daySchedule.slots, { start: "09:00", end: "10:00" }],
        },
      } as Availability;
    });
  }

  function removeSlot(day: keyof Availability, slotIndex: number) {
    setAvailability((prev) => {
      const daySchedule = prev[day] as DaySchedule;
      const newSlots = daySchedule.slots.filter((_, i) => i !== slotIndex);
      return {
        ...prev,
        [day]: {
          ...daySchedule,
          slots: newSlots.length > 0 ? newSlots : [{ start: "09:00", end: "10:00" }],
        },
      } as Availability;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/pro/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availability: JSON.stringify(availability),
          breakStart: availability.breakStart,
          breakEnd: availability.breakEnd,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Chargement...</p>
      </div>
    );
  }

  const days = [
    { key: "monday", label: "Lundi" },
    { key: "tuesday", label: "Mardi" },
    { key: "wednesday", label: "Mercredi" },
    { key: "thursday", label: "Jeudi" },
    { key: "friday", label: "Vendredi" },
    { key: "saturday", label: "Samedi" },
    { key: "sunday", label: "Dimanche" },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-10 sm:px-8 lg:px-12">
        <Link
          href="/pro/dashboard"
          className="mb-6 inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 transition"
        >
          ← Retour au tableau de bord
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-100">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Gérer mes disponibilités
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Configure tes heures de travail et tes créneaux disponibles
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Durée des créneaux */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-800">
                Durée des créneaux (minutes)
              </label>
              <select
                value={availability.slotDuration}
                onChange={(e) =>
                  setAvailability({ ...availability, slotDuration: parseInt(e.target.value) })
                }
                className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 heure</option>
                <option value={90}>1h30</option>
                <option value={120}>2 heures</option>
              </select>
            </div>

            {/* Pause déjeuner */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-800">
                Pause déjeuner
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-zinc-600">Début</label>
                  <input
                    type="time"
                    value={availability.breakStart}
                    onChange={(e) =>
                      setAvailability({ ...availability, breakStart: e.target.value })
                    }
                    className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-600">Fin</label>
                  <input
                    type="time"
                    value={availability.breakEnd}
                    onChange={(e) =>
                      setAvailability({ ...availability, breakEnd: e.target.value })
                    }
                    className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  />
                </div>
              </div>
            </div>

            {/* Jours de la semaine */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-800">
                Horaires par jour
              </label>
              {days.map((day) => (
                <div
                  key={day.key}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={day.key}
                        checked={availability[day.key].enabled}
                        onChange={(e) =>
                          updateDay(day.key, "enabled", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                      />
                      <label
                        htmlFor={day.key}
                        className="text-sm font-medium text-zinc-800"
                      >
                        {day.label}
                      </label>
                    </div>
                  </div>
                  {availability[day.key].enabled && (
                    <div className="space-y-3 ml-7">
                      {availability[day.key].slots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center gap-2">
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) =>
                              updateSlot(day.key, slotIndex, "start", e.target.value)
                            }
                            className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                          />
                          <span className="text-xs text-zinc-500">-</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) =>
                              updateSlot(day.key, slotIndex, "end", e.target.value)
                            }
                            className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                          />
                          {availability[day.key].slots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSlot(day.key, slotIndex)}
                              className="rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-700 transition hover:bg-red-100"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSlot(day.key)}
                        className="text-xs text-zinc-600 hover:text-zinc-900 font-medium flex items-center gap-1"
                      >
                        + Ajouter une tranche horaire
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                ✅ Disponibilités sauvegardées avec succès !
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Sauvegarde..." : "Sauvegarder les disponibilités"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

