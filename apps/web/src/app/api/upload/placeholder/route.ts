import { NextResponse } from "next/server";

// Route pour générer des images placeholder si nécessaire
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "Document";
    const id = searchParams.get("id") || Date.now().toString();

    // Retourner une image SVG placeholder simple
    const svg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f3f4f6"/>
        <text x="200" y="120" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle">
          📄 ${name}
        </text>
        <text x="200" y="150" font-family="Arial, sans-serif" font-size="12" fill="#9ca3af" text-anchor="middle">
          Document uploadé
        </text>
        <text x="200" y="170" font-family="Arial, sans-serif" font-size="10" fill="#d1d5db" text-anchor="middle">
          ID: ${id}
        </text>
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la génération du placeholder" },
      { status: 500 }
    );
  }
}

