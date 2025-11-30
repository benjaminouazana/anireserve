import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // "pending" | "confirmed" | "cancelled"
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100); // Max 100
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const where: { status?: string } = {};
    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { startTime: "desc" },
      take: limit,
      skip,
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        professional: {
          select: {
            id: true,
            name: true,
            email: true,
            serviceType: true,
            city: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ bookings });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur récupération réservations:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

