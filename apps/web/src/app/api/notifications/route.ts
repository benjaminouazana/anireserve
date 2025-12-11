import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Système de notifications (mocké pour l'instant)
// En production, intégrer avec un service d'email (SendGrid, Resend, etc.)

export async function POST(req: Request) {
  try {
    const { type, bookingId, recipientEmail, recipientName } = await req.json();

    // Récupérer les détails du rendez-vous si nécessaire
    let booking = null;
    if (bookingId) {
      booking = await prisma.booking.findUnique({
        where: { id: Number(bookingId) },
        include: {
          client: true,
          professional: true,
        },
      });
    }

    // Simuler l'envoi d'une notification
    // En production, remplacer par un vrai service d'email
    console.log("📧 Notification à envoyer:", {
      type,
      to: recipientEmail,
      name: recipientName,
      booking: booking
        ? {
            date: booking.startTime,
            professional: booking.professional.name,
            client: booking.client.name,
          }
        : null,
    });

    // TODO: Intégrer avec un service d'email réel
    // Exemple avec Resend:
    // await resend.emails.send({
    //   from: 'AniReserve <noreply@anireserve.com>',
    //   to: recipientEmail,
    //   subject: getSubject(type),
    //   html: getEmailTemplate(type, booking),
    // });

    return NextResponse.json({
      success: true,
      message: "Notification envoyée (simulée)",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la notification" },
      { status: 500 }
    );
  }
}











