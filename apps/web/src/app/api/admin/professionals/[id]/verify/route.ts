import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { verified } = await request.json();
    const professionalId = parseInt(context.params.id);

    const professional = await prisma.professional.update({
      where: { id: professionalId },
      data: { verified: verified === true },
      select: {
        id: true,
        name: true,
        verified: true,
      },
    });

    return NextResponse.json({
      message: verified ? "Professionnel vérifié" : "Vérification retirée",
      professional,
    });
  } catch (error: unknown) {
    console.error("Erreur vérification professionnel:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}




