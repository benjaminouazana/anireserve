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

    // Comparer le mot de passe avec bcrypt
    // ⚠️ SÉCURITÉ: Support temporaire pour les anciens mots de passe en clair (migration progressive)
    // TODO: Supprimer ce fallback après migration complète de tous les mots de passe
    let isValid = false;
    if (professional.password.startsWith("$2")) {
      // Mot de passe hashé avec bcrypt
      isValid = await bcrypt.compare(password, professional.password);
    } else {
      // Ancien mot de passe en clair (pour migration - À SUPPRIMER après migration complète)
      console.warn(`⚠️ SÉCURITÉ: Mot de passe en clair détecté pour le professionnel ${professional.email} - Migration requise`);
      isValid = password === professional.password;
      
      // Auto-migration: hasher le mot de passe lors de la prochaine connexion réussie
      if (isValid) {
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          await prisma.professional.update({
            where: { id: professional.id },
            data: { password: hashedPassword },
          });
          console.log(`✅ Mot de passe migré avec succès pour ${professional.email}`);
        } catch (migrationError) {
          console.error(`❌ Erreur lors de la migration du mot de passe pour ${professional.email}:`, migrationError);
        }
      }
    }

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

