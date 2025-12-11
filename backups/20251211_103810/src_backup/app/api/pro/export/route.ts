import { NextResponse } from "next/server";
import { getCurrentProfessional } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const professional = await getCurrentProfessional();

    if (!professional) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv";

    const bookings = await prisma.booking.findMany({
      where: {
        professionalId: professional.id,
      },
      include: {
        client: true,
      },
      orderBy: { startTime: "desc" },
    });

    if (format === "csv") {
      // Générer CSV
      const csvHeader = "Date,Heure,Client,Email,Statut,Montant\n";
      const csvRows = bookings.map((b: {
        startTime: Date;
        status: string;
        amount: number | null;
        client: {
          name: string;
          email: string;
        };
      }) => {
        const date = new Date(b.startTime);
        const dateStr = date.toLocaleDateString("fr-FR");
        const timeStr = date.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${dateStr},${timeStr},"${b.client.name}","${b.client.email}",${b.status},${b.amount || 0}`;
      });

      const csv = csvHeader + csvRows.join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="reservations-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // Format JSON par défaut
    return NextResponse.json(bookings);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/pro/export:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de l'export" },
      { status: 500 }
    );
  }
}




