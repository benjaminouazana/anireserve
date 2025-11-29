import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateUniqueSlug } from "@/lib/slug";

export async function POST(req: Request) {
  try {
    const {
      firstName,
      lastName,
      name,
      email,
      password,
      phone,
      city,
      cities,
      serviceType,
      services,
      subcategories,
      description,
      teoudatZeout,
      languages,
      status,
    } = await req.json();

    if (!firstName || !lastName || !email || !password || !city || !serviceType || !teoudatZeout) {
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

    // Générer un slug unique
    const professionalName = name || `${firstName} ${lastName}`;
    // Récupérer tous les professionnels avec leurs slugs
    const allProfessionals = await prisma.professional.findMany({
      select: { slug: true },
    });
    // Filtrer les slugs non-null
    const existingSlugs = allProfessionals
      .map((p) => p.slug)
      .filter((s): s is string => s !== null && s !== undefined);
    const slug = generateUniqueSlug(professionalName, existingSlugs);

    const professional = await prisma.professional.create({
      data: {
        firstName,
        lastName,
        name: professionalName,
        email,
        password: hashedPassword,
        phone: phone || null,
        city,
        cities: cities || city,
        serviceType,
        services: services || serviceType,
        subcategories: subcategories || null,
        description: description || null,
        teoudatZeout: teoudatZeout || null,
        languages: languages || "fr",
        status: status || "pending", // Statut par défaut : en attente
        slug, // Ajouter le slug
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        city: true,
        serviceType: true,
        status: true,
      },
    });

    return NextResponse.json(
      {
        message: "Demande d'inscription soumise avec succès. Ton profil est en cours de vérification.",
        professional,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur inscription pro:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}

