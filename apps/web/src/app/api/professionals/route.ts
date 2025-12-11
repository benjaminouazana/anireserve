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
    const keyword = searchParams.get("keyword") || undefined; // Recherche par mots-clés
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Construire les conditions de recherche
    const whereConditions: Record<string, unknown> = {
      status: "approved", // Seulement les profils approuvés
    };

    // Recherche par ville (ville principale ou villes multiples)
    if (city) {
      whereConditions.OR = [
        { city: { contains: city, mode: "insensitive" } },
        { cities: { contains: city, mode: "insensitive" } },
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
        mode: "insensitive",
      };
    }

    // Recherche par mots-clés dans la description
    if (keyword) {
      // Si on a déjà un OR (pour la ville), on doit combiner avec AND
      if (whereConditions.OR) {
        whereConditions.AND = [
          { OR: whereConditions.OR },
          { description: { contains: keyword, mode: "insensitive" } },
        ];
        delete whereConditions.OR;
      } else {
        whereConditions.description = {
          contains: keyword,
          mode: "insensitive",
        };
      }
    }

    // Compter le total avant pagination
    const totalCount = await prisma.professional.count({
      where: whereConditions,
    });

    // Optimisation : utiliser select au lieu de include et _count pour les comptages
    const professionals = await prisma.professional.findMany({
      where: whereConditions,
      select: {
        id: true,
        name: true,
        slug: true,
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
      skip,
      take: limit,
      orderBy: sortBy === "rating" ? undefined : sortBy === "reviews" ? undefined : { name: "asc" },
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

    const response = NextResponse.json({
      professionals: data,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page * limit < totalCount,
      },
    });
    // Cache optimisé: 60 secondes pour les résultats de recherche
    // stale-while-revalidate permet de servir du contenu périmé pendant la mise à jour
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/professionals:", errorMessage);
    // Retourner toujours un format valide même en cas d'erreur
    return NextResponse.json(
      { 
        professionals: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasMore: false,
        }
      },
      { status: 200 } // Retourner 200 pour que le client puisse gérer l'erreur
    );
  }
}
