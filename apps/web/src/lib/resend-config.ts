import { Resend } from 'resend';

// Configuration Resend avec votre clé API
const resend = new Resend('re_YaufuMTW_LVJ8N4CdbffuSEVU6B1EYMrx');

// Configuration du domaine (à faire une seule fois)
export async function setupResendDomain() {
  try {
    // Créer/vérifier le domaine anireserve.com
    const domain = await resend.domains.create({ 
      name: 'anireserve.com' 
    });
    
    console.log('✅ Domaine configuré:', domain);
    return domain;
  } catch (error) {
    console.error('Erreur configuration domaine:', error);
    // Le domaine existe peut-être déjà, ce n'est pas grave
    return null;
  }
}

// Exporter l'instance Resend pour utilisation dans le code
export { resend };

// Pour utiliser dans d'autres fichiers :
// import { resend } from '@/lib/resend-config';



