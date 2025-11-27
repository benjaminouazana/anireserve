import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@anireserve.com";
  const password = "AdminAniReserve2024!";
  const name = "Administrateur AniReserve";

  // Vérifier si l'admin existe déjà
  const existing = await prisma.admin.findUnique({
    where: { email },
  });

  if (existing) {
    console.log("❌ Un administrateur avec cet email existe déjà");
    return;
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer l'admin
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  console.log("✅ Administrateur créé avec succès !");
  console.log("\n📋 Informations de connexion :");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🔗 URL: http://localhost:3000/admin/login`);
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Mot de passe: ${password}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n⚠️  IMPORTANT: Changez le mot de passe après la première connexion !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

