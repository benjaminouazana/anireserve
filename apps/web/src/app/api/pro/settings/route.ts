import { NextResponse } from "next/server";
import { getCurrentProfessional } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const professional = await getCurrentProfessional();

    if (!professional) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { bio, profileImage, gallery, phone } = await req.json();

    const updated = await prisma.professional.update({
      where: { id: professional.id },
      data: {
        ...(bio !== undefined && { bio }),
        ...(profileImage !== undefined && { profileImage }),
        ...(gallery !== undefined && { gallery }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true,
        name: true,
        bio: true,
        profileImage: true,
        gallery: true,
        phone: true,
      },
    });

    return NextResponse.json({
      message: "Profil mis à jour avec succès",
      professional: updated,
    });
  } catch (error: any) {
    console.error("Erreur API /api/pro/settings:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}

