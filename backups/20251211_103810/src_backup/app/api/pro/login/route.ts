import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { rateLimit, loginLimiter } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limiting: 5 tentatives par 15 minutes
  const rateLimitResult = await rateLimit(req, loginLimiter);
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const professional = await prisma.professional.findUnique({
      where: { email },
    });

    // Vérifier que le profil est approuvé
    if (professional && professional.status !== "approved") {
      if (professional.status === "pending") {
        return NextResponse.json(
          { error: "Ton profil est en cours de vérification. Tu recevras un email dès qu'il sera validé." },
          { status: 403 }
        );
      }
      if (professional.status === "rejected") {
        return NextResponse.json(
          { error: "Ton profil a été rejeté. Contacte-nous pour plus d'informations." },
          { status: 403 }
        );
      }
    }

    if (!professional || !professional.password) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Comparer le mot de passe avec bcrypt uniquement
    // ⚠️ SÉCURITÉ: Les mots de passe en clair ne sont plus supportés
    let isValid = false;
    // Vérifier que le mot de passe est hashé (commence par $2)
    if (!professional.password.startsWith("$2")) {
      console.error(`🔴 SÉCURITÉ: Mot de passe non hashé détecté pour le professionnel ${professional.email} - Connexion refusée. Migration requise.`);
      return NextResponse.json(
        { error: "Votre compte nécessite une mise à jour de sécurité. Veuillez contacter le support." },
        { status: 403 }
      );
    }
    // Comparer avec bcrypt
    isValid = await bcrypt.compare(password, professional.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Créer la session persistante (30 jours)
    const cookieStore = await cookies();
    cookieStore.set("pro_session", professional.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 jours pour sessions persistantes
      path: "/",
    });

    return NextResponse.json({
      id: professional.id,
      name: professional.name,
      email: professional.email,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}

