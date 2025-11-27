import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || undefined;
    const service = searchParams.get("service") || undefined;
    const subcategory = searchParams.get("subcategory") || undefined;
    const minRating = searchParams.get("minRating") || undefined;
    const availableToday = searchParams.get("availableToday") === "true";
    const sortBy = searchParams.get("sortBy") || "name";

    // Construire les conditions de recherche
    const whereConditions: any = {};

    // Recherche par ville (ville principale ou villes multiples)
    if (city) {
      whereConditions.OR = [
        { city: { contains: city } },
        { cities: { contains: city } },
      ];
    }

    // Recherche par service
    if (service) {
      whereConditions.serviceType = service;
    }

    // Recherche par sous-catégorie
    if (subcategory) {
      whereConditions.subcategories = {
        contains: subcategory,
      };
    }

    // Optimisation : utiliser select au lieu de include et _count pour les comptages
    const professionals = await prisma.professional.findMany({
      where: whereConditions,
      select: {
        id: true,
        name: true,
        city: true,
        cities: true,
        serviceType: true,
        subcategories: true,
        description: true,
        phone: true,
        verified: true,
        _count: {
          select: {
            reviews: true,
            bookings: availableToday
              ? {
                  where: {
                    status: { not: "cancelled" },
                    startTime: {
                      gte: new Date(new Date().setHours(0, 0, 0, 0)),
                      lt: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
                  },
                }
              : undefined,
          },
        },
      },
      take: 100, // Limiter les résultats
    });

    // Calculer les notes moyennes avec une seule requête agrégée
    const professionalIds = professionals.map((p) => p.id);
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
      ratingsData.map((r) => [r.professionalId, { avg: r._avg.rating || 0, count: r._count.rating }])
    );

    // Construire les résultats optimisés
    let professionalsWithRatings = professionals.map((pro) => {
      const ratingData = ratingsMap.get(pro.id) || { avg: 0, count: 0 };
      const avgRating = ratingData.avg;
      const totalReviews = ratingData.count;

      // Vérifier disponibilité aujourd'hui si demandé
      let isAvailableToday = true;
      if (availableToday) {
        const todayBookingsCount = pro._count.bookings || 0;
        isAvailableToday = todayBookingsCount < 5;
      }

      return {
        ...pro,
        averageRating: avgRating,
        totalReviews,
        isAvailableToday,
      };
    });

    // Filtrer par note minimale
    if (minRating) {
      professionalsWithRatings = professionalsWithRatings.filter(
        (pro) => pro.averageRating >= parseFloat(minRating)
      );
    }

    // Filtrer par disponibilité aujourd'hui
    if (availableToday) {
      professionalsWithRatings = professionalsWithRatings.filter(
        (pro) => pro.isAvailableToday
      );
    }

    // Trier
    professionalsWithRatings.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.averageRating - a.averageRating;
        case "reviews":
          return b.totalReviews - a.totalReviews;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    const data = professionalsWithRatings.map((pro) => {
      const allCities = pro.cities
        ? [pro.city, ...pro.cities.split(",").map((c) => c.trim())]
        : [pro.city];
      const uniqueCities = Array.from(new Set(allCities));

      const subcategories = pro.subcategories
        ? pro.subcategories.split(",").map((s) => s.trim())
        : [];

      return {
        id: pro.id,
        name: pro.name,
        city: pro.city,
        cities: uniqueCities,
        service: pro.serviceType,
        subcategories,
        description: pro.description ?? "",
        phone: pro.phone ?? null,
        averageRating: pro.averageRating,
        totalReviews: pro.totalReviews,
      };
    });

    const response = NextResponse.json(data);
    // Cache pour 30 secondes (les données changent peu souvent)
    response.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
    return response;
  } catch (error) {
    console.error("Erreur API /api/professionals:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des professionnels" },
      { status: 500 }
    );
  }
}
