import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail, sendProfessionalPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    // Chercher le client
    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      // Ne pas révéler si l'email existe ou non (sécurité)
      return NextResponse.json({
        message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Stocker le token (on peut utiliser un champ dans la DB ou une table séparée)
    // Pour l'instant, on va stocker dans un champ temporaire
    // Note: Il faudrait ajouter resetToken et resetTokenExpiry au modèle Client dans Prisma
    // Pour l'instant, on va utiliser une approche simple avec une table séparée ou un champ JSON

    // Stocker le token dans la base de données
    await prisma.client.update({
      where: { id: client.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetTokenExpiry,
      },
    });

    // Envoyer l'email de réinitialisation
    await sendPasswordResetEmail(email, client.name, resetToken);

    // TODO: Stocker le token dans la base de données
    // Pour l'instant, on simule juste l'envoi de l'email

    return NextResponse.json({
      message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
    });
  } catch (error: any) {
    console.error("Erreur forgot password:", error);
    return NextResponse.json(
      { error: "Erreur lors de la demande de réinitialisation" },
      { status: 500 }
    );
  }
}

