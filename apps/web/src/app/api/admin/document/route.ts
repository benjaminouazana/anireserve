import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL manquante" }, { status: 400 });
    }

    // Si c'est une URL placeholder, on peut la rediriger directement
    // Les URLs placeholder sont des images de test, on peut les servir directement
    if (url.includes("via.placeholder.com") || url.includes("placeholder.com")) {
      // Pour les placeholders, on peut les rediriger ou les servir via proxy
      try {
        const response = await fetch(url);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          const contentType = response.headers.get("content-type") || "image/png";
          return new NextResponse(buffer, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=3600",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      } catch {
        // Si ça échoue, rediriger
        return NextResponse.redirect(url);
      }
      return NextResponse.redirect(url);
    }

    // Pour les URLs Supabase ou autres, on fait un proxy
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "application/octet-stream";
      const buffer = await response.arrayBuffer();

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=3600",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (fetchError: unknown) {
      console.error("Erreur proxy document:", fetchError);
      // Si le proxy échoue, rediriger vers l'URL originale
      return NextResponse.redirect(url);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur route document:", errorMessage);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération du document" },
      { status: 500 }
    );
  }
}

