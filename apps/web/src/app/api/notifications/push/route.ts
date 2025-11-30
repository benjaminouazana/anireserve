import { NextResponse } from "next/server";

// API pour les notifications push (Service Worker)
export async function POST(req: Request) {
  try {
    const { title, body, userId } = await req.json();

    // Pour l'instant, simulation
    // Dans un vrai projet, utiliser Web Push API avec VAPID keys
    console.log("📱 Notification push:", { title, body, userId });

    return NextResponse.json({
      message: "Notification envoyée (simulée)",
      simulated: true,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/notifications/push:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de l'envoi de la notification" },
      { status: 500 }
    );
  }
}




