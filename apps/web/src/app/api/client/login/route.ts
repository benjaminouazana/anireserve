import { NextResponse } from "next/server";
import { loginClient } from "@/lib/auth";

export async function POST(req: Request) {
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
  } catch (error: any) {
    console.error("Erreur API /api/client/login:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}




