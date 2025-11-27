import { Resend } from "resend";

// Initialiser Resend (utilise la variable d'environnement RESEND_API_KEY)
const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

// Email pour le client : demande de réservation créée (en attente)
export async function sendBookingRequestEmailToClient(
  to: string,
  clientName: string,
  professionalName: string,
  date: string,
  time: string
) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
      console.log("📧 Email (simulé) - Demande de réservation envoyée au client", to);
      return { success: true, simulated: true };
    }

    await resend.emails.send({
      from: "AniReserve <noreply@anireserve.com>",
      to,
      subject: `Demande de réservation avec ${professionalName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #7c3aed;">📅 Demande de réservation</h1>
          <p>Bonjour ${clientName},</p>
          <p>Votre demande de réservation avec <strong>${professionalName}</strong> a été envoyée avec succès.</p>
          <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
            <p style="margin: 0;"><strong>📅 Date :</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>👤 Professionnel :</strong> ${professionalName}</p>
          </div>
          <p><strong>⏳ Statut :</strong> En attente de confirmation par le professionnel</p>
          <p>Le professionnel va examiner votre demande et vous confirmera rapidement. Vous recevrez un email dès qu'il aura validé votre réservation.</p>
          <p><strong>💳 Important :</strong> Le paiement se fera sur place au moment de la prestation.</p>
          <p>À bientôt !</p>
          <p style="color: #71717a; font-size: 12px; margin-top: 30px;">AniReserve - La plateforme de réservation en Israël pour les Français</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, error };
  }
}

// Email pour le professionnel : nouvelle demande de réservation
export async function sendBookingRequestEmailToPro(
  to: string,
  professionalName: string,
  clientName: string,
  clientEmail: string,
  date: string,
  time: string
) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
      console.log("📧 Email (simulé) - Nouvelle demande de réservation envoyée au pro", to);
      return { success: true, simulated: true };
    }

    await resend.emails.send({
      from: "AniReserve <noreply@anireserve.com>",
      to,
      subject: `Nouvelle demande de réservation de ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #ec4899;">✨ Nouvelle demande de réservation</h1>
          <p>Bonjour ${professionalName},</p>
          <p>Vous avez reçu une nouvelle demande de réservation de <strong>${clientName}</strong>.</p>
          <div style="background: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ec4899;">
            <p style="margin: 0;"><strong>📅 Date :</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>👤 Client :</strong> ${clientName}</p>
            <p style="margin: 5px 0;"><strong>📧 Email client :</strong> ${clientEmail}</p>
          </div>
          <p><strong>⏳ Action requise :</strong> Connectez-vous à votre espace professionnel pour valider ou refuser cette réservation.</p>
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pro/dashboard" 
               style="background: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Accéder à mon espace pro
            </a>
          </p>
          <p style="color: #71717a; font-size: 12px; margin-top: 30px;">AniReserve - La plateforme de réservation en Israël pour les Français</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, error };
  }
}

// Email pour le client : réservation confirmée par le pro
export async function sendBookingConfirmationEmail(
  to: string,
  clientName: string,
  professionalName: string,
  date: string,
  time: string
) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
      console.log("📧 Email (simulé) - Confirmation de réservation envoyée au client", to);
      return { success: true, simulated: true };
    }

    await resend.emails.send({
      from: "AniReserve <noreply@anireserve.com>",
      to,
      subject: `✅ Réservation confirmée avec ${professionalName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #10b981;">✅ Réservation confirmée !</h1>
          <p>Bonjour ${clientName},</p>
          <p>Excellente nouvelle ! Votre réservation avec <strong>${professionalName}</strong> a été confirmée.</p>
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0;"><strong>📅 Date :</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>👤 Professionnel :</strong> ${professionalName}</p>
          </div>
          <p><strong>💳 Important :</strong> Le paiement se fera sur place au moment de la prestation.</p>
          <p>Nous vous attendons avec impatience !</p>
          <p style="color: #71717a; font-size: 12px; margin-top: 30px;">AniReserve - La plateforme de réservation en Israël pour les Français</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, error };
  }
}

// Email pour le pro : confirmation de sa validation
export async function sendBookingConfirmedEmailToPro(
  to: string,
  professionalName: string,
  clientName: string,
  date: string,
  time: string
) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
      console.log("📧 Email (simulé) - Confirmation envoyée au pro", to);
      return { success: true, simulated: true };
    }

    await resend.emails.send({
      from: "AniReserve <noreply@anireserve.com>",
      to,
      subject: `Réservation confirmée : ${clientName} le ${date}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #10b981;">✅ Réservation confirmée</h1>
          <p>Bonjour ${professionalName},</p>
          <p>Vous avez confirmé la réservation de <strong>${clientName}</strong>.</p>
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0;"><strong>📅 Date :</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>👤 Client :</strong> ${clientName}</p>
          </div>
          <p>Le client a été notifié de la confirmation. N'oubliez pas de préparer votre rendez-vous !</p>
          <p style="color: #71717a; font-size: 12px; margin-top: 30px;">AniReserve - La plateforme de réservation en Israël pour les Français</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, error };
  }
}

export async function sendBookingReminderEmail(
  to: string,
  clientName: string,
  professionalName: string,
  date: string,
  time: string
) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
      console.log("📧 Email (simulé) - Rappel de réservation envoyé à", to);
      return { success: true, simulated: true };
    }

    await resend.emails.send({
      from: "AniReserve <noreply@anireserve.com>",
      to,
      subject: `Rappel : Rendez-vous demain avec ${professionalName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #18181b;">Rappel de rendez-vous</h1>
          <p>Bonjour ${clientName},</p>
          <p>Ceci est un rappel pour votre rendez-vous avec <strong>${professionalName}</strong>.</p>
          <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date :</strong> ${date}</p>
            <p><strong>Heure :</strong> ${time}</p>
          </div>
          <p>À demain !</p>
          <p style="color: #71717a; font-size: 12px;">AniReserve</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, error };
  }
}

// Email pour le client : réservation annulée
export async function sendBookingCancelledEmailToClient(
  to: string,
  clientName: string,
  professionalName: string,
  date: string,
  time: string
) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
      console.log("📧 Email (simulé) - Annulation envoyée au client", to);
      return { success: true, simulated: true };
    }

    await resend.emails.send({
      from: "AniReserve <noreply@anireserve.com>",
      to,
      subject: `❌ Réservation annulée avec ${professionalName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #ef4444;">❌ Réservation annulée</h1>
          <p>Bonjour ${clientName},</p>
          <p>Votre réservation avec <strong>${professionalName}</strong> a été annulée.</p>
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p style="margin: 0;"><strong>📅 Date :</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>👤 Professionnel :</strong> ${professionalName}</p>
          </div>
          <p>Vous pouvez réserver un autre créneau si vous le souhaitez.</p>
          <p style="color: #71717a; font-size: 12px; margin-top: 30px;">AniReserve - La plateforme de réservation en Israël pour les Français</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, error };
  }
}

// Email pour le pro : réservation annulée
export async function sendBookingCancelledEmailToPro(
  to: string,
  professionalName: string,
  clientName: string,
  date: string,
  time: string
) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
      console.log("📧 Email (simulé) - Annulation envoyée au pro", to);
      return { success: true, simulated: true };
    }

    await resend.emails.send({
      from: "AniReserve <noreply@anireserve.com>",
      to,
      subject: `Réservation annulée : ${clientName} le ${date}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #ef4444;">❌ Réservation annulée</h1>
          <p>Bonjour ${professionalName},</p>
          <p>La réservation de <strong>${clientName}</strong> a été annulée.</p>
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p style="margin: 0;"><strong>📅 Date :</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>⏰ Heure :</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>👤 Client :</strong> ${clientName}</p>
          </div>
          <p>Ce créneau est maintenant disponible pour d'autres réservations.</p>
          <p style="color: #71717a; font-size: 12px; margin-top: 30px;">AniReserve - La plateforme de réservation en Israël pour les Français</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, error };
  }
}

