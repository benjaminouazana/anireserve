import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as any;
      const bookingId = parseInt(paymentIntent.metadata.bookingId);

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: "paid",
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Erreur webhook Stripe:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

