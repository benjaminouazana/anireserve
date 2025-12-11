import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfessional } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    return NextResponse.json({
      ...booking,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/bookings/[id]:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!status || !["confirmed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide. Utilise 'confirmed' ou 'cancelled'" },
        { status: 400 }
      );
    }

    // Récupérer la réservation avec les relations
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

    // Vérifier que seul le professionnel peut modifier le statut
    const pro = await getCurrentProfessional();
    if (!pro || pro.id !== booking.professionalId) {
      return NextResponse.json(
        { error: "Non autorisé. Seul le professionnel peut modifier cette réservation." },
        { status: 403 }
      );
    }

    // Mettre à jour le statut
    const updatedBooking = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        client: true,
        professional: true,
      },
    });

    // Envoyer les emails appropriés
    try {
      const {
        sendBookingConfirmationEmail,
        sendBookingConfirmedEmailToPro,
        sendBookingCancelledEmailToClient,
        sendBookingCancelledEmailToPro,
      } = await import("@/lib/email");

      const dateStr = booking.startTime.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = `${booking.startTime.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${booking.endTime.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      if (status === "confirmed") {
        // Email au client : réservation confirmée
        await sendBookingConfirmationEmail(
          booking.client.email,
          booking.client.name,
          booking.professional.name,
          dateStr,
          timeStr
        );

        // Email au pro : confirmation envoyée
        await sendBookingConfirmedEmailToPro(
          booking.professional.email,
          booking.professional.name,
          booking.client.name,
          dateStr,
          timeStr
        );
      } else if (status === "cancelled") {
        // Email au client : réservation annulée
        await sendBookingCancelledEmailToClient(
          booking.client.email,
          booking.client.name,
          booking.professional.name,
          dateStr,
          timeStr
        );

        // Email au pro : annulation envoyée
        await sendBookingCancelledEmailToPro(
          booking.professional.email,
          booking.professional.name,
          booking.client.name,
          dateStr,
          timeStr
        );
      }
    } catch (error) {
      console.error("Erreur envoi email:", error);
      // Ne pas bloquer la mise à jour si l'email échoue
    }

    return NextResponse.json({
      message: `Réservation ${status === "confirmed" ? "confirmée" : "annulée"} avec succès`,
      booking: {
        ...updatedBooking,
        startTime: updatedBooking.startTime.toISOString(),
        endTime: updatedBooking.endTime.toISOString(),
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/bookings/[id] PATCH:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
