import { prisma } from "./prisma";
import { generateSlug } from "./slug-utils";

// Réexporter les fonctions pures pour compatibilité
export { generateSlug, generateUniqueSlug } from "./slug-utils";

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





