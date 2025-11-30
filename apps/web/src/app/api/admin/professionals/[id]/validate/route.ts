import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { action, rejectionReason } = await req.json(); // action: "approve" | "reject"

    if (action === "approve") {
      const professional = await prisma.professional.update({
        where: { id: parseInt(id) },
        data: {
          status: "approved",
          rejectionReason: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
        },
      });

      // TODO: Envoyer un email au professionnel pour l'informer de l'approbation

      return NextResponse.json({
        message: "Profil approuvé avec succès",
        professional,
      });
    } else if (action === "reject") {
      if (!rejectionReason || !rejectionReason.trim()) {
        return NextResponse.json(
          { error: "Une raison de rejet est requise" },
          { status: 400 }
        );
      }

      const professional = await prisma.professional.update({
        where: { id: parseInt(id) },
        data: {
          status: "rejected",
          rejectionReason: rejectionReason.trim(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
        },
      });

      // TODO: Envoyer un email au professionnel pour l'informer du rejet avec la raison

      return NextResponse.json({
        message: "Profil rejeté",
        professional,
      });
    } else {
      return NextResponse.json(
        { error: "Action invalide. Utilise 'approve' ou 'reject'" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("Erreur validation profil:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Erreur lors de la validation" },
      { status: 500 }
    );
  }
}




