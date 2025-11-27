import { PrismaClient } from "./apps/web/node_modules/@prisma/client";

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

async function main() {
  console.log("Création du professionnel...");

  const professional = await prisma.professional.create({
    data: {
      name: "Sarah Coach",
      email: "sarah@example.com",
      password: "test123",
      city: "Jérusalem",
      serviceType: "Coach sportif",
      description: "Coach sportif spécialisée en remise en forme et perte de poids",
      languages: "fr,he,en",
    },
  });

  console.log("✅ Professionnel créé avec succès !");
  console.log("Email:", professional.email);
  console.log("Mot de passe: test123");
  console.log("\nTu peux maintenant te connecter sur http://localhost:3003/pro/login");
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

