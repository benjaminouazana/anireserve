const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log("Création du professionnel...");

  try {
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
  } catch (error) {
    if (error.code === 'P2002') {
      console.log("⚠️  Un professionnel avec cet email existe déjà.");
      console.log("Tu peux quand même te connecter avec sarah@example.com / test123");
    } else {
      console.error("❌ Erreur:", error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
