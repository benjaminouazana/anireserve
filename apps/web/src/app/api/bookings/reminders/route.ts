import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingReminderEmail } from "@/lib/email";

// Cette route peut être appelée par un cron job pour envoyer des rappels
export async function POST(req: Request) {
  try {
    // Récupérer les réservations confirmées pour demain
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        status: "confirmed",
        startTime: {
          gte: tomorrow,
          lte: tomorrowEnd,
        },
      },
      include: {
        client: true,
        professional: true,
      },
    });

    const results = [];

    for (const booking of bookings) {
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

        await sendBookingReminderEmail(
          booking.client.email,
          booking.client.name,
          booking.professional.name,
          dateStr,
          timeStr
        );

        results.push({ bookingId: booking.id, success: true });
      } catch (error) {
        results.push({ bookingId: booking.id, success: false, error });
      }
    }

    return NextResponse.json({
      message: `${results.length} rappels envoyés`,
      results,
    });
  } catch (error: any) {
    console.error("Erreur API /api/bookings/reminders:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'envoi des rappels" },
      { status: 500 }
    );
  }
}

