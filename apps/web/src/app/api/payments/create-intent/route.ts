import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { bookingId, amount } = await req.json();

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: "bookingId et amount requis" },
        { status: 400 }
      );
    }

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

    // Créer un PaymentIntent avec Stripe
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "") {
      // Mode simulation
      return NextResponse.json({
        clientSecret: "simulated_secret",
        simulated: true,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir en agorot (centimes)
      currency: "ils",
      metadata: {
        bookingId: booking.id.toString(),
        professionalId: booking.professionalId.toString(),
        clientId: booking.clientId.toString(),
      },
    });

    // Mettre à jour la réservation avec le paymentIntentId
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        amount,
        paymentIntentId: paymentIntent.id,
        paymentStatus: "pending",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Erreur API /api/payments/create-intent:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}

