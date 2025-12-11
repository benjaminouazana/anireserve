import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "all"; // "all" | "clients" | "professionals"

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    if (type === "clients" || type === "all") {
      const clients = await prisma.client.findMany({
        orderBy: { id: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
        },
        take: type === "clients" ? limit : Math.min(limit, 50),
        skip: type === "clients" ? skip : 0,
      });

      if (type === "clients") {
        return NextResponse.json({ clients });
      }
    }

    if (type === "professionals" || type === "all") {
      const professionals = await prisma.professional.findMany({
        orderBy: { id: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          city: true,
          serviceType: true,
          verified: true,
        },
        take: type === "professionals" ? limit : Math.min(limit, 50),
        skip: type === "professionals" ? skip : 0,
      });

      if (type === "professionals") {
        return NextResponse.json({ professionals });
      }
    }

    // Si type === "all", retourner les deux en parallèle
    const [clients, professionals] = await Promise.all([
      prisma.client.findMany({
        orderBy: { id: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
        },
        take: Math.min(limit, 50),
        skip: 0,
      }),
      prisma.professional.findMany({
        orderBy: { id: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          city: true,
          serviceType: true,
          verified: true,
        },
        take: Math.min(limit, 50),
        skip: 0,
      }),
    ]);

    return NextResponse.json({ clients, professionals });
  } catch (error: unknown) {
    console.error("Erreur récupération utilisateurs:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

