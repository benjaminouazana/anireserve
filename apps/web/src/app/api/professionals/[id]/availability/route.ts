import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date"); // "YYYY-MM-DD"

    if (!date) {
      return NextResponse.json(
        { error: "Date requise" },
        { status: 400 }
      );
    }

    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    // Récupérer tous les rendez-vous confirmés ou en attente pour ce pro à cette date
    const bookings = await prisma.booking.findMany({
      where: {
        professionalId: Number(id),
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["pending", "confirmed"],
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Formater les créneaux occupés
    const occupiedSlots = bookings.map((b) => ({
      start: b.startTime.toISOString(),
      end: b.endTime.toISOString(),
    }));

    return NextResponse.json({ occupiedSlots });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des disponibilités" },
      { status: 500 }
    );
  }
}

