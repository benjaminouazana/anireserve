import { Resend } from 'resend';

// Configuration Resend avec votre clé API
// ⚠️ SÉCURITÉ: Ne jamais mettre de clé API en dur dans le code
// Utilise uniquement la variable d'environnement RESEND_API_KEY
if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY n'est pas définie - Les emails ne pourront pas être envoyés");
}
const resend = new Resend(process.env.RESEND_API_KEY);

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






