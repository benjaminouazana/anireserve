import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Corps de la requête invalide" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    try {
      const admin = await loginAdmin(email, password);

      if (!admin) {
        return NextResponse.json(
          { error: "Email ou mot de passe incorrect" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        message: "Connexion réussie",
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      });
    } catch (dbError: any) {
      console.error("Erreur base de données login admin:", dbError);
      return NextResponse.json(
        { error: "Erreur lors de la vérification des identifiants" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Erreur login admin:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}

