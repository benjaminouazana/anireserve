import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentClient } from "@/lib/auth";

// GET : Récupérer toutes les notes d'un client
export async function GET(req: Request) {
  try {
    const client = await getCurrentClient();

    if (!client) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const professionalId = searchParams.get("professionalId");

    if (professionalId) {
      // Récupérer la note pour un professionnel spécifique
      const note = await prisma.clientNote.findUnique({
        where: {
          clientId_professionalId: {
            clientId: client.id,
            professionalId: parseInt(professionalId),
          },
        },
        include: {
          professional: {
            select: {
              id: true,
              name: true,
              serviceType: true,
              city: true,
            },
          },
        },
      });

      return NextResponse.json(note || null);
    } else {
      // Récupérer toutes les notes du client
      const notes = await prisma.clientNote.findMany({
        where: { clientId: client.id },
        include: {
          professional: {
            select: {
              id: true,
              name: true,
              serviceType: true,
              city: true,
              slug: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return NextResponse.json(notes);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/client/notes:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la récupération des notes" },
      { status: 500 }
    );
  }
}

// POST : Créer ou mettre à jour une note
export async function POST(req: Request) {
  try {
    const client = await getCurrentClient();

    if (!client) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { professionalId, note } = await req.json();

    if (!professionalId || !note || note.trim().length === 0) {
      return NextResponse.json(
        { error: "L'ID du professionnel et la note sont requis" },
        { status: 400 }
      );
    }

    // Vérifier que le professionnel existe
    const professional = await prisma.professional.findUnique({
      where: { id: parseInt(professionalId) },
    });

    if (!professional) {
      return NextResponse.json(
        { error: "Professionnel introuvable" },
        { status: 404 }
      );
    }

    // Créer ou mettre à jour la note
    const clientNote = await prisma.clientNote.upsert({
      where: {
        clientId_professionalId: {
          clientId: client.id,
          professionalId: parseInt(professionalId),
        },
      },
      update: {
        note: note.trim(),
      },
      create: {
        clientId: client.id,
        professionalId: parseInt(professionalId),
        note: note.trim(),
      },
      include: {
        professional: {
          select: {
            id: true,
            name: true,
            serviceType: true,
            city: true,
          },
        },
      },
    });

    return NextResponse.json(clientNote, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/client/notes:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la sauvegarde de la note" },
      { status: 500 }
    );
  }
}

// DELETE : Supprimer une note
export async function DELETE(req: Request) {
  try {
    const client = await getCurrentClient();

    if (!client) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const professionalId = searchParams.get("professionalId");

    if (!professionalId) {
      return NextResponse.json(
        { error: "L'ID du professionnel est requis" },
        { status: 400 }
      );
    }

    await prisma.clientNote.delete({
      where: {
        clientId_professionalId: {
          clientId: client.id,
          professionalId: parseInt(professionalId),
        },
      },
    });

    return NextResponse.json({ message: "Note supprimée avec succès" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/client/notes:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de la suppression de la note" },
      { status: 500 }
    );
  }
}






