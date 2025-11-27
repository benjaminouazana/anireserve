import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
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

    if (!professional || !professional.password) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Comparer le mot de passe avec bcrypt
    // Support pour les anciens mots de passe en clair (migration progressive)
    let isValid = false;
    if (professional.password.startsWith("$2")) {
      // Mot de passe hashé avec bcrypt
      isValid = await bcrypt.compare(password, professional.password);
    } else {
      // Ancien mot de passe en clair (pour migration)
      isValid = password === professional.password;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Créer la session
    const cookieStore = await cookies();
    cookieStore.set("pro_session", professional.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
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

