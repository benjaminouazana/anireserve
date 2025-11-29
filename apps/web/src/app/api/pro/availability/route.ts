import { NextResponse } from "next/server";
import { getCurrentProfessional } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const professional = await getCurrentProfessional();

    if (!professional) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const fullProfessional = await prisma.professional.findUnique({
      where: { id: professional.id },
      select: {
        availability: true,
        breakStart: true,
        breakEnd: true,
      },
    });

    return NextResponse.json({
      availability: fullProfessional?.availability,
      breakStart: fullProfessional?.breakStart,
      breakEnd: fullProfessional?.breakEnd,
    });
  } catch (error: any) {
    console.error("Erreur API /api/pro/availability:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const professional = await getCurrentProfessional();

    if (!professional) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { availability, breakStart, breakEnd } = await req.json();

    await prisma.professional.update({
      where: { id: professional.id },
      data: {
        ...(availability !== undefined && { availability }),
        ...(breakStart !== undefined && { breakStart }),
        ...(breakEnd !== undefined && { breakEnd }),
      },
    });

    return NextResponse.json({
      message: "Disponibilités mises à jour avec succès",
    });
  } catch (error: any) {
    console.error("Erreur API /api/pro/availability:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}




