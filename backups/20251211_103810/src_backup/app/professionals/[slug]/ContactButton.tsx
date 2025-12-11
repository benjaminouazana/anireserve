"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

interface ContactButtonProps {
  professionalId: number;
  professionalName: string;
  professionalEmail: string;
}

export function ContactButton({ professionalId, professionalName, professionalEmail }: ContactButtonProps) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function handleStartConversation() {
    setLoading(true);

    try {
      // Vérifier si le client est connecté
      const clientRes = await fetch("/api/client/me");
      
      if (!clientRes.ok) {
        // Pas connecté, inviter à se connecter ou créer une réservation
        const shouldLogin = confirm(
          "Pour contacter ce professionnel, vous devez être connecté.\n\n" +
          "Voulez-vous vous connecter maintenant ?"
        );
        
        if (shouldLogin) {
          router.push(`/client/login`);
        }
        return;
      }

      const client = await clientRes.json();

      // Chercher une réservation existante entre ce client et ce pro
      const bookingsRes = await fetch(`/api/bookings?email=${encodeURIComponent(client.email)}`);
      
      if (bookingsRes.ok) {
        const bookings = await bookingsRes.json();
        const existingBooking = Array.isArray(bookings) 
          ? bookings.find((b: any) => b.professional?.id === professionalId && b.status !== "cancelled")
          : null;

        if (existingBooking) {
          // Rediriger vers le chat de la réservation existante
          router.push(`/bookings/${existingBooking.id}/chat`);
          return;
        }
      }

      // Pas de réservation existante, créer une réservation "conversation"
      // On crée une réservation avec une date dans le futur lointain pour permettre la conversation
      // Cette réservation servira uniquement de support pour la conversation
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 365); // 1 an dans le futur pour éviter les conflits
      const dateStr = futureDate.toISOString().split("T")[0];

      const createBookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId,
          clientName: client.name,
          clientEmail: client.email,
          date: dateStr,
          startTime: "10:00",
          endTime: "10:30",
        }),
      });

      if (createBookingRes.ok) {
        const bookingData = await createBookingRes.json();
        // Rediriger vers le chat
        router.push(`/bookings/${bookingData.booking.id}/chat`);
        toast.showToast("Conversation créée avec succès !", "success");
      } else {
        const errorData = await createBookingRes.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de la création de la conversation");
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.showToast(err.message || "Erreur lors de la création de la conversation", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleStartConversation}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover-lift transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <span className="animate-spin">⏳</span>
          <span>Chargement...</span>
        </>
      ) : (
        <>
          <span>💬</span>
          <span>Contacter</span>
        </>
      )}
    </button>
  );
}

