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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    console.error("Erreur de connexion DB:", errorMessage);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage || "Erreur de connexion à la base de données",
        details: errorDetails,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}




