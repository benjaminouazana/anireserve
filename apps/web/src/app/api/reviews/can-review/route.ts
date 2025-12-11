import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentClient } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const professionalId = searchParams.get("professionalId");

    if (!professionalId) {
      return NextResponse.json(
        { error: "L'ID du professionnel est requis" },
        { status: 400 }
      );
    }

    // Vérifier si le client est connecté
    const client = await getCurrentClient();
    if (!client) {
      return NextResponse.json({
        canReview: false,
        reason: "not_logged_in",
        bookingId: null,
      });
    }

    // Chercher une réservation confirmée entre ce client et ce professionnel
    const confirmedBooking = await prisma.booking.findFirst({
      where: {
        clientId: client.id,
        professionalId: parseInt(professionalId),
        status: "confirmed",
      },
      orderBy: {
        startTime: "desc", // Prendre la plus récente
      },
    });

    if (!confirmedBooking) {
      return NextResponse.json({
        canReview: false,
        reason: "no_confirmed_booking",
        bookingId: null,
      });
    }

    // Vérifier si un avis existe déjà pour cette réservation
    const existingReview = await prisma.review.findUnique({
      where: { bookingId: confirmedBooking.id },
    });

    if (existingReview) {
      return NextResponse.json({
        canReview: false,
        reason: "already_reviewed",
        bookingId: confirmedBooking.id,
      });
    }

    return NextResponse.json({
      canReview: true,
      reason: null,
      bookingId: confirmedBooking.id,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/reviews/can-review:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}




