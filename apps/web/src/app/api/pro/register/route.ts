import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateUniqueSlug } from "@/lib/slug";
import { sendNewProfessionalNotificationToAdmin, sendProfessionalRegistrationConfirmation } from "@/lib/email";

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

    // Vérifier si le pro existe déjà avec cet email
    const existingByEmail = await prisma.professional.findUnique({
      where: { email },
    });

    if (existingByEmail) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà. Si vous avez déjà un compte, connectez-vous." },
        { status: 400 }
      );
    }

    // Vérifier si le téléphone existe déjà (si fourni)
    if (phone) {
      const existingByPhone = await prisma.professional.findFirst({
        where: { phone },
      });

      if (existingByPhone) {
        return NextResponse.json(
          { error: "Un compte avec ce numéro de téléphone existe déjà. Si vous avez déjà un compte, connectez-vous." },
          { status: 400 }
        );
      }
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
      .map((p: { slug: string | null }) => p.slug)
      .filter((s: string | null | undefined): s is string => s !== null && s !== undefined);
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

    // Envoyer les emails (ne pas bloquer la réponse si l'email échoue)
    try {
      // Email à l'admin
      await sendNewProfessionalNotificationToAdmin(
        professionalName,
        email,
        phone || null,
        city,
        serviceType,
        description || null
      );

      // Email au professionnel
      await sendProfessionalRegistrationConfirmation(
        email,
        professionalName
      );
    } catch (emailError: unknown) {
      // Logger l'erreur mais ne pas faire échouer l'inscription
      const errorMessage = emailError instanceof Error ? emailError.message : "Erreur inconnue";
      console.error("Erreur envoi emails d'inscription:", errorMessage);
    }

    return NextResponse.json(
      {
        message: "Demande d'inscription soumise avec succès. Ton profil est en cours de vérification.",
        professional,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur inscription pro:", errorMessage);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}

