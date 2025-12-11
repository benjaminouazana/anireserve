import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

interface ProfessionalByService {
  serviceType: string;
  _count: { id: number };
}

interface ProfessionalByCity {
  city: string;
  _count: { id: number };
}

export async function GET() {
  try {
    // Vérifier que l'utilisateur est admin
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Statistiques générales
    const [
      totalClients,
      totalProfessionals,
      totalBookings,
      totalReviews,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      recentBookings,
      recentClients,
      recentProfessionals,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.professional.count(),
      prisma.booking.count(),
      prisma.review.count(),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.booking.count({ where: { status: "confirmed" } }),
      prisma.booking.count({ where: { status: "cancelled" } }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { startTime: "desc" },
        include: {
          professional: { select: { name: true, serviceType: true } },
          client: { select: { name: true, email: true } },
        },
      }),
      prisma.client.findMany({
        take: 10,
        orderBy: { id: "desc" },
        select: { id: true, name: true, email: true },
      }),
      prisma.professional.findMany({
        take: 10,
        orderBy: { id: "desc" },
        select: { id: true, name: true, email: true, serviceType: true, city: true },
      }),
    ]);

    // Statistiques par service
    const professionalsByService = await prisma.professional.groupBy({
      by: ["serviceType"],
      _count: { id: true },
    });

    // Statistiques par ville
    const professionalsByCity = await prisma.professional.groupBy({
      by: ["city"],
      _count: { id: true },
    });

    // Moyenne des notes avec agrégation SQL (beaucoup plus rapide)
    const averageRatingData = await prisma.review.aggregate({
      _avg: { rating: true },
    });
    const averageRating = averageRatingData._avg.rating || 0;

    // Réservations par statut (graphique)
    const bookingsByStatus = {
      pending: pendingBookings,
      confirmed: confirmedBookings,
      cancelled: cancelledBookings,
    };

    // Réservations des 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const bookingsLast30Days = await prisma.booking.count({
      where: {
        startTime: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const response = NextResponse.json({
      stats: {
        totalClients,
        totalProfessionals,
        totalBookings,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        bookingsByStatus,
        bookingsLast30Days,
      },
      professionalsByService: professionalsByService.map((p: ProfessionalByService) => ({
        service: p.serviceType,
        count: p._count.id,
      })),
      professionalsByCity: professionalsByCity.map((p: ProfessionalByCity) => ({
        city: p.city,
        count: p._count.id,
      })),
      recentBookings,
      recentClients,
      recentProfessionals,
    });
    // Cache pour 10 secondes (stats changent souvent)
    response.headers.set("Cache-Control", "public, s-maxage=10, stale-while-revalidate=30");
    return response;
  } catch (error: unknown) {
    console.error("Erreur stats admin:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}

