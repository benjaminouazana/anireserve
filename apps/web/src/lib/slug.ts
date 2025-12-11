import { prisma } from "./prisma";

/**
 * Génère un slug à partir d'un nom
 * Exemple: "Avi Rosen" -> "avi-rosen"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD') // Normalise les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplace les caractères non alphanumériques par des tirets
    .replace(/^-+|-+$/g, '') // Supprime les tirets en début et fin
    .trim();
}

/**
 * Génère un slug unique en ajoutant un numéro si nécessaire
 * Version synchrone (pour tests ou quand on a déjà les slugs existants)
 */
export function generateUniqueSlug(name: string, existingSlugs: string[] = []): string {
  let slug = generateSlug(name);
  let counter = 1;
  let uniqueSlug = slug;

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

/**
 * Génère un slug unique en vérifiant dans la base de données
 * Version asynchrone pour la production
 */
export async function generateUniqueSlugFromDB(name: string, excludeId?: number): Promise<string> {
  let slug = generateSlug(name);
  let counter = 1;
  let uniqueSlug = slug;

  while (true) {
    // Vérifier si le slug existe déjà dans la base
    const existing = await prisma.professional.findUnique({
      where: { slug: uniqueSlug },
      select: { id: true }
    });

    // Si le slug n'existe pas, ou si c'est le même professionnel qu'on met à jour
    if (!existing || (excludeId && existing.id === excludeId)) {
      return uniqueSlug;
    }

    // Sinon, essayer avec un numéro
    uniqueSlug = `${slug}-${counter}`;
    counter++;

    // Sécurité: éviter une boucle infinie
    if (counter > 1000) {
      // Ajouter un timestamp pour garantir l'unicité
      return `${slug}-${Date.now()}`;
    }
  }
}





