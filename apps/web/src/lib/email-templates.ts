// Templates d'emails pour AniReserve
// Tous les scénarios possibles avec leurs templates

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

// Template de base pour tous les emails
function baseEmailTemplate(content: string, primaryColor: string = "#2FB190"): string {
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

// 1. INSCRIPTION PROFESSIONNEL - Notification Admin
export function templateNewProfessionalAdmin(data: {
  professionalName: string;
  email: string;
  phone: string | null;
  city: string;
  serviceType: string;
  description: string | null;
}): EmailTemplate {
  const content = `
    <h2 style="color: #2FB190; margin-top: 0;">🔔 Nouvelle inscription professionnel</h2>
    <p>Bonjour,</p>
    <p>Un nouveau professionnel vient de s'inscrire sur AniReserve et son dossier est en attente de validation.</p>
    
    <div style="background: #f0f9f7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2FB190;">
      <h3 style="margin-top: 0; color: #18223b;">Informations du professionnel</h3>
      <p style="margin: 5px 0;"><strong>👤 Nom :</strong> ${data.professionalName}</p>
      <p style="margin: 5px 0;"><strong>📧 Email :</strong> ${data.email}</p>
      ${data.phone ? `<p style="margin: 5px 0;"><strong>📱 Téléphone :</strong> ${data.phone}</p>` : ''}
      <p style="margin: 5px 0;"><strong>📍 Ville :</strong> ${data.city}</p>
      <p style="margin: 5px 0;"><strong>💼 Service :</strong> ${data.serviceType}</p>
      ${data.description ? `<p style="margin: 5px 0;"><strong>📝 Description :</strong> ${data.description}</p>` : ''}
    </div>
    
    <p><strong>⏳ Action requise :</strong> Connectez-vous à l'espace admin pour valider ou rejeter ce profil.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://anireserve.com'}/admin/professionals/pending" 
         style="background: #2FB190; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Accéder à l'espace admin
      </a>
    </div>
  `;
  
  return {
    subject: `🔔 Nouvelle inscription professionnel : ${data.professionalName}`,
    html: baseEmailTemplate(content, "#2FB190"),
  };
}

// 2. INSCRIPTION PROFESSIONNEL - Confirmation au Pro
export function templateProfessionalRegistrationConfirmation(data: {
  professionalName: string;
}): EmailTemplate {
  const content = `
    <h2 style="color: #2FB190; margin-top: 0;">✅ Inscription reçue !</h2>
    <p>Bonjour ${data.professionalName},</p>
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
    
    <p>Une fois votre compte validé, vous pourrez :</p>
    <ul style="line-height: 1.8;">
      <li>Gérer votre planning de disponibilités</li>
      <li>Recevoir des demandes de réservation</li>
      <li>Apparaître dans les résultats de recherche</li>
    </ul>
    
    <p>En cas de question, n'hésitez pas à nous contacter à <a href="mailto:contact@anireserve.com" style="color: #2FB190;">contact@anireserve.com</a></p>
  `;
  
  return {
    subject: "✅ Votre inscription AniReserve est en cours de traitement",
    html: baseEmailTemplate(content, "#2FB190"),
  };
}

// 3. VALIDATION PROFIL PROFESSIONNEL - Accepté
export function templateProfessionalValidated(data: {
  professionalName: string;
}): EmailTemplate {
  const content = `
    <h2 style="color: #10b981; margin-top: 0;">🎉 Votre compte est validé !</h2>
    <p>Bonjour ${data.professionalName},</p>
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
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://anireserve.com'}/pro/dashboard" 
         style="background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Accéder à mon espace pro
      </a>
    </div>
    
    <p>Bienvenue dans la communauté AniReserve ! 🎉</p>
  `;
  
  return {
    subject: "🎉 Votre compte AniReserve est validé !",
    html: baseEmailTemplate(content, "#10b981"),
  };
}

// 4. REJET PROFIL PROFESSIONNEL
export function templateProfessionalRejected(data: {
  professionalName: string;
  reason?: string;
}): EmailTemplate {
  const content = `
    <h2 style="color: #ef4444; margin-top: 0;">❌ Votre demande d'inscription</h2>
    <p>Bonjour ${data.professionalName},</p>
    <p>Nous avons examiné votre demande d'inscription sur AniReserve.</p>
    
    <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
      <p style="margin: 0; font-size: 18px; font-weight: bold; color: #ef4444;">❌ Votre profil n'a pas pu être validé</p>
      ${data.reason ? `<p style="margin: 10px 0 0 0;"><strong>Raison :</strong> ${data.reason}</p>` : ''}
    </div>
    
    <p>Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez plus d'informations, n'hésitez pas à nous contacter :</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="mailto:contact@anireserve.com" 
         style="background: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Nous contacter
      </a>
    </div>
  `;
  
  return {
    subject: "❌ Votre demande d'inscription AniReserve",
    html: baseEmailTemplate(content, "#ef4444"),
  };
}

// 5. DEMANDE DE RÉSERVATION - Client
export function templateBookingRequestClient(data: {
  clientName: string;
  professionalName: string;
  date: string;
  time: string;
}): EmailTemplate {
  const content = `
    <h2 style="color: #7c3aed; margin-top: 0;">📅 Demande de réservation</h2>
    <p>Bonjour ${data.clientName},</p>
    <p>Votre demande de réservation avec <strong>${data.professionalName}</strong> a été envoyée avec succès.</p>
    
    <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
      <p style="margin: 0;"><strong>📅 Date :</strong> ${data.date}</p>
      <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${data.time}</p>
      <p style="margin: 5px 0;"><strong>👤 Professionnel :</strong> ${data.professionalName}</p>
    </div>
    
    <p><strong>⏳ Statut :</strong> En attente de confirmation par le professionnel</p>
    <p>Le professionnel va examiner votre demande et vous confirmera rapidement. Vous recevrez un email dès qu'il aura validé votre réservation.</p>
    
    <p><strong>💳 Important :</strong> Le paiement se fera sur place au moment de la prestation.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://anireserve.com'}/my-bookings" 
         style="background: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Voir mes réservations
      </a>
    </div>
  `;
  
  return {
    subject: `📅 Demande de réservation avec ${data.professionalName}`,
    html: baseEmailTemplate(content, "#7c3aed"),
  };
}

// 6. DEMANDE DE RÉSERVATION - Professionnel
export function templateBookingRequestPro(data: {
  professionalName: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
}): EmailTemplate {
  const content = `
    <h2 style="color: #ec4899; margin-top: 0;">✨ Nouvelle demande de réservation</h2>
    <p>Bonjour ${data.professionalName},</p>
    <p>Vous avez reçu une nouvelle demande de réservation de <strong>${data.clientName}</strong>.</p>
    
    <div style="background: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ec4899;">
      <p style="margin: 0;"><strong>📅 Date :</strong> ${data.date}</p>
      <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${data.time}</p>
      <p style="margin: 5px 0;"><strong>👤 Client :</strong> ${data.clientName}</p>
      <p style="margin: 5px 0;"><strong>📧 Email client :</strong> ${data.clientEmail}</p>
    </div>
    
    <p><strong>⏳ Action requise :</strong> Connectez-vous à votre espace professionnel pour valider ou refuser cette réservation.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://anireserve.com'}/pro/dashboard" 
         style="background: #ec4899; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Accéder à mon espace pro
      </a>
    </div>
  `;
  
  return {
    subject: `✨ Nouvelle demande de réservation de ${data.clientName}`,
    html: baseEmailTemplate(content, "#ec4899"),
  };
}

// 7. RÉSERVATION CONFIRMÉE - Client
export function templateBookingConfirmedClient(data: {
  clientName: string;
  professionalName: string;
  date: string;
  time: string;
}): EmailTemplate {
  const content = `
    <h2 style="color: #10b981; margin-top: 0;">✅ Réservation confirmée !</h2>
    <p>Bonjour ${data.clientName},</p>
    <p>Excellente nouvelle ! Votre réservation avec <strong>${data.professionalName}</strong> a été confirmée.</p>
    
    <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
      <p style="margin: 0;"><strong>📅 Date :</strong> ${data.date}</p>
      <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${data.time}</p>
      <p style="margin: 5px 0;"><strong>👤 Professionnel :</strong> ${data.professionalName}</p>
    </div>
    
    <p><strong>💳 Important :</strong> Le paiement se fera sur place au moment de la prestation.</p>
    
    <p>Nous vous attendons avec impatience !</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://anireserve.com'}/my-bookings" 
         style="background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Voir mes réservations
      </a>
    </div>
  `;
  
  return {
    subject: `✅ Réservation confirmée avec ${data.professionalName}`,
    html: baseEmailTemplate(content, "#10b981"),
  };
}

// 8. RÉSERVATION CONFIRMÉE - Professionnel
export function templateBookingConfirmedPro(data: {
  professionalName: string;
  clientName: string;
  date: string;
  time: string;
}): EmailTemplate {
  const content = `
    <h2 style="color: #10b981; margin-top: 0;">✅ Réservation confirmée</h2>
    <p>Bonjour ${data.professionalName},</p>
    <p>Vous avez confirmé la réservation de <strong>${data.clientName}</strong>.</p>
    
    <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
      <p style="margin: 0;"><strong>📅 Date :</strong> ${data.date}</p>
      <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${data.time}</p>
      <p style="margin: 5px 0;"><strong>👤 Client :</strong> ${data.clientName}</p>
    </div>
    
    <p>Le client a été notifié de la confirmation. N'oubliez pas de préparer votre rendez-vous !</p>
  `;
  
  return {
    subject: `✅ Réservation confirmée : ${data.clientName} le ${data.date}`,
    html: baseEmailTemplate(content, "#10b981"),
  };
}

// 9. RÉSERVATION ANNULÉE - Client
export function templateBookingCancelledClient(data: {
  clientName: string;
  professionalName: string;
  date: string;
  time: string;
}): EmailTemplate {
  const content = `
    <h2 style="color: #ef4444; margin-top: 0;">❌ Réservation annulée</h2>
    <p>Bonjour ${data.clientName},</p>
    <p>Votre réservation avec <strong>${data.professionalName}</strong> a été annulée.</p>
    
    <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
      <p style="margin: 0;"><strong>📅 Date :</strong> ${data.date}</p>
      <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${data.time}</p>
      <p style="margin: 5px 0;"><strong>👤 Professionnel :</strong> ${data.professionalName}</p>
    </div>
    
    <p>Vous pouvez réserver un autre créneau si vous le souhaitez.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://anireserve.com'}" 
         style="background: #2FB190; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Rechercher un professionnel
      </a>
    </div>
  `;
  
  return {
    subject: `❌ Réservation annulée avec ${data.professionalName}`,
    html: baseEmailTemplate(content, "#ef4444"),
  };
}

// 10. RÉSERVATION ANNULÉE - Professionnel
export function templateBookingCancelledPro(data: {
  professionalName: string;
  clientName: string;
  date: string;
  time: string;
}): EmailTemplate {
  const content = `
    <h2 style="color: #ef4444; margin-top: 0;">❌ Réservation annulée</h2>
    <p>Bonjour ${data.professionalName},</p>
    <p>La réservation de <strong>${data.clientName}</strong> a été annulée.</p>
    
    <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
      <p style="margin: 0;"><strong>📅 Date :</strong> ${data.date}</p>
      <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${data.time}</p>
      <p style="margin: 5px 0;"><strong>👤 Client :</strong> ${data.clientName}</p>
    </div>
    
    <p>Ce créneau est maintenant disponible pour d'autres réservations.</p>
  `;
  
  return {
    subject: `❌ Réservation annulée : ${data.clientName} le ${data.date}`,
    html: baseEmailTemplate(content, "#ef4444"),
  };
}

// 11. RAPPEL DE RÉSERVATION
export function templateBookingReminder(data: {
  recipientName: string;
  professionalName: string;
  date: string;
  time: string;
}): EmailTemplate {
  const content = `
    <h2 style="color: #f59e0b; margin-top: 0;">⏰ Rappel de rendez-vous</h2>
    <p>Bonjour ${data.recipientName},</p>
    <p>Ceci est un rappel pour votre rendez-vous avec <strong>${data.professionalName}</strong>.</p>
    
    <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0;"><strong>📅 Date :</strong> ${data.date}</p>
      <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${data.time}</p>
      <p style="margin: 5px 0;"><strong>👤 Professionnel :</strong> ${data.professionalName}</p>
    </div>
    
    <p><strong>💳 Rappel :</strong> Le paiement se fera sur place au moment de la prestation.</p>
    
    <p>À bientôt !</p>
  `;
  
  return {
    subject: `⏰ Rappel : Rendez-vous demain avec ${data.professionalName}`,
    html: baseEmailTemplate(content, "#f59e0b"),
  };
}

// 12. RÉINITIALISATION MOT DE PASSE - Client
export function templatePasswordResetClient(data: {
  clientName: string;
  resetToken: string;
}): EmailTemplate {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://anireserve.com'}/client/reset-password?token=${data.resetToken}`;
  
  const content = `
    <h2 style="color: #7c3aed; margin-top: 0;">🔐 Réinitialisation de mot de passe</h2>
    <p>Bonjour ${data.clientName},</p>
    <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="background: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Réinitialiser mon mot de passe
      </a>
    </div>
    
    <p>Ce lien est valide pendant <strong>1 heure</strong>.</p>
    <p style="color: #6b7280; font-size: 12px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
  `;
  
  return {
    subject: "🔐 Réinitialisation de votre mot de passe",
    html: baseEmailTemplate(content, "#7c3aed"),
  };
}

// 13. RÉINITIALISATION MOT DE PASSE - Professionnel
export function templatePasswordResetPro(data: {
  professionalName: string;
  resetToken: string;
}): EmailTemplate {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://anireserve.com'}/pro/reset-password?token=${data.resetToken}`;
  
  const content = `
    <h2 style="color: #ec4899; margin-top: 0;">🔐 Réinitialisation de mot de passe</h2>
    <p>Bonjour ${data.professionalName},</p>
    <p>Vous avez demandé à réinitialiser votre mot de passe professionnel.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="background: #ec4899; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Réinitialiser mon mot de passe
      </a>
    </div>
    
    <p>Ce lien est valide pendant <strong>1 heure</strong>.</p>
    <p style="color: #6b7280; font-size: 12px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
  `;
  
  return {
    subject: "🔐 Réinitialisation de votre mot de passe professionnel",
    html: baseEmailTemplate(content, "#ec4899"),
  };
}

// 14. NOUVEAU COMMENTAIRE/AVIS
export function templateNewReview(data: {
  professionalName: string;
  clientName: string;
  rating: number;
  comment?: string;
}): EmailTemplate {
  const stars = "⭐".repeat(data.rating);
  
  const content = `
    <h2 style="color: #f59e0b; margin-top: 0;">⭐ Nouvel avis reçu</h2>
    <p>Bonjour ${data.professionalName},</p>
    <p><strong>${data.clientName}</strong> a laissé un avis sur votre profil.</p>
    
    <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0; font-size: 24px;">${stars}</p>
      ${data.comment ? `<p style="margin: 10px 0 0 0; font-style: italic;">"${data.comment}"</p>` : ''}
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://anireserve.com'}/pro/dashboard" 
         style="background: #f59e0b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Voir mon profil
      </a>
    </div>
  `;
  
  return {
    subject: `⭐ Nouvel avis de ${data.clientName}`,
    html: baseEmailTemplate(content, "#f59e0b"),
  };
}

// 15. NOUVEAU FAVORI
export function templateNewFavorite(data: {
  professionalName: string;
  clientName: string;
}): EmailTemplate {
  const content = `
    <h2 style="color: #ec4899; margin-top: 0;">❤️ Nouveau favori</h2>
    <p>Bonjour ${data.professionalName},</p>
    <p><strong>${data.clientName}</strong> a ajouté votre profil à ses favoris.</p>
    
    <p>Cela signifie que votre profil intéresse ce client. Continuez à offrir un excellent service !</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://anireserve.com'}/pro/dashboard" 
         style="background: #ec4899; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Voir mon profil
      </a>
    </div>
  `;
  
  return {
    subject: `❤️ ${data.clientName} vous a ajouté aux favoris`,
    html: baseEmailTemplate(content, "#ec4899"),
  };
}

// 16. MESSAGE RECU (si système de messagerie)
export function templateNewMessage(data: {
  recipientName: string;
  senderName: string;
  messagePreview: string;
}): EmailTemplate {
  const content = `
    <h2 style="color: #3b82f6; margin-top: 0;">💬 Nouveau message</h2>
    <p>Bonjour ${data.recipientName},</p>
    <p>Vous avez reçu un nouveau message de <strong>${data.senderName}</strong>.</p>
    
    <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
      <p style="margin: 0; font-style: italic;">"${data.messagePreview}"</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://anireserve.com'}/messages" 
         style="background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Voir le message
      </a>
    </div>
  `;
  
  return {
    subject: `💬 Nouveau message de ${data.senderName}`,
    html: baseEmailTemplate(content, "#3b82f6"),
  };
}

// Export de tous les templates
export const emailTemplates = {
  newProfessionalAdmin: templateNewProfessionalAdmin,
  professionalRegistrationConfirmation: templateProfessionalRegistrationConfirmation,
  professionalValidated: templateProfessionalValidated,
  professionalRejected: templateProfessionalRejected,
  bookingRequestClient: templateBookingRequestClient,
  bookingRequestPro: templateBookingRequestPro,
  bookingConfirmedClient: templateBookingConfirmedClient,
  bookingConfirmedPro: templateBookingConfirmedPro,
  bookingCancelledClient: templateBookingCancelledClient,
  bookingCancelledPro: templateBookingCancelledPro,
  bookingReminder: templateBookingReminder,
  passwordResetClient: templatePasswordResetClient,
  passwordResetPro: templatePasswordResetPro,
  newReview: templateNewReview,
  newFavorite: templateNewFavorite,
  newMessage: templateNewMessage,
};

