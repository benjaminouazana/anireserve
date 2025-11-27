import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { professionalId, clientName, clientEmail, date, startTime, endTime } =
      await req.json();

    if (!professionalId || !clientName || !clientEmail || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Créer les dates complètes
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    if (endDateTime <= startDateTime) {
      return NextResponse.json(
        { error: "L'heure de fin doit être après l'heure de début" },
        { status: 400 }
      );
    }

    // Vérifier les conflits
    const overlapping = await prisma.booking.findFirst({
      where: {
        professionalId,
        status: { not: "cancelled" },
        OR: [
          {
            AND: [
              { startTime: { lte: startDateTime } },
              { endTime: { gt: startDateTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endDateTime } },
              { endTime: { gte: endDateTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startDateTime } },
              { endTime: { lte: endDateTime } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      return NextResponse.json(
        { error: "Ce créneau est déjà réservé. Choisis un autre horaire." },
        { status: 400 }
      );
    }

    // Upsert du client (sans mot de passe si nouveau, pour compatibilité)
    const client = await prisma.client.upsert({
      where: { email: clientEmail },
      update: { name: clientName },
      create: { 
        name: clientName, 
        email: clientEmail,
        password: null, // Pas de mot de passe par défaut, l'utilisateur peut s'inscrire plus tard
      },
    });

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        professionalId,
        clientId: client.id,
        startTime: startDateTime,
        endTime: endDateTime,
        status: "pending",
      },
      include: {
        professional: true,
        client: true,
      },
    });

    // Envoyer un email de confirmation au client
    try {
      const { sendBookingConfirmationEmail } = await import("@/lib/email");
      const dateStr = startDateTime.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = `${startTime} - ${endTime}`;

      await sendBookingConfirmationEmail(
        client.email,
        client.name,
        booking.professional.name,
        dateStr,
        timeStr
      );
    } catch (error) {
      console.error("Erreur envoi email:", error);
    }

    return NextResponse.json(
      {
        message: "Réservation créée avec succès. Le paiement se fera sur place au moment de la prestation.",
        booking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur API /api/bookings:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création de la réservation" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    // Trouver le client par email (optimisé avec select)
    const client = await prisma.client.findUnique({
      where: { email },
      select: {
        id: true,
        bookings: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            status: true,
            professional: {
              select: {
                id: true,
                name: true,
                serviceType: true,
                city: true,
              },
            },
          },
          orderBy: { startTime: "desc" },
          take: 50, // Limiter à 50 réservations
        },
      },
    });

    if (!client) {
      return NextResponse.json([]);
    }

    const bookings = client.bookings.map((booking) => ({
      id: booking.id,
      professional: booking.professional,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
    }));

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("Erreur API /api/bookings:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération des réservations" },
      { status: 500 }
    );
  }
}
