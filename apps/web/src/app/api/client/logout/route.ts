import { NextResponse } from "next/server";
import { logoutClient } from "@/lib/auth";

export async function POST() {
  try {
    await logoutClient();
    return NextResponse.json({ message: "Déconnexion réussie" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/client/logout:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la déconnexion" },
      { status: 500 }
    );
  }
}




