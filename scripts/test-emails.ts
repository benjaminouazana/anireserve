#!/usr/bin/env ts-node
/**
 * Script de test pour tous les templates d'email
 * 
 * Usage:
 *   npm run test:emails <votre-email@example.com>
 * 
 * Ce script envoie un email de test pour chaque template disponible
 */

import * as emailTemplates from '../apps/web/src/lib/email-templates';
import { resend } from '../apps/web/src/lib/resend-config';

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

console.log('🧪 Test de tous les templates d\'email');
console.log(`📧 Email de test : ${testEmail}`);
console.log('');

// Liste de tous les templates à tester
const templatesToTest = [
  {
    name: '1. Inscription Professionnel - Notification Admin',
    template: emailTemplates.templateNewProfessionalAdmin,
    data: {
      professionalName: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      phone: '+33 6 12 34 56 78',
      city: 'Tel Aviv',
      serviceType: 'Coiffeur',
      description: 'Spécialisé en coupes modernes et coloration',
    },
  },
  {
    name: '2. Inscription Professionnel - Confirmation au Pro',
    template: emailTemplates.templateProfessionalRegistrationConfirmation,
    data: {
      professionalName: 'Jean Dupont',
    },
  },
  {
    name: '3. Validation Profil Professionnel',
    template: emailTemplates.templateProfessionalValidated,
    data: {
      professionalName: 'Jean Dupont',
    },
  },
  {
    name: '4. Rejet Profil Professionnel',
    template: emailTemplates.templateProfessionalRejected,
    data: {
      professionalName: 'Jean Dupont',
      reason: 'Documents incomplets',
    },
  },
  {
    name: '5. Demande de Réservation - Client',
    template: emailTemplates.templateBookingRequestClient,
    data: {
      clientName: 'Marie Martin',
      professionalName: 'Jean Dupont',
      date: '15 décembre 2025',
      time: '14:00',
    },
  },
  {
    name: '6. Demande de Réservation - Professionnel',
    template: emailTemplates.templateBookingRequestPro,
    data: {
      professionalName: 'Jean Dupont',
      clientName: 'Marie Martin',
      clientEmail: 'marie.martin@example.com',
      date: '15 décembre 2025',
      time: '14:00',
    },
  },
  {
    name: '7. Réservation Confirmée - Client',
    template: emailTemplates.templateBookingConfirmedClient,
    data: {
      clientName: 'Marie Martin',
      professionalName: 'Jean Dupont',
      date: '15 décembre 2025',
      time: '14:00',
    },
  },
  {
    name: '8. Réservation Confirmée - Professionnel',
    template: emailTemplates.templateBookingConfirmedPro,
    data: {
      professionalName: 'Jean Dupont',
      clientName: 'Marie Martin',
      date: '15 décembre 2025',
      time: '14:00',
    },
  },
  {
    name: '9. Réservation Annulée - Client',
    template: emailTemplates.templateBookingCancelledClient,
    data: {
      clientName: 'Marie Martin',
      professionalName: 'Jean Dupont',
      date: '15 décembre 2025',
      time: '14:00',
    },
  },
  {
    name: '10. Réservation Annulée - Professionnel',
    template: emailTemplates.templateBookingCancelledPro,
    data: {
      professionalName: 'Jean Dupont',
      clientName: 'Marie Martin',
      date: '15 décembre 2025',
      time: '14:00',
    },
  },
  {
    name: '11. Rappel de Réservation',
    template: emailTemplates.templateBookingReminder,
    data: {
      recipientName: 'Marie Martin',
      professionalName: 'Jean Dupont',
      date: '15 décembre 2025',
      time: '14:00',
    },
  },
  {
    name: '12. Réinitialisation Mot de Passe - Client',
    template: emailTemplates.templatePasswordResetClient,
    data: {
      clientName: 'Marie Martin',
      resetToken: 'test-token-123456789',
    },
  },
  {
    name: '13. Réinitialisation Mot de Passe - Professionnel',
    template: emailTemplates.templatePasswordResetPro,
    data: {
      professionalName: 'Jean Dupont',
      resetToken: 'test-token-123456789',
    },
  },
  {
    name: '14. Nouvel Avis/Commentaire',
    template: emailTemplates.templateNewReview,
    data: {
      professionalName: 'Jean Dupont',
      clientName: 'Marie Martin',
      rating: 5,
      comment: 'Excellent service, très professionnel !',
    },
  },
  {
    name: '15. Nouveau Favori',
    template: emailTemplates.templateNewFavorite,
    data: {
      professionalName: 'Jean Dupont',
      clientName: 'Marie Martin',
    },
  },
  {
    name: '16. Nouveau Message',
    template: emailTemplates.templateNewMessage,
    data: {
      recipientName: 'Jean Dupont',
      senderName: 'Marie Martin',
      messagePreview: 'Bonjour, j\'aimerais prendre rendez-vous...',
    },
  },
];

// Fonction pour envoyer un email de test
async function sendTestEmail(templateInfo: typeof templatesToTest[0], index: number) {
  try {
    const template = templateInfo.template(templateInfo.data as any);
    
    console.log(`📤 [${index + 1}/${templatesToTest.length}] Envoi : ${templateInfo.name}...`);
    
    const result = await resend.emails.send({
      from: 'AniReserve <noreply@anireserve.com>',
      to: testEmail,
      subject: `[TEST] ${template.subject}`,
      html: template.html,
    });
    
    if (result.error) {
      console.log(`   ❌ Erreur : ${result.error.message}`);
      return false;
    }
    
    console.log(`   ✅ Envoyé avec succès (ID: ${result.data?.id || 'N/A'})`);
    return true;
  } catch (error: any) {
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






