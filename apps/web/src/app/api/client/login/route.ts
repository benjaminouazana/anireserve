import { NextResponse } from "next/server";
import { loginClient } from "@/lib/auth";
import { rateLimit, loginLimiter } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limiting: 5 tentatives par 15 minutes
  const rateLimitResult = await rateLimit(req, loginLimiter);
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const client = await loginClient(email, password);

    if (!client) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Connexion réussie",
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/client/login:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}





