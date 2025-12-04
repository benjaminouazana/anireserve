import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, email, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Le token et le nouveau mot de passe sont requis" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    // Chercher le professionnel par token (plus sécurisé que par email)
    const professional = email 
      ? await prisma.professional.findUnique({ where: { email } })
      : await prisma.professional.findFirst({ where: { passwordResetToken: token } });

    if (!professional) {
      return NextResponse.json(
        { error: "Lien de réinitialisation invalide ou expiré" },
        { status: 400 }
      );
    }

    // Vérifier que le token correspond
    if (!professional.passwordResetToken || professional.passwordResetToken !== token) {
      return NextResponse.json(
        { error: "Lien de réinitialisation invalide ou expiré" },
        { status: 400 }
      );
    }

    // Vérifier que le token n'a pas expiré
    if (!professional.passwordResetExpires || professional.passwordResetExpires < new Date()) {
      return NextResponse.json(
        { error: "Le lien de réinitialisation a expiré. Veuillez en demander un nouveau." },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et supprimer le token
    await prisma.professional.update({
      where: { id: professional.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return NextResponse.json({
      message: "Mot de passe réinitialisé avec succès. Tu peux maintenant te connecter.",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur reset password:", errorMessage);
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation du mot de passe" },
      { status: 500 }
    );
  }
}




