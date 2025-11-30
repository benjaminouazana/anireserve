import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Mot de passe actuel et nouveau mot de passe requis" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Le nouveau mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    // Récupérer la session
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("pro_session")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer le professionnel
    const professional = await prisma.professional.findUnique({
      where: { id: Number(sessionId) },
    });

    if (!professional || !professional.password) {
      return NextResponse.json(
        { error: "Professionnel non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier le mot de passe actuel
    let isValid = false;
    if (professional.password.startsWith("$2")) {
      // Mot de passe hashé avec bcrypt
      isValid = await bcrypt.compare(currentPassword, professional.password);
    } else {
      // Ancien mot de passe en clair (pour migration)
      isValid = currentPassword === professional.password;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect" },
        { status: 401 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await prisma.professional.update({
      where: { id: professional.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: "Mot de passe modifié avec succès",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/pro/change-password:", errorMessage);
    return NextResponse.json(
      { error: error.message || "Erreur lors du changement de mot de passe" },
      { status: 500 }
    );
  }
}

