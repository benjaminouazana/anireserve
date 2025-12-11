import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const professionals = await prisma.professional.findMany({
      where: {
        status: "pending",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        cities: true,
        serviceType: true,
        services: true,
        subcategories: true,
        description: true,
        teoudatZeout: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ professionals });
  } catch (error: unknown) {
    console.error("Erreur récupération profils en attente:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}












