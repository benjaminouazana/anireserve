import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";

// Configuration du webhook Resend
const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || "";

// Types pour les événements Resend
interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
    created_at?: string;
    // Pour les événements de livraison
    event?: string;
    timestamp?: number;
    // Pour les événements d'ouverture
    opened_at?: string;
    // Pour les événements de clic
    clicked_at?: string;
    link?: string;
    // Pour les bounces
    bounce_type?: string;
    bounce_sub_type?: string;
    reason?: string;
    // Pour les plaintes
    complaint_type?: string;
  };
}

// Vérifier la signature du webhook
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!secret) {
    console.warn("⚠️ RESEND_WEBHOOK_SECRET non configuré, signature non vérifiée");
    return true; // En développement, accepter sans vérification
  }

  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(payload).digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    );
  } catch (error) {
    console.error("Erreur vérification signature:", error);
    return false;
  }
}

// Traiter les événements webhook
async function processWebhookEvent(event: ResendWebhookEvent) {
  const { type, data } = event;

  console.log(`📧 Webhook Resend reçu: ${type}`, {
    email_id: data.email_id,
    to: data.to,
    subject: data.subject,
  });

  switch (type) {
    case "email.sent":
      await handleEmailSent(data);
      break;

    case "email.delivered":
      await handleEmailDelivered(data);
      break;

    case "email.delivery_delayed":
      await handleEmailDelayed(data);
      break;

    case "email.complained":
      await handleEmailComplained(data);
      break;

    case "email.bounced":
      await handleEmailBounced(data);
      break;

    case "email.opened":
      await handleEmailOpened(data);
      break;

    case "email.clicked":
      await handleEmailClicked(data);
      break;

    case "email.unsubscribed":
      await handleEmailUnsubscribed(data);
      break;

    default:
      console.log(`⚠️ Type d'événement non géré: ${type}`);
  }
}

// Handlers pour chaque type d'événement
async function handleEmailSent(data: ResendWebhookEvent["data"]) {
  console.log("✅ Email envoyé avec succès", {
    email_id: data.email_id,
    to: data.to,
    subject: data.subject,
  });
  // Ici vous pouvez logger dans une base de données, envoyer une notification, etc.
}

async function handleEmailDelivered(data: ResendWebhookEvent["data"]) {
  console.log("📬 Email livré", {
    email_id: data.email_id,
    to: data.to,
    timestamp: data.timestamp,
  });
  // Mettre à jour le statut dans la base de données si nécessaire
}

async function handleEmailDelayed(data: ResendWebhookEvent["data"]) {
  console.warn("⏳ Email en retard de livraison", {
    email_id: data.email_id,
    to: data.to,
    reason: data.reason,
  });
  // Notifier l'admin ou logger pour investigation
}

async function handleEmailBounced(data: ResendWebhookEvent["data"]) {
  console.error("❌ Email rebondi", {
    email_id: data.email_id,
    to: data.to,
    bounce_type: data.bounce_type,
    bounce_sub_type: data.bounce_sub_type,
    reason: data.reason,
  });
  // Marquer l'email comme invalide dans la base de données
  // Notifier l'admin si nécessaire
}

async function handleEmailComplained(data: ResendWebhookEvent["data"]) {
  console.warn("⚠️ Plainte reçue (spam)", {
    email_id: data.email_id,
    to: data.to,
    complaint_type: data.complaint_type,
  });
  // Marquer l'utilisateur comme ayant signalé du spam
  // Réduire la fréquence d'envoi pour cet utilisateur
}

async function handleEmailOpened(data: ResendWebhookEvent["data"]) {
  console.log("👁️ Email ouvert", {
    email_id: data.email_id,
    to: data.to,
    opened_at: data.opened_at,
  });
  // Tracker les ouvertures pour analytics
}

async function handleEmailClicked(data: ResendWebhookEvent["data"]) {
  console.log("🖱️ Lien cliqué dans l'email", {
    email_id: data.email_id,
    to: data.to,
    link: data.link,
    clicked_at: data.clicked_at,
  });
  // Tracker les clics pour analytics
}

async function handleEmailUnsubscribed(data: ResendWebhookEvent["data"]) {
  console.log("🚫 Désabonnement", {
    email_id: data.email_id,
    to: data.to,
  });
  // Marquer l'utilisateur comme désabonné
  // Ne plus envoyer d'emails marketing à cet utilisateur
}

// Route POST pour recevoir les webhooks
export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const signature = headersList.get("resend-signature") || "";

    // Lire le body
    const body = await req.text();
    const payload = JSON.parse(body);

    // Vérifier la signature (optionnel mais recommandé)
    if (RESEND_WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(
        body,
        signature,
        RESEND_WEBHOOK_SECRET
      );

      if (!isValid) {
        console.error("❌ Signature webhook invalide");
        return NextResponse.json(
          { error: "Signature invalide" },
          { status: 401 }
        );
      }
    }

    // Traiter l'événement
    await processWebhookEvent(payload);

    // Répondre rapidement à Resend
    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur traitement webhook:", errorMessage);
    
    // Toujours répondre 200 pour éviter que Resend réessaie
    return NextResponse.json(
      { error: errorMessage },
      { status: 200 }
    );
  }
}

// Route GET pour vérifier que le webhook est accessible
export async function GET() {
  return NextResponse.json({
    message: "Webhook Resend actif",
    endpoint: "/api/webhooks/resend",
    events: [
      "email.sent",
      "email.delivered",
      "email.delivery_delayed",
      "email.complained",
      "email.bounced",
      "email.opened",
      "email.clicked",
      "email.unsubscribed",
    ],
  });
}



