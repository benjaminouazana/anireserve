import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, city, cities, serviceType, subcategories, description, phone, languages } =
      await req.json();

    if (!name || !email || !password || !city || !serviceType) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
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
        cities: cities || city,
        serviceType,
        subcategories: subcategories || null,
        description: description || null,
        phone: phone || null,
        languages: "fr", // Site entièrement en français
      },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        serviceType: true,
      },
    });

    return NextResponse.json(
      {
        message: "Compte créé avec succès",
        professional,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}

