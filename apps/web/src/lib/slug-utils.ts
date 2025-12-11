/**
 * Utilitaires de slug (fonctions pures, sans dépendances)
 * Ces fonctions peuvent être utilisées côté client et serveur
 */

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
