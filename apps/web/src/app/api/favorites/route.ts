import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentClient } from "@/lib/auth";

export async function GET() {
  try {
    const client = await getCurrentClient();

    if (!client) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { clientId: client.id },
      include: {
        professional: {
          select: {
            id: true,
            name: true,
            serviceType: true,
            city: true,
            profileImage: true,
            averageRating: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch (error: any) {
    console.error("Erreur API /api/favorites:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération des favoris" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const client = await getCurrentClient();

    if (!client) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { professionalId } = await req.json();

    if (!professionalId) {
      return NextResponse.json(
        { error: "professionalId requis" },
        { status: 400 }
      );
    }

    // Vérifier si déjà en favoris
    const existing = await prisma.favorite.findUnique({
      where: {
        clientId_professionalId: {
          clientId: client.id,
          professionalId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Déjà en favoris" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        clientId: client.id,
        professionalId,
      },
      include: {
        professional: {
          select: {
            id: true,
            name: true,
            serviceType: true,
            city: true,
          },
        },
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error: any) {
    console.error("Erreur API /api/favorites:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'ajout aux favoris" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const client = await getCurrentClient();

    if (!client) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const professionalId = searchParams.get("professionalId");

    if (!professionalId) {
      return NextResponse.json(
        { error: "professionalId requis" },
        { status: 400 }
      );
    }

    await prisma.favorite.delete({
      where: {
        clientId_professionalId: {
          clientId: client.id,
          professionalId: parseInt(professionalId),
        },
      },
    });

    return NextResponse.json({ message: "Retiré des favoris" });
  } catch (error: any) {
    console.error("Erreur API /api/favorites:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}

