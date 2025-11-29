import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    // Vérifier si le client existe déjà
    const existing = await prisma.client.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await prisma.client.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      {
        message: "Compte créé avec succès",
        client,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur API /api/client/register:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}




