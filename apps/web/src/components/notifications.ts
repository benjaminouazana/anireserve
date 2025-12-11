/**
 * System de notifications email automatiques
 * Envoie des emails pour événements importants
 */

import { sendEmail } from './email';

// Notification nouvelle réservation (Pro)
export async function notifyNewBooking(booking: {
    professionalEmail: string;
    professionalName: string;
    clientName: string;
    date: string;
    startTime: string;
    endTime: string;
    service: string;
}) {
    await sendEmail({
        to: booking.professionalEmail,
        subject: `🎉 Nouvelle réservation - ${booking.clientName}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2FB190;">Nouvelle réservation !</h2>
        <p>Bonjour ${booking.professionalName},</p>
        <p>Vous avez reçu une nouvelle réservation :</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Client:</strong> ${booking.clientName}</p>
          <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> ${booking.startTime} - ${booking.endTime}</p>
          <p><strong>Service:</strong> ${booking.service}</p>
        </div>
        
        <p>
          <a href="https://anireserve.com/pro/dashboard" 
             style="background: #2FB190; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Voir le détail
          </a>
        </p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          AniReserve - Votre plateforme de réservation
        </p>
      </div>
    `,
    });
}

// Notification confirmation réservation (Client)
export async function notifyBookingConfirmation(booking: {
    clientEmail: string;
    clientName: string;
    professionalName: string;
    date: string;
    startTime: string;
    endTime: string;
    service: string;
}) {
    await sendEmail({
        to: booking.clientEmail,
        subject: `✅ Réservation confirmée - ${booking.professionalName}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2FB190;">Réservation confirmée !</h2>
        <p>Bonjour ${booking.clientName},</p>
        <p>Votre réservation a été confirmée :</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Professionnel:</strong> ${booking.professionalName}</p>
          <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> ${booking.startTime} - ${booking.endTime}</p>
          <p><strong>Service:</strong> ${booking.service}</p>
        </div>
        
        <p>
          <a href="https://anireserve.com/my-bookings" 
             style="background: #2FB190; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Voir mes réservations
          </a>
        </p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          AniReserve - Votre plateforme de réservation
        </p>
      </div>
    `,
    });
}

// Rappel 24h avant (Client)
export async function notifyReminder24h(booking: {
    clientEmail: string;
    clientName: string;
    professionalName: string;
    date: string;
    startTime: string;
    address?: string;
}) {
    await sendEmail({
        to: booking.clientEmail,
        subject: `⏰ Rappel - RDV demain avec ${booking.professionalName}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2FB190;">Rappel de rendez-vous</h2>
        <p>Bonjour ${booking.clientName},</p>
        <p>N'oubliez pas votre rendez-vous <strong>demain</strong> :</p>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p><strong>Avec:</strong> ${booking.professionalName}</p>
          <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> ${booking.startTime}</p>
          ${booking.address ? `<p><strong>Adresse:</strong> ${booking.address}</p>` : ''}
        </div>
        
        <p>À bientôt !</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          AniReserve - Votre plateforme de réservation
        </p>
      </div>
    `,
    });
}

// Demande d'avis après RDV (Client)
export async function notifyRequestReview(booking: {
    clientEmail: string;
    clientName: string;
    professionalName: string;
    professionalSlug: string;
    bookingId: number;
}) {
    await sendEmail({
        to: booking.clientEmail,
        subject: `⭐ Comment s'est passé votre RDV avec ${booking.professionalName} ?`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2FB190;">Votre avis compte !</h2>
        <p>Bonjour ${booking.clientName},</p>
        <p>Vous avez récemment eu un rendez-vous avec <strong>${booking.professionalName}</strong>.</p>
        <p>Prenez quelques secondes pour laisser votre avis et aider la communauté :</p>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://anireserve.com/professionals/${booking.professionalSlug}?review=${booking.bookingId}" 
             style="background: #2FB190; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px;">
            ⭐ Laisser un avis
          </a>
        </p>
        
        <p style="color: #666; font-size: 14px;">
          Votre avis aide les autres à faire le bon choix. Merci ! 🙏
        </p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          AniReserve - Votre plateforme de réservation
        </p>
      </div>
    `,
    });
}

// Export calendar ICS
export function generateICS(booking: {
    professionalName: string;
    date: string;
    startTime: string;
    endTime: string;
    service: string;
    address?: string;
    phone?: string;
}) {
    const startDate = new Date(`${booking.date}T${booking.startTime}`);
    const endDate = new Date(`${booking.date}T${booking.endTime}`);

    const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AniReserve//FR
BEGIN:VEVENT
UID:${Date.now()}@anireserve.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:RDV ${booking.service} - ${booking.professionalName}
DESCRIPTION:Rendez-vous ${booking.service} avec ${booking.professionalName}
${booking.phone ? `LOCATION:${booking.address || ''}\nPHONE:${booking.phone}` : ''}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}
