import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = context.params;
    const reviewId = parseInt(id);

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




