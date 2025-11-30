import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const reviewId = parseInt(context.params.id);

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ message: "Avis supprimé avec succès" });
  } catch (error: unknown) {
    console.error("Erreur suppression avis:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}




