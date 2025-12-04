#!/usr/bin/env node
/**
 * Script de test pour tous les templates d'email
 * 
 * Usage:
 *   npm run test:emails <votre-email@example.com>
 * 
 * Ce script envoie un email de test pour chaque template disponible
 */

const { Resend } = require('resend');
const path = require('path');

// Charger les variables d'environnement (essayer plusieurs emplacements)
const envPaths = [
  path.join(__dirname, '../apps/web/.env.local'),
  path.join(__dirname, '../apps/web/.env'),
  path.join(__dirname, '../.env.local'),
  path.join(__dirname, '../.env'),
];

for (const envPath of envPaths) {
  try {
    require('dotenv').config({ path: envPath });
    if (process.env.RESEND_API_KEY) {
      break;
    }
  } catch (e) {
    // Continuer à essayer les autres chemins
  }
}

// Vérifier que l'email est fourni
const testEmail = process.argv[2];

if (!testEmail) {
  console.error('❌ Erreur : Veuillez fournir une adresse email de test');
  console.log('');
  console.log('Usage:');
  console.log('  npm run test:emails <votre-email@example.com>');
  console.log('');
  console.log('Exemple:');
  console.log('  npm run test:emails test@example.com');
  process.exit(1);
}

// Vérifier le format de l'email
if (!testEmail.includes('@')) {
  console.error('❌ Erreur : Adresse email invalide');
  process.exit(1);
}

// Initialiser Resend
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error('❌ Erreur : RESEND_API_KEY n\'est pas défini dans .env.local');
  process.exit(1);
}

const resend = new Resend(resendApiKey);

console.log('🧪 Test de tous les templates d\'email');
console.log(`📧 Email de test : ${testEmail}`);
console.log('');

// Template de base pour tous les emails
function baseEmailTemplate(content, primaryColor = "#2FB190") {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, ${primaryColor} 0%, #18223b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">
          💡 Ani<span style="color: #FFDE59;">RESERVE</span>
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">
          La plateforme de réservation en Israël pour les Français
        </p>
      </div>
      
      <!-- Content -->
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        ${content}
      </div>
      
      <!-- Footer -->
      <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          AniReserve - La plateforme de réservation en Israël pour les Français<br>
          <a href="https://anireserve.com" style="color: ${primaryColor}; text-decoration: none;">anireserve.com</a> | 
          <a href="mailto:contact@anireserve.com" style="color: ${primaryColor}; text-decoration: none;">contact@anireserve.com</a>
        </p>
        <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">
          Vous recevez cet email car vous êtes inscrit sur AniReserve
        </p>
      </div>
    </body>
    </html>
  `;
}

// Liste de tous les templates à tester
const templatesToTest = [
  {
    name: '1. Inscription Professionnel - Notification Admin',
    subject: '🔔 Nouvelle inscription professionnel : Jean Dupont',
    html: baseEmailTemplate(`
      <h2 style="color: #2FB190; margin-top: 0;">🔔 Nouvelle inscription professionnel</h2>
      <p>Bonjour,</p>
      <p>Un nouveau professionnel vient de s'inscrire sur AniReserve et son dossier est en attente de validation.</p>
      
      <div style="background: #f0f9f7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2FB190;">
        <h3 style="margin-top: 0; color: #18223b;">Informations du professionnel</h3>
        <p style="margin: 5px 0;"><strong>👤 Nom :</strong> Jean Dupont</p>
        <p style="margin: 5px 0;"><strong>📧 Email :</strong> jean.dupont@example.com</p>
        <p style="margin: 5px 0;"><strong>📱 Téléphone :</strong> +33 6 12 34 56 78</p>
        <p style="margin: 5px 0;"><strong>📍 Ville :</strong> Tel Aviv</p>
        <p style="margin: 5px 0;"><strong>💼 Service :</strong> Coiffeur</p>
        <p style="margin: 5px 0;"><strong>📝 Description :</strong> Spécialisé en coupes modernes et coloration</p>
      </div>
      
      <p><strong>⏳ Action requise :</strong> Connectez-vous à l'espace admin pour valider ou rejeter ce profil.</p>
    `, "#2FB190"),
  },
  {
    name: '2. Inscription Professionnel - Confirmation au Pro',
    subject: '✅ Votre inscription AniReserve est en cours de traitement',
    html: baseEmailTemplate(`
      <h2 style="color: #2FB190; margin-top: 0;">✅ Inscription reçue !</h2>
      <p>Bonjour Jean Dupont,</p>
      <p>Nous avons bien reçu votre demande d'inscription sur <strong>AniReserve</strong>.</p>
      
      <div style="background: #f0f9f7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2FB190;">
        <p style="margin: 0;"><strong>⏳ Statut :</strong> Votre dossier est en cours de traitement</p>
        <p style="margin: 10px 0 0 0;">Notre équipe examine votre profil et vos documents. Vous recevrez un email dès que votre compte sera validé.</p>
      </div>
      
      <p><strong>📋 Prochaines étapes :</strong></p>
      <ul style="line-height: 1.8;">
        <li>Vérification de vos documents (Teoudate Zeoute)</li>
        <li>Validation de votre profil professionnel</li>
        <li>Activation de votre compte</li>
      </ul>
      
      <p><strong>⏰ Délai de traitement :</strong> Généralement sous 24-48 heures</p>
    `, "#2FB190"),
  },
  {
    name: '3. Validation Profil Professionnel',
    subject: '🎉 Votre compte AniReserve est validé !',
    html: baseEmailTemplate(`
      <h2 style="color: #10b981; margin-top: 0;">🎉 Votre compte est validé !</h2>
      <p>Bonjour Jean Dupont,</p>
      <p>Excellente nouvelle ! Votre profil professionnel a été <strong>validé</strong> par notre équipe.</p>
      
      <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #10b981;">✅ Votre compte est maintenant actif</p>
      </div>
      
      <p>Vous pouvez maintenant :</p>
      <ul style="line-height: 1.8;">
        <li>✅ Vous connecter à votre espace professionnel</li>
        <li>✅ Configurer votre planning de disponibilités</li>
        <li>✅ Recevoir des demandes de réservation</li>
        <li>✅ Apparaître dans les résultats de recherche</li>
      </ul>
    `, "#10b981"),
  },
  {
    name: '4. Rejet Profil Professionnel',
    subject: '❌ Votre demande d\'inscription AniReserve',
    html: baseEmailTemplate(`
      <h2 style="color: #ef4444; margin-top: 0;">❌ Votre demande d'inscription</h2>
      <p>Bonjour Jean Dupont,</p>
      <p>Nous avons examiné votre demande d'inscription sur AniReserve.</p>
      
      <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #ef4444;">❌ Votre profil n'a pas pu être validé</p>
        <p style="margin: 10px 0 0 0;"><strong>Raison :</strong> Documents incomplets</p>
      </div>
    `, "#ef4444"),
  },
  {
    name: '5. Demande de Réservation - Client',
    subject: '📅 Demande de réservation avec Jean Dupont',
    html: baseEmailTemplate(`
      <h2 style="color: #7c3aed; margin-top: 0;">📅 Demande de réservation</h2>
      <p>Bonjour Marie Martin,</p>
      <p>Votre demande de réservation avec <strong>Jean Dupont</strong> a été envoyée avec succès.</p>
      
      <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
        <p style="margin: 0;"><strong>📅 Date :</strong> 15 décembre 2025</p>
        <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> 14:00</p>
        <p style="margin: 5px 0;"><strong>👤 Professionnel :</strong> Jean Dupont</p>
      </div>
      
      <p><strong>⏳ Statut :</strong> En attente de confirmation par le professionnel</p>
      <p><strong>💳 Important :</strong> Le paiement se fera sur place au moment de la prestation.</p>
    `, "#7c3aed"),
  },
  {
    name: '6. Demande de Réservation - Professionnel',
    subject: '✨ Nouvelle demande de réservation de Marie Martin',
    html: baseEmailTemplate(`
      <h2 style="color: #ec4899; margin-top: 0;">✨ Nouvelle demande de réservation</h2>
      <p>Bonjour Jean Dupont,</p>
      <p>Vous avez reçu une nouvelle demande de réservation de <strong>Marie Martin</strong>.</p>
      
      <div style="background: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ec4899;">
        <p style="margin: 0;"><strong>📅 Date :</strong> 15 décembre 2025</p>
        <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> 14:00</p>
        <p style="margin: 5px 0;"><strong>👤 Client :</strong> Marie Martin</p>
        <p style="margin: 5px 0;"><strong>📧 Email client :</strong> marie.martin@example.com</p>
      </div>
      
      <p><strong>⏳ Action requise :</strong> Connectez-vous à votre espace professionnel pour valider ou refuser cette réservation.</p>
    `, "#ec4899"),
  },
  {
    name: '7. Réservation Confirmée - Client',
    subject: '✅ Réservation confirmée avec Jean Dupont',
    html: baseEmailTemplate(`
      <h2 style="color: #10b981; margin-top: 0;">✅ Réservation confirmée !</h2>
      <p>Bonjour Marie Martin,</p>
      <p>Excellente nouvelle ! Votre réservation avec <strong>Jean Dupont</strong> a été confirmée.</p>
      
      <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <p style="margin: 0;"><strong>📅 Date :</strong> 15 décembre 2025</p>
        <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> 14:00</p>
        <p style="margin: 5px 0;"><strong>👤 Professionnel :</strong> Jean Dupont</p>
      </div>
      
      <p><strong>💳 Important :</strong> Le paiement se fera sur place au moment de la prestation.</p>
      <p>Nous vous attendons avec impatience !</p>
    `, "#10b981"),
  },
  {
    name: '8. Réservation Confirmée - Professionnel',
    subject: '✅ Réservation confirmée : Marie Martin le 15 décembre 2025',
    html: baseEmailTemplate(`
      <h2 style="color: #10b981; margin-top: 0;">✅ Réservation confirmée</h2>
      <p>Bonjour Jean Dupont,</p>
      <p>Vous avez confirmé la réservation de <strong>Marie Martin</strong>.</p>
      
      <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <p style="margin: 0;"><strong>📅 Date :</strong> 15 décembre 2025</p>
        <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> 14:00</p>
        <p style="margin: 5px 0;"><strong>👤 Client :</strong> Marie Martin</p>
      </div>
      
      <p>Le client a été notifié de la confirmation. N'oubliez pas de préparer votre rendez-vous !</p>
    `, "#10b981"),
  },
  {
    name: '9. Réservation Annulée - Client',
    subject: '❌ Réservation annulée avec Jean Dupont',
    html: baseEmailTemplate(`
      <h2 style="color: #ef4444; margin-top: 0;">❌ Réservation annulée</h2>
      <p>Bonjour Marie Martin,</p>
      <p>Votre réservation avec <strong>Jean Dupont</strong> a été annulée.</p>
      
      <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
        <p style="margin: 0;"><strong>📅 Date :</strong> 15 décembre 2025</p>
        <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> 14:00</p>
        <p style="margin: 5px 0;"><strong>👤 Professionnel :</strong> Jean Dupont</p>
      </div>
      
      <p>Vous pouvez réserver un autre créneau si vous le souhaitez.</p>
    `, "#ef4444"),
  },
  {
    name: '10. Réservation Annulée - Professionnel',
    subject: '❌ Réservation annulée : Marie Martin le 15 décembre 2025',
    html: baseEmailTemplate(`
      <h2 style="color: #ef4444; margin-top: 0;">❌ Réservation annulée</h2>
      <p>Bonjour Jean Dupont,</p>
      <p>La réservation de <strong>Marie Martin</strong> a été annulée.</p>
      
      <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
        <p style="margin: 0;"><strong>📅 Date :</strong> 15 décembre 2025</p>
        <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> 14:00</p>
        <p style="margin: 5px 0;"><strong>👤 Client :</strong> Marie Martin</p>
      </div>
      
      <p>Ce créneau est maintenant disponible pour d'autres réservations.</p>
    `, "#ef4444"),
  },
  {
    name: '11. Rappel de Réservation',
    subject: '⏰ Rappel : Rendez-vous demain avec Jean Dupont',
    html: baseEmailTemplate(`
      <h2 style="color: #f59e0b; margin-top: 0;">⏰ Rappel de rendez-vous</h2>
      <p>Bonjour Marie Martin,</p>
      <p>Ceci est un rappel pour votre rendez-vous avec <strong>Jean Dupont</strong>.</p>
      
      <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <p style="margin: 0;"><strong>📅 Date :</strong> 15 décembre 2025</p>
        <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> 14:00</p>
        <p style="margin: 5px 0;"><strong>👤 Professionnel :</strong> Jean Dupont</p>
      </div>
      
      <p><strong>💳 Rappel :</strong> Le paiement se fera sur place au moment de la prestation.</p>
      <p>À bientôt !</p>
    `, "#f59e0b"),
  },
  {
    name: '12. Réinitialisation Mot de Passe - Client',
    subject: '🔐 Réinitialisation de votre mot de passe',
    html: baseEmailTemplate(`
      <h2 style="color: #7c3aed; margin-top: 0;">🔐 Réinitialisation de mot de passe</h2>
      <p>Bonjour Marie Martin,</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://anireserve.com/client/reset-password?token=test-token-123456789" 
           style="background: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          Réinitialiser mon mot de passe
        </a>
      </div>
      
      <p>Ce lien est valide pendant <strong>1 heure</strong>.</p>
      <p style="color: #6b7280; font-size: 12px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    `, "#7c3aed"),
  },
  {
    name: '13. Réinitialisation Mot de Passe - Professionnel',
    subject: '🔐 Réinitialisation de votre mot de passe professionnel',
    html: baseEmailTemplate(`
      <h2 style="color: #ec4899; margin-top: 0;">🔐 Réinitialisation de mot de passe</h2>
      <p>Bonjour Jean Dupont,</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe professionnel.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://anireserve.com/pro/reset-password?token=test-token-123456789" 
           style="background: #ec4899; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          Réinitialiser mon mot de passe
        </a>
      </div>
      
      <p>Ce lien est valide pendant <strong>1 heure</strong>.</p>
      <p style="color: #6b7280; font-size: 12px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    `, "#ec4899"),
  },
  {
    name: '14. Nouvel Avis/Commentaire',
    subject: '⭐ Nouvel avis de Marie Martin',
    html: baseEmailTemplate(`
      <h2 style="color: #f59e0b; margin-top: 0;">⭐ Nouvel avis reçu</h2>
      <p>Bonjour Jean Dupont,</p>
      <p><strong>Marie Martin</strong> a laissé un avis sur votre profil.</p>
      
      <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; font-size: 24px;">⭐⭐⭐⭐⭐</p>
        <p style="margin: 10px 0 0 0; font-style: italic;">"Excellent service, très professionnel !"</p>
      </div>
    `, "#f59e0b"),
  },
  {
    name: '15. Nouveau Favori',
    subject: '❤️ Marie Martin vous a ajouté aux favoris',
    html: baseEmailTemplate(`
      <h2 style="color: #ec4899; margin-top: 0;">❤️ Nouveau favori</h2>
      <p>Bonjour Jean Dupont,</p>
      <p><strong>Marie Martin</strong> a ajouté votre profil à ses favoris.</p>
      
      <p>Cela signifie que votre profil intéresse ce client. Continuez à offrir un excellent service !</p>
    `, "#ec4899"),
  },
  {
    name: '16. Nouveau Message',
    subject: '💬 Nouveau message de Marie Martin',
    html: baseEmailTemplate(`
      <h2 style="color: #3b82f6; margin-top: 0;">💬 Nouveau message</h2>
      <p>Bonjour Jean Dupont,</p>
      <p>Vous avez reçu un nouveau message de <strong>Marie Martin</strong>.</p>
      
      <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
        <p style="margin: 0; font-style: italic;">"Bonjour, j'aimerais prendre rendez-vous..."</p>
      </div>
    `, "#3b82f6"),
  },
];

// Fonction pour envoyer un email de test
async function sendTestEmail(templateInfo, index) {
  try {
    console.log(`📤 [${index + 1}/${templatesToTest.length}] Envoi : ${templateInfo.name}...`);
    
    const result = await resend.emails.send({
      from: 'AniReserve <noreply@anireserve.com>',
      to: testEmail,
      subject: `[TEST] ${templateInfo.subject}`,
      html: templateInfo.html,
    });
    
    if (result.error) {
      console.log(`   ❌ Erreur : ${result.error.message}`);
      return false;
    }
    
    console.log(`   ✅ Envoyé avec succès (ID: ${result.data?.id || 'N/A'})`);
    return true;
  } catch (error) {
    console.log(`   ❌ Erreur : ${error.message || error}`);
    return false;
  }
}

// Fonction principale
async function main() {
  console.log('⏳ Envoi de tous les emails de test...');
  console.log('');
  
  const results = {
    success: 0,
    failed: 0,
  };
  
  // Envoyer tous les emails avec un délai entre chaque
  for (let i = 0; i < templatesToTest.length; i++) {
    const success = await sendTestEmail(templatesToTest[i], i);
    
    if (success) {
      results.success++;
    } else {
      results.failed++;
    }
    
    // Attendre 1 seconde entre chaque email pour éviter le rate limiting
    if (i < templatesToTest.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('📊 Résultats du test');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Succès : ${results.success}/${templatesToTest.length}`);
  console.log(`❌ Échecs : ${results.failed}/${templatesToTest.length}`);
  console.log('');
  
  if (results.failed === 0) {
    console.log('🎉 Tous les emails ont été envoyés avec succès !');
    console.log(`📧 Vérifiez votre boîte mail : ${testEmail}`);
  } else {
    console.log('⚠️  Certains emails ont échoué. Vérifiez les erreurs ci-dessus.');
  }
  console.log('');
}

// Exécuter le script
main().catch(error => {
  console.error('❌ Erreur fatale :', error);
  process.exit(1);
});

