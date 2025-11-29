import { NextResponse } from "next/server";
import { logoutClient } from "@/lib/auth";

export async function POST() {
  try {
    await logoutClient();
    return NextResponse.json({ message: "Déconnexion réussie" });
  } catch (error: any) {
    console.error("Erreur API /api/client/logout:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la déconnexion" },
      { status: 500 }
    );
  }
}




