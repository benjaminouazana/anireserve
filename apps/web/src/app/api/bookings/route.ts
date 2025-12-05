import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendBookingRequestEmailToClient,
  sendBookingRequestEmailToPro,
} from "@/lib/email";
import { rateLimit, bookingLimiter } from "@/lib/rate-limit";

// Créer une réservation
export async function POST(req: Request) {
  // Rate limiting: 10 réservations par minute
  const rateLimitResult = await rateLimit(req, bookingLimiter);
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

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

    // Vérifier les conflits (seulement avec les réservations confirmées ou en attente)
    const overlapping = await prisma.booking.findFirst({
      where: {
        professionalId,
        status: { in: ["pending", "confirmed"] }, // Exclure seulement les annulées
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

    // Vérifier si l'email appartient à un professionnel
    // Si oui, permettre au professionnel de réserver en tant que client
    const professionalAsClient = await prisma.professional.findUnique({
      where: { email: clientEmail },
      select: { id: true, name: true },
    });

    // Empêcher un professionnel de réserver avec lui-même
    if (professionalAsClient && professionalAsClient.id === professionalId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas réserver avec vous-même" },
        { status: 400 }
      );
    }

    // Upsert du client (sans mot de passe si nouveau, pour compatibilité)
    // Si c'est un professionnel qui réserve, utiliser ses infos du compte pro
    const clientNameToUse = professionalAsClient ? professionalAsClient.name : clientName;

    const client = await prisma.client.upsert({
      where: { email: clientEmail },
      update: {
        name: clientNameToUse,
        // Si c'est un professionnel, on peut aussi mettre à jour les autres infos
        ...(professionalAsClient ? {} : { name: clientName }),
      },
      create: {
        name: clientNameToUse,
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

    // Envoyer des emails (client et pro)
    try {
      const { sendBookingRequestEmailToClient, sendBookingRequestEmailToPro } = await import("@/lib/email");
      const dateStr = startDateTime.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = `${startTime} - ${endTime}`;

      // Email au client : demande créée
      await sendBookingRequestEmailToClient(
        client.email,
        client.name,
        booking.professional.name,
        dateStr,
        timeStr
      );

      // Email au pro : nouvelle demande
      await sendBookingRequestEmailToPro(
        booking.professional.email,
        booking.professional.name,
        client.name,
        client.email,
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/bookings:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la création de la réservation" },
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

    const bookings = client.bookings.map((booking: {
      id: number;
      professional: { id: number; name: string; serviceType: string; city: string };
      startTime: Date;
      endTime: Date;
      status: string;
    }) => ({
      id: booking.id,
      professional: booking.professional,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
    }));

    return NextResponse.json(bookings);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/bookings:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la récupération des réservations" },
      { status: 500 }
    );
  }
}
