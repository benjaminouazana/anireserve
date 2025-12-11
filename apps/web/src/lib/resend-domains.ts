import { getResend } from './resend-config';

/**
 * Utilitaire de gestion des domaines Resend
 * 
 * Ce fichier fournit toutes les fonctions nécessaires pour gérer
 * les domaines Resend (création, vérification, mise à jour, etc.)
 */

/**
 * Lister tous les domaines configurés
 */
export async function listDomains() {
  try {
    const resend = getResend();
    if (!resend) {
      throw new Error("Resend n'est pas configuré. RESEND_API_KEY est manquante.");
    }
    const domains = await resend.domains.list();
    console.log('📋 Domaines disponibles:', domains);
    return domains;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des domaines:', error);
    throw error;
  }
}

/**
 * Obtenir les détails d'un domaine spécifique
 * @param domainId - L'ID du domaine (ex: '5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d')
 */
export async function getDomain(domainId: string) {
  try {
    const domain = await resend.domains.get(domainId);
    console.log('📧 Détails du domaine:', domain);
    return domain;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du domaine:', error);
    throw error;
  }
}

/**
 * Créer un nouveau domaine
 * @param domainName - Le nom du domaine (ex: 'anireserve.com')
 */
export async function createDomain(domainName: string) {
  try {
    const domain = await resend.domains.create({ 
      name: domainName 
    });
    console.log('✅ Domaine créé avec succès:', domain);
    return domain;
  } catch (error) {
    console.error('❌ Erreur lors de la création du domaine:', error);
    throw error;
  }
}

/**
 * Vérifier un domaine
 * @param domainId - L'ID du domaine à vérifier
 */
export async function verifyDomain(domainId: string) {
  try {
    const result = await resend.domains.verify(domainId);
    console.log('✅ Vérification du domaine:', result);
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du domaine:', error);
    throw error;
  }
}

/**
 * Mettre à jour les paramètres d'un domaine
 * @param domainId - L'ID du domaine
 * @param options - Options de mise à jour (openTracking, clickTracking, etc.)
 */
export async function updateDomain(
  domainId: string,
  options: {
    openTracking?: boolean;
    clickTracking?: boolean;
  }
) {
  try {
    const domain = await resend.domains.update({
      id: domainId,
      ...options,
    });
    console.log('✅ Domaine mis à jour:', domain);
    return domain;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du domaine:', error);
    throw error;
  }
}

/**
 * Supprimer un domaine
 * @param domainId - L'ID du domaine à supprimer
 */
export async function removeDomain(domainId: string) {
  try {
    const result = await resend.domains.remove(domainId);
    console.log('✅ Domaine supprimé:', result);
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du domaine:', error);
    throw error;
  }
}

/**
 * Fonction helper pour configurer complètement un domaine
 * 1. Crée le domaine s'il n'existe pas
 * 2. Configure les paramètres de tracking
 * 3. Retourne l'ID du domaine pour la vérification
 */
export async function setupDomain(
  domainName: string,
  options: {
    openTracking?: boolean;
    clickTracking?: boolean;
  } = { openTracking: false, clickTracking: true }
) {
  try {
    // 1. Lister les domaines existants
    const existingDomains = await listDomains();
    
    // 2. Vérifier si le domaine existe déjà
    const existingDomain = existingDomains.data?.find(
      (d: any) => d.name === domainName
    );
    
    if (existingDomain) {
      console.log('ℹ️  Le domaine existe déjà:', existingDomain.id);
      
      // Mettre à jour les paramètres
      if (options.openTracking !== undefined || options.clickTracking !== undefined) {
        await updateDomain(existingDomain.id, options);
      }
      
      return existingDomain;
    }
    
    // 3. Créer le nouveau domaine
    const newDomain = await createDomain(domainName);
    
    // 4. Mettre à jour les paramètres si nécessaire
    if (newDomain.id && (options.openTracking !== undefined || options.clickTracking !== undefined)) {
      await updateDomain(newDomain.id, options);
    }
    
    return newDomain;
  } catch (error) {
    console.error('❌ Erreur lors de la configuration du domaine:', error);
    throw error;
  }
}








