import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { bookingId, rating, comment } = await req.json();

    if (!bookingId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Un avis valide (1-5 étoiles) est requis" },
        { status: 400 }
      );
    }

    // Vérifier que la réservation existe et est confirmée
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        professional: true,
        client: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 }
      );
    }

    if (booking.status !== "confirmed") {
      return NextResponse.json(
        { error: "Tu ne peux laisser un avis que pour une réservation confirmée" },
        { status: 400 }
      );
    }

    // Vérifier qu'il n'y a pas déjà un avis pour cette réservation
    const existingReview = await prisma.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "Un avis existe déjà pour cette réservation" },
        { status: 400 }
      );
    }

    // Créer l'avis
    const review = await prisma.review.create({
      data: {
        bookingId,
        professionalId: booking.professionalId,
        clientId: booking.clientId,
        rating,
        comment: comment || null,
      },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Avis créé avec succès",
        review,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur API /api/reviews:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création de l'avis" },
      { status: 500 }
    );
  }
}

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

    const reviews = await prisma.review.findMany({
      where: {
        professionalId: parseInt(professionalId),
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculer la moyenne
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    });
  } catch (error: any) {
    console.error("Erreur API /api/reviews:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération des avis" },
      { status: 500 }
    );
  }
}

