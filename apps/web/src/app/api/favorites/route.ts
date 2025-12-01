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
            cities: true,
            description: true,
            profileImage: true,
            verified: true,
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculer les notes moyennes
    const professionalIds = favorites.map((f: {
      professional: { id: number };
    }) => f.professional.id);
    const ratingsData = professionalIds.length > 0
      ? await prisma.review.groupBy({
          by: ["professionalId"],
          where: {
            professionalId: { in: professionalIds },
          },
          _avg: {
            rating: true,
          },
          _count: {
            rating: true,
          },
        })
      : [];

    const ratingsMap = new Map(
      ratingsData.map((r: {
        professionalId: number;
        _avg: { rating: number | null };
        _count: { rating: number };
      }) => [r.professionalId, { avg: r._avg.rating || 0, count: r._count.rating }])
    );

    const favoritesWithRatings = favorites.map((fav: {
      professional: {
        id: number;
        name: string;
        city: string;
        cities: string | null;
        serviceType: string;
        description: string | null;
        verified: boolean;
      };
    }) => {
      const ratingData = ratingsMap.get(fav.professional.id) || { avg: 0, count: 0 };
      return {
        id: fav.professional.id,
        name: fav.professional.name,
        city: fav.professional.city,
        cities: fav.professional.cities,
        serviceType: fav.professional.serviceType,
        description: fav.professional.description,
        averageRating: ratingData.avg,
        totalReviews: ratingData.count,
        verified: fav.professional.verified,
      };
    });

    return NextResponse.json({ favorites: favoritesWithRatings });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/favorites:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la récupération des favoris" },
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/favorites:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de l'ajout aux favoris" },
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
    let professionalId = searchParams.get("professionalId");

    // Si pas dans les query params, chercher dans le body
    if (!professionalId) {
      try {
        const body = await req.json();
        professionalId = body.professionalId?.toString();
      } catch {
        // Body vide ou invalide
      }
    }

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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/favorites:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}

