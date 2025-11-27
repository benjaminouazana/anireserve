"use client";

import { useState } from "react";

export function CancelBookingButton({
  bookingId,
  startTime,
  onCancel,
}: {
  bookingId: number;
  startTime: string;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si on peut annuler (pas dans les 24h avant)
  const canCancel = (() => {
    const bookingStart = new Date(startTime);
    const now = new Date();
    const hoursUntilBooking = (bookingStart.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilBooking >= 24;
  })();

  async function handleCancel() {
    if (!canCancel) {
      setError("Impossible d'annuler une réservation moins de 24h avant la prestation.");
      return;
    }

    if (!confirm("Es-tu sûr de vouloir annuler cette réservation ?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'annulation");
      }

      onCancel();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'annulation");
    } finally {
      setLoading(false);
    }
  }

  if (!canCancel) {
    return (
      <div>
        <p className="text-xs text-zinc-500">
          Annulation impossible (moins de 24h avant)
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleCancel}
        disabled={loading}
        className="text-xs text-red-600 hover:text-red-700 transition font-medium disabled:opacity-70"
      >
        {loading ? "Annulation..." : "Annuler"}
      </button>
      {error && (
        <p className="mt-1 text-[10px] text-red-600">{error}</p>
      )}
    </div>
  );
}

