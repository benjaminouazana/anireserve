import { NextResponse } from "next/server";
import { getCurrentProfessional } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const professional = await getCurrentProfessional();

    if (!professional) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!plan || !["free", "premium", "pro"].includes(plan)) {
      return NextResponse.json(
        { error: "Plan invalide" },
        { status: 400 }
      );
    }

    await prisma.professional.update({
      where: { id: professional.id },
      data: { subscriptionPlan: plan },
    });

    return NextResponse.json({
      message: "Abonnement mis à jour",
      plan,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/pro/subscription:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}




