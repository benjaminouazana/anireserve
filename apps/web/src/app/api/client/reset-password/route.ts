import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, email, newPassword } = await req.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    // Chercher le client
    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Lien de réinitialisation invalide ou expiré" },
        { status: 400 }
      );
    }

    // TODO: Vérifier le token et sa date d'expiration
    // Pour l'instant, on accepte n'importe quel token (à améliorer avec stockage en DB)

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await prisma.client.update({
      where: { email },
      data: {
        password: hashedPassword,
        // TODO: Supprimer le resetToken après utilisation
      },
    });

    return NextResponse.json({
      message: "Mot de passe réinitialisé avec succès. Tu peux maintenant te connecter.",
    });
  } catch (error: any) {
    console.error("Erreur reset password:", error);
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation du mot de passe" },
      { status: 500 }
    );
  }
}




