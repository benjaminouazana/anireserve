import { Resend } from "resend";

// Initialiser Resend (utilise la variable d'environnement RESEND_API_KEY)
const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function sendBookingConfirmationEmail(
  to: string,
  clientName: string,
  professionalName: string,
  date: string,
  time: string
) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
      console.log("📧 Email (simulé) - Confirmation de réservation envoyée à", to);
      return { success: true, simulated: true };
    }

    await resend.emails.send({
      from: "AniReserve <noreply@anireserve.com>",
      to,
      subject: `Confirmation de réservation avec ${professionalName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #18181b;">Confirmation de réservation</h1>
          <p>Bonjour ${clientName},</p>
          <p>Votre réservation avec <strong>${professionalName}</strong> a été confirmée.</p>
          <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date :</strong> ${date}</p>
            <p><strong>Heure :</strong> ${time}</p>
          </div>
          <p>À bientôt !</p>
          <p style="color: #71717a; font-size: 12px;">AniReserve - Réservation entre professionnels et clients en Israël</p>
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

export async function sendBookingStatusChangeEmail(
  to: string,
  clientName: string,
  professionalName: string,
  status: "confirmed" | "cancelled",
  date: string,
  time: string
) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
      console.log(`📧 Email (simulé) - Changement de statut (${status}) envoyé à`, to);
      return { success: true, simulated: true };
    }

    const statusText = status === "confirmed" ? "confirmée" : "annulée";
    const subject = status === "confirmed" 
      ? `Réservation confirmée avec ${professionalName}`
      : `Réservation annulée avec ${professionalName}`;

    await resend.emails.send({
      from: "AniReserve <noreply@anireserve.com>",
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #18181b;">Réservation ${statusText}</h1>
          <p>Bonjour ${clientName},</p>
          <p>Votre réservation avec <strong>${professionalName}</strong> a été ${statusText}.</p>
          <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date :</strong> ${date}</p>
            <p><strong>Heure :</strong> ${time}</p>
            <p><strong>Statut :</strong> ${status === "confirmed" ? "✅ Confirmée" : "❌ Annulée"}</p>
          </div>
          ${status === "cancelled" ? "<p>Vous pouvez réserver un autre créneau si vous le souhaitez.</p>" : ""}
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

