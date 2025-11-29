import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendProfessionalPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    // Chercher le professionnel
    const professional = await prisma.professional.findUnique({
      where: { email },
    });

    if (!professional) {
      // Ne pas révéler si l'email existe ou non (sécurité)
      return NextResponse.json({
        message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
      });
    }

    // Vérifier que le profil est approuvé
    if (professional.status !== "approved") {
      return NextResponse.json({
        message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Stocker le token dans la base de données
    await prisma.professional.update({
      where: { id: professional.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetTokenExpiry,
      },
    });

    // Envoyer l'email de réinitialisation
    await sendProfessionalPasswordResetEmail(email, professional.name, resetToken);

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

