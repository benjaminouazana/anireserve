import { NextResponse } from "next/server";
import { getCurrentClient } from "@/lib/auth";

export async function GET() {
  try {
    const client = await getCurrentClient();

    if (!client) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    return NextResponse.json(client);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/client/me:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la récupération du profil" },
      { status: 500 }
    );
  }
}




