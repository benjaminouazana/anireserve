import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Disponibilités par défaut (Lundi-Vendredi 9h-18h, pause 12h-13h)
const defaultAvailability = {
  monday: { enabled: true, start: "09:00", end: "18:00" },
  tuesday: { enabled: true, start: "09:00", end: "18:00" },
  wednesday: { enabled: true, start: "09:00", end: "18:00" },
  thursday: { enabled: true, start: "09:00", end: "18:00" },
  friday: { enabled: true, start: "09:00", end: "18:00" },
  saturday: { enabled: false, start: "09:00", end: "18:00" },
  sunday: { enabled: false, start: "09:00", end: "18:00" },
  slotDuration: 30,
  breakStart: "12:00",
  breakEnd: "13:00",
};

async function main() {
  console.log("🚀 Configuration des disponibilités par défaut...\n");

  // Récupérer tous les professionnels sans disponibilités
  const professionals = await prisma.professional.findMany({
    where: {
      OR: [
        { availability: null },
        { availability: "" },
      ],
    },
  });

  if (professionals.length === 0) {
    console.log("✅ Tous les professionnels ont déjà des disponibilités configurées.");
    return;
  }

  console.log(`📋 ${professionals.length} professionnel(s) à configurer\n`);

  for (const pro of professionals) {
    try {
      await prisma.professional.update({
        where: { id: pro.id },
        data: {
          availability: JSON.stringify(defaultAvailability),
          breakStart: "12:00",
          breakEnd: "13:00",
        },
      });
      console.log(`✅ ${pro.name} - Disponibilités configurées`);
    } catch (error) {
      console.error(`❌ Erreur pour ${pro.name}:`, error);
    }
  }

  console.log("\n✨ Terminé !");
  console.log(`\n📊 Résumé:`);
  console.log(`   - ${professionals.length} professionnel(s) configuré(s)`);
  console.log(`   - Horaires : Lundi-Vendredi 9h-18h`);
  console.log(`   - Pause : 12h-13h`);
  console.log(`   - Durée des créneaux : 30 minutes`);
}

main()
  .catch((e) => {
    console.error("Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });








