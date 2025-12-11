import { NextResponse } from "next/server";
import { getCurrentProfessional } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { isImageFormatSupported, isMimeTypeSupported } from "@/lib/image-formats";

export async function POST(req: Request) {
  try {
    const professional = await getCurrentProfessional();

    if (!professional) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Vérifier le format de l'image
    if (!isImageFormatSupported(file.name) && !isMimeTypeSupported(file.type)) {
      return NextResponse.json(
        { error: "Format d'image non supporté" },
        { status: 400 }
      );
    }

    // Si Supabase n'est pas configuré, retourner une URL simulée
    if (!supabase) {
      return NextResponse.json({
        url: `https://via.placeholder.com/400?text=${encodeURIComponent(file.name)}`,
        simulated: true,
      });
    }

    // Upload vers Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${professional.id}-${Date.now()}.${fileExt}`;
    const filePath = `professionals/${professional.id}/${fileName}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur upload:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}




