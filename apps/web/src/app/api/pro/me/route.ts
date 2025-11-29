import { NextResponse } from "next/server";
import { getCurrentProfessional } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const professional = await getCurrentProfessional();

    if (!professional) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const fullProfessional = await prisma.professional.findUnique({
      where: { id: professional.id },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        cities: true,
        serviceType: true,
        description: true,
        phone: true,
        bio: true,
        profileImage: true,
        gallery: true,
        pricing: true,
      },
    });

    return NextResponse.json(fullProfessional);
  } catch (error: any) {
    console.error("Erreur API /api/pro/me:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération du profil" },
      { status: 500 }
    );
  }
}




