import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Route temporaire pour créer un professionnel avec mot de passe
// À supprimer en production ou protéger avec une authentification admin
export async function POST(req: Request) {
  try {
    const { name, email, password, city, serviceType, description, languages } =
      await req.json();

    if (!name || !email || !password || !city || !serviceType) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    // Vérifier si le pro existe déjà
    const existing = await prisma.professional.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un professionnel avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const professional = await prisma.professional.create({
      data: {
        name,
        email,
        password: hashedPassword,
        city,
        serviceType,
        description: description || null,
        languages: languages || "fr,he,en",
      },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        serviceType: true,
      },
    });

    return NextResponse.json(professional, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création du professionnel" },
      { status: 500 }
    );
  }
}

