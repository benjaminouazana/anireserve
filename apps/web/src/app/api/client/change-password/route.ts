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
    const sessionId = cookieStore.get("client_session")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer le client
    const client = await prisma.client.findUnique({
      where: { id: Number(sessionId) },
    });

    if (!client || !client.password) {
      return NextResponse.json(
        { error: "Client non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier le mot de passe actuel
    let isValid = false;
    try {
      const bcryptModule = await import("bcryptjs");
      isValid = await bcryptModule.compare(currentPassword, client.password);
    } catch {
      // Fallback si bcrypt n'est pas disponible ou si le mot de passe est en clair
      isValid = currentPassword === client.password;
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
    await prisma.client.update({
      where: { id: client.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: "Mot de passe modifié avec succès",
    });
  } catch (error: any) {
    console.error("Erreur API /api/client/change-password:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors du changement de mot de passe" },
      { status: 500 }
    );
  }
}

