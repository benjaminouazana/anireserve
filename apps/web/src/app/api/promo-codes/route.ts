import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, bookingId } = await req.json();

    if (!code || !bookingId) {
      return NextResponse.json(
        { error: "code et bookingId requis" },
        { status: 400 }
      );
    }

    // Vérifier le code promo (pour l'instant, codes hardcodés, à remplacer par une table PromoCode)
    const validCodes: Record<string, { discount: number; type: "percentage" | "fixed" }> = {
      WELCOME10: { discount: 10, type: "percentage" },
      FIRST20: { discount: 20, type: "percentage" },
      SAVE50: { discount: 50, type: "fixed" },
    };

    const promoCode = validCodes[code.toUpperCase()];

    if (!promoCode) {
      return NextResponse.json(
        { error: "Code promo invalide" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || !booking.amount) {
      return NextResponse.json(
        { error: "Réservation introuvable ou sans montant" },
        { status: 404 }
      );
    }

    let discount = 0;
    if (promoCode.type === "percentage") {
      discount = (booking.amount * promoCode.discount) / 100;
    } else {
      discount = promoCode.discount;
    }

    const finalAmount = Math.max(0, booking.amount - discount);

    // Mettre à jour la réservation
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        promoCode: code.toUpperCase(),
        amount: finalAmount,
      },
    });

    return NextResponse.json({
      message: "Code promo appliqué",
      discount,
      finalAmount,
    });
  } catch (error: any) {
    console.error("Erreur API /api/promo-codes:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'application du code" },
      { status: 500 }
    );
  }
}




