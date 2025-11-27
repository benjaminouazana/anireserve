import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
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
  } catch (error: any) {
    console.error("Erreur API /api/bookings/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}
