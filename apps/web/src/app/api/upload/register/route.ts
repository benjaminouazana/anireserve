import { NextResponse } from "next/server";

// Configuration pour s'assurer que la route retourne toujours du JSON
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Headers pour garantir du JSON
const jsonHeaders = {
  "Content-Type": "application/json",
};

export async function POST(req: Request) {
  // Wrapper global pour capturer toutes les erreurs
  try {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (formError: unknown) {
      const errorMessage = formError instanceof Error ? formError.message : "Erreur inconnue";
      console.error("Erreur parsing FormData:", errorMessage);
      return NextResponse.json(
        { error: "Erreur lors de la lecture du formulaire. Assurez-vous d'envoyer un fichier valide." },
        { status: 400, headers: jsonHeaders }
      );
    }

    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "teoudat-zeout";

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Aucun fichier valide fourni" },
        { status: 400, headers: jsonHeaders }
      );
    }

    // Vérifier la taille du fichier (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Le fichier est trop volumineux (max 10MB)" },
        { status: 400, headers: jsonHeaders }
      );
    }

    // Vérifier le type de fichier (très permissif pour les photos depuis mobile)
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "pdf", "heic", "heif", "gif"];
    const allowedMimeTypes = [
      "image/jpeg", "image/jpg", "image/png", "image/webp", 
      "application/pdf", "image/heic", "image/heif", "image/gif",
      "application/octet-stream" // Certains téléphones envoient ce type
    ];
    
    // Accepter si l'extension est valide OU si le type MIME est valide
    const isValidExtension = fileExtension && allowedExtensions.includes(fileExtension);
    const isValidMimeType = file.type && (allowedMimeTypes.includes(file.type) || file.type.startsWith("image/"));
    
    if (!isValidExtension && !isValidMimeType) {
      return NextResponse.json(
        { error: `Type de fichier non autorisé. Utilisez JPG, PNG, WEBP ou PDF. Type détecté: ${file.type || "inconnu"}, Extension: ${fileExtension || "inconnue"}` },
        { status: 400, headers: jsonHeaders }
      );
    }

    // Vérifier si Supabase est configuré
    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Si Supabase n'est pas configuré, stocker localement
    if (!hasSupabase || process.env.NODE_ENV === "development") {
      console.log("📤 Upload local - Fichier:", file.name, "Taille:", file.size);
      
      try {
        // Importer fs et path pour le stockage local
        const fs = await import("fs/promises");
        const path = await import("path");
        
        // Créer le dossier d'upload s'il n'existe pas
        const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
        await fs.mkdir(uploadDir, { recursive: true });
        
        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        const fileExt = file.name.split(".").pop()?.toLowerCase() || "bin";
        const fileName = `${timestamp}-${randomId}.${fileExt}`;
        const filePath = path.join(uploadDir, fileName);
        
        // Convertir le File en Buffer et sauvegarder
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(filePath, buffer);
        
        // Retourner l'URL publique
        const publicUrl = `/uploads/${folder}/${fileName}`;
        
        console.log("✅ Fichier sauvegardé:", publicUrl);
        return NextResponse.json({
          url: publicUrl,
          local: true,
          message: "Fichier uploadé avec succès (stockage local)",
        }, { headers: jsonHeaders });
      } catch (localError: unknown) {
        const errorMessage = localError instanceof Error ? localError.message : "Erreur inconnue";
        console.error("Erreur upload local:", errorMessage);
        // En cas d'erreur, retourner une URL simulée comme fallback
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        return NextResponse.json({
          url: `/api/upload/placeholder?name=${encodeURIComponent(file.name)}&id=${uniqueId}`,
          simulated: true,
          warning: "Upload local échoué, utilisation du mode simulé",
        }, { headers: jsonHeaders });
      }
    }

    // Upload vers Supabase Storage (seulement si configuré et en production)
    try {
      const { supabase } = await import("@/lib/supabase");
      if (!supabase) {
        throw new Error("Supabase not configured");
      }
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}-${randomId}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Erreur Supabase upload:", error.message || String(error));
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      return NextResponse.json({ url: publicUrl }, { headers: jsonHeaders });
    } catch (uploadError: unknown) {
      const errorMessage = uploadError instanceof Error ? uploadError.message : "Erreur inconnue";
      console.error("Erreur upload Supabase:", errorMessage);
      // En cas d'erreur Supabase, retourner une URL simulée
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      return NextResponse.json({
        url: `https://via.placeholder.com/400?text=${encodeURIComponent(file.name)}&id=${uniqueId}`,
        simulated: true,
        warning: "Upload simulé - Supabase non disponible",
      }, { headers: jsonHeaders });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur upload:", errorMessage);
    // Toujours retourner du JSON, jamais de HTML
    return NextResponse.json(
      { 
        error: errorMessage || "Erreur lors de l'upload du fichier. Veuillez réessayer.",
        details: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined
      },
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
  }
}

