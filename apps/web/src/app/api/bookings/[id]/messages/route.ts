import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentClient, getCurrentProfessional } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await getCurrentClient();
    const professional = await getCurrentProfessional();

    if (!client && !professional) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 }
      );
    }

    // Vérifier les permissions
    if (client && booking.clientId !== client.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    if (professional && booking.professionalId !== professional.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { bookingId: Number(id) },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("Erreur API /api/bookings/[id]/messages:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content } = await req.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Le message ne peut pas être vide" },
        { status: 400 }
      );
    }

    const client = await getCurrentClient();
    const professional = await getCurrentProfessional();

    if (!client && !professional) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 }
      );
    }

    // Déterminer le type d'expéditeur
    let senderId: number;
    let senderType: string;

    if (client && booking.clientId === client.id) {
      senderId = client.id;
      senderType = "client";
    } else if (professional && booking.professionalId === professional.id) {
      senderId = professional.id;
      senderType = "professional";
    } else {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        bookingId: Number(id),
        senderId,
        senderType,
        content: content.trim(),
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    console.error("Erreur API /api/bookings/[id]/messages:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}

