import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentClient } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const client = await getCurrentClient();

    if (!client) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { name, firstName, lastName, email, phone, city, address, profileImage } = await req.json();

    // Vérifier que l'email n'est pas déjà utilisé par un autre client
    if (email && email !== client.email) {
      const existingClient = await prisma.client.findUnique({
        where: { email },
      });

      if (existingClient && existingClient.id !== client.id) {
        return NextResponse.json(
          { error: "Cet email est déjà utilisé par un autre compte" },
          { status: 400 }
        );
      }
    }

    // Récupérer le client complet depuis la base de données
    const fullClient = await prisma.client.findUnique({
      where: { id: client.id },
    });

    if (!fullClient) {
      return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
    }

    // Mettre à jour le client
    const updatedClient = await prisma.client.update({
      where: { id: client.id },
      data: {
        name: name || fullClient.name,
        firstName: firstName !== undefined ? firstName : fullClient.firstName,
        lastName: lastName !== undefined ? lastName : fullClient.lastName,
        email: email || fullClient.email,
        phone: phone !== undefined ? phone : fullClient.phone,
        city: city !== undefined ? city : fullClient.city,
        address: address !== undefined ? address : fullClient.address,
        profileImage: profileImage !== undefined ? profileImage : fullClient.profileImage,
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        address: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/client/settings:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}





