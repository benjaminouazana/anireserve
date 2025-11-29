"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type BookingActionsProps = {
  bookingId: number;
  currentStatus: string;
};

export function BookingActions({ bookingId, currentStatus }: BookingActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function updateStatus(newStatus: "confirmed" | "cancelled") {
    setLoading(newStatus);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Erreur");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setLoading(null);
    }
  }

  if (currentStatus === "cancelled") {
    return (
      <span className="text-[11px] text-zinc-400 italic">Annulé</span>
    );
  }

  return (
    <div className="flex gap-1.5 flex-wrap">
      <Link
        href={`/bookings/${bookingId}/chat`}
        className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700 transition hover:bg-blue-100"
        title="Ouvrir le chat"
      >
        💬
      </Link>
      {currentStatus === "pending" && (
        <>
          <button
            onClick={() => updateStatus("confirmed")}
            disabled={loading !== null}
            className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading === "confirmed" ? "..." : "Confirmer"}
          </button>
          <button
            onClick={() => updateStatus("cancelled")}
            disabled={loading !== null}
            className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading === "cancelled" ? "..." : "Annuler"}
          </button>
        </>
      )}
      {currentStatus === "confirmed" && (
        <button
          onClick={() => updateStatus("cancelled")}
          disabled={loading !== null}
          className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "cancelled" ? "..." : "Annuler"}
        </button>
      )}
    </div>
  );
}

