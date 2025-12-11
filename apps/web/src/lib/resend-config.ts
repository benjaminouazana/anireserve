import { Resend } from 'resend';

// Configuration Resend avec votre clé API (initialisation paresseuse)
// ⚠️ SÉCURITÉ: Ne jamais mettre de clé API en dur dans le code
// Utilise uniquement la variable d'environnement RESEND_API_KEY
let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  if (resendInstance) {
    return resendInstance;
  }
  
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_placeholder") {
    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️ RESEND_API_KEY n'est pas définie - Les emails ne pourront pas être envoyés");
    }
    return null;
  }
  
  try {
    resendInstance = new Resend(apiKey);
    return resendInstance;
  } catch (error) {
    console.error("Erreur initialisation Resend:", error);
    return null;
  }
}

// Export pour compatibilité avec le code existant
const resend = getResend();

// Export de la fonction getter pour utilisation dans d'autres fichiers
export { getResend };

// Configuration du domaine (à faire une seule fois)
export async function setupResendDomain() {
  try {
    const resend = getResend();
    if (!resend) {
      console.warn("⚠️ Resend n'est pas configuré. Impossible de configurer le domaine.");
      return null;
    }
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






