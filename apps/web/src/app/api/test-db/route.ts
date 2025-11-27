import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Route de test pour vérifier la connexion à la base de données
export async function GET() {
  try {
    // Test simple de connexion
    await prisma.$connect();
    
    // Test de lecture
    const count = await prisma.professional.count();
    
    return NextResponse.json({
      success: true,
      message: "Connexion à la base de données réussie",
      professionalCount: count,
    });
  } catch (error: any) {
    console.error("Erreur de connexion DB:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erreur de connexion à la base de données",
        details: error.toString(),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

