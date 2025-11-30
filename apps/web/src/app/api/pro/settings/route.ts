import { NextResponse } from "next/server";
import { getCurrentProfessional } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const professional = await getCurrentProfessional();

    if (!professional) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { bio, profileImage, gallery, phone, pricing } = await req.json();

    const updated = await prisma.professional.update({
      where: { id: professional.id },
      data: {
        ...(bio !== undefined && { bio }),
        ...(profileImage !== undefined && { profileImage }),
        ...(gallery !== undefined && { gallery }),
        ...(phone !== undefined && { phone }),
        ...(pricing !== undefined && { pricing }),
      },
      select: {
        id: true,
        name: true,
        bio: true,
        profileImage: true,
        gallery: true,
        phone: true,
        pricing: true,
      },
    });

    return NextResponse.json({
      message: "Profil mis à jour avec succès",
      professional: updated,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/pro/settings:", errorMessage);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}




