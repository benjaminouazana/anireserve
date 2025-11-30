import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentClient } from "@/lib/auth";
import { sendBookingStatusChangeEmail } from "@/lib/email";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = await getCurrentClient();
    if (!client) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: {
        client: true,
        professional: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 }
      );
    }

    if (booking.clientId !== client.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }

    // Vérifier que la réservation peut être annulée (pas déjà annulée, pas dans le passé)
    if (booking.status === "cancelled") {
      return NextResponse.json(
        { error: "Cette réservation est déjà annulée" },
        { status: 400 }
      );
    }

    if (new Date(booking.startTime) < new Date()) {
      return NextResponse.json(
        { error: "Impossible d'annuler une réservation passée" },
        { status: 400 }
      );
    }

    // Vérifier qu'on n'est pas dans les 24h avant la prestation
    const startTime = new Date(booking.startTime);
    const now = new Date();
    const hoursUntilBooking = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilBooking < 24) {
      return NextResponse.json(
        { error: "Impossible d'annuler une réservation moins de 24h avant la prestation" },
        { status: 400 }
      );
    }

    // Annuler la réservation
    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: "cancelled" },
      include: {
        client: true,
        professional: true,
      },
    });

    // Envoyer un email
    try {
      const dateStr = booking.startTime.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = booking.startTime.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      await sendBookingStatusChangeEmail(
        booking.professional.email,
        booking.professional.name,
        booking.professional.name,
        booking.client.name,
        dateStr,
        timeStr,
        "cancelled"
      );
    } catch (error) {
      console.error("Erreur envoi email:", error);
    }

    return NextResponse.json({
      message: "Réservation annulée avec succès",
      booking: updated,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/bookings/[id]/cancel:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de l'annulation" },
      { status: 500 }
    );
  }
}

