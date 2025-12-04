// Formats d'images supportés par AniReserve
export const IMAGE_FORMATS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "avif",
  "heic",
  "heif",
  "bmp",
  "tiff",
  "tif",
  "raw",
  "psd",
  "xcf",
  "svg",
  "ai",
  "eps",
  "pdf",
  "apng",
] as const;

// MIME types correspondants
export const IMAGE_MIME_TYPES: Record<string, string[]> = {
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  gif: ["image/gif"],
  webp: ["image/webp"],
  avif: ["image/avif"],
  heic: ["image/heic"],
  heif: ["image/heif"],
  bmp: ["image/bmp", "image/x-ms-bmp"],
  tiff: ["image/tiff"],
  tif: ["image/tiff"],
  raw: ["image/x-canon-cr2", "image/x-canon-crw", "image/x-sony-arw", "image/x-adobe-dng", "image/x-nikon-nef", "image/x-olympus-orf", "image/x-pentax-pef", "image/x-fuji-raf", "image/x-panasonic-rw2", "image/x-samsung-srw"],
  psd: ["image/vnd.adobe.photoshop", "image/x-photoshop"],
  xcf: ["image/x-xcf"],
  svg: ["image/svg+xml"],
  ai: ["application/postscript", "application/illustrator"],
  eps: ["application/postscript", "application/eps", "image/x-eps"],
  pdf: ["application/pdf"],
  apng: ["image/apng"],
};

// Générer la liste complète des MIME types acceptés
export const ALLOWED_MIME_TYPES = Object.values(IMAGE_MIME_TYPES).flat();

// Générer la chaîne accept pour les inputs HTML
export const ACCEPT_IMAGE_FORMATS = IMAGE_FORMATS.map(format => `.${format}`).join(",");

// Vérifier si un format est supporté
export function isImageFormatSupported(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? IMAGE_FORMATS.includes(ext as typeof IMAGE_FORMATS[number]) : false;
}

// Vérifier si un MIME type est supporté
export function isMimeTypeSupported(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType) || mimeType.startsWith("image/");
}



