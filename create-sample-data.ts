import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Création de données d'exemple...\n");

  // Récupérer les professionnels créés
  const professionals = await prisma.professional.findMany({
    take: 12,
    orderBy: { id: "desc" },
  });

  if (professionals.length === 0) {
    console.log("❌ Aucun professionnel trouvé. Exécutez d'abord create-multiple-pros.ts");
    return;
  }

  // Créer quelques clients
  const clients = [];
  const clientEmails = [
    "marie.dupont@example.com",
    "jean.martin@example.com",
    "sarah.bernard@example.com",
    "pierre.durand@example.com",
  ];

  for (const email of clientEmails) {
    const existing = await prisma.client.findUnique({ where: { email } });
    if (!existing) {
      const client = await prisma.client.create({
        data: {
          name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          email,
        },
      });
      clients.push(client);
      console.log(`✅ Client créé: ${client.name}`);
    } else {
      clients.push(existing);
    }
  }

  // Créer des réservations
  const bookings = [];
  const now = new Date();
  
  for (let i = 0; i < 20; i++) {
    const pro = professionals[Math.floor(Math.random() * professionals.length)];
    const client = clients[Math.floor(Math.random() * clients.length)];
    
    // Dates variées : certaines passées, certaines futures
    const daysOffset = Math.floor(Math.random() * 30) - 10; // -10 à +20 jours
    const startTime = new Date(now);
    startTime.setDate(startTime.getDate() + daysOffset);
    startTime.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 4) * 15, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);
    
    const statuses = ["pending", "confirmed", "cancelled"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    try {
      const booking = await prisma.booking.create({
        data: {
          professionalId: pro.id,
          clientId: client.id,
          startTime,
          endTime,
          status,
          amount: Math.floor(Math.random() * 500) + 100,
        },
      });
      bookings.push(booking);
    } catch (error) {
      // Ignorer les erreurs de doublons
    }
  }

  console.log(`✅ ${bookings.length} réservations créées`);

  // Créer des avis pour les réservations confirmées
  const confirmedBookings = await prisma.booking.findMany({
    where: { status: "confirmed" },
    take: 15,
  });

  let reviewsCount = 0;
  for (const booking of confirmedBookings) {
    // Vérifier si un avis existe déjà
    const existingReview = await prisma.review.findUnique({
      where: { bookingId: booking.id },
    });

    if (!existingReview) {
      const ratings = [4, 4, 5, 5, 5, 4, 5, 5, 4, 5]; // Biais vers les bonnes notes
      const comments = [
        "Excellent service, très professionnel !",
        "Très satisfait, je recommande vivement.",
        "Service impeccable, je reviendrai.",
        "Professionnel à l'écoute et compétent.",
        "Parfait ! Tout s'est très bien passé.",
        "Très bon service, je suis ravi.",
        "Excellent rapport qualité-prix.",
        "Service de qualité, je recommande.",
        "Très professionnel et sympathique.",
        "Parfait, je n'hésiterai pas à revenir.",
      ];

      const rating = ratings[Math.floor(Math.random() * ratings.length)];
      const comment = comments[Math.floor(Math.random() * comments.length)];

      try {
        await prisma.review.create({
          data: {
            bookingId: booking.id,
            professionalId: booking.professionalId,
            clientId: booking.clientId,
            rating,
            comment,
          },
        });
        reviewsCount++;
      } catch (error) {
        // Ignorer les erreurs
      }
    }
  }

  console.log(`✅ ${reviewsCount} avis créés`);

  console.log("\n✨ Terminé !");
  console.log(`\n📊 Résumé:`);
  console.log(`   - ${professionals.length} professionnels`);
  console.log(`   - ${clients.length} clients`);
  console.log(`   - ${bookings.length} réservations`);
  console.log(`   - ${reviewsCount} avis`);
}

main()
  .catch((e) => {
    console.error("Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });





