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
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100); // Max 100
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        professional: {
          select: {
            id: true,
            name: true,
            serviceType: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        booking: {
          select: {
            id: true,
            startTime: true,
          },
        },
      },
    });

    return NextResponse.json({ reviews });
  } catch (error: unknown) {
    console.error("Erreur récupération avis:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

