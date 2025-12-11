/**
 * Script de migration des mots de passe en clair vers bcrypt
 * 
 * ⚠️ SÉCURITÉ: Ce script doit être exécuté pour migrer tous les mots de passe
 * en clair vers des hash bcrypt.
 * 
 * Usage:
 *   npx tsx scripts/migrate-passwords.ts
 * 
 * Ou avec ts-node:
 *   ts-node scripts/migrate-passwords.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config({ path: ".env" });

const prisma = new PrismaClient();

async function migratePasswords() {
  console.log("🔐 Début de la migration des mots de passe...\n");

  let migratedCount = 0;
  let errorCount = 0;

  // Migrer les mots de passe des professionnels
  console.log("📋 Migration des professionnels...");
  const professionals = await prisma.professional.findMany({
    where: {
      password: {
        not: {
          startsWith: "$2", // Exclure les mots de passe déjà hashés
        },
      },
    },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  console.log(`   Trouvé ${professionals.length} professionnel(s) avec mot de passe en clair`);

  for (const pro of professionals) {
    try {
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(pro.password, 10);
      
      await prisma.professional.update({
        where: { id: pro.id },
        data: { password: hashedPassword },
      });

      console.log(`   ✅ Migré: ${pro.email}`);
      migratedCount++;
    } catch (error) {
      console.error(`   ❌ Erreur pour ${pro.email}:`, error);
      errorCount++;
    }
  }

  // Migrer les mots de passe des clients
  console.log("\n📋 Migration des clients...");
  const clients = await prisma.client.findMany({
    where: {
      AND: [
        { password: { not: null } },
        {
          NOT: {
            password: {
              startsWith: "$2", // Exclure les mots de passe déjà hashés
            },
          },
        },
      ],
    },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  console.log(`   Trouvé ${clients.length} client(s) avec mot de passe en clair`);

  for (const client of clients) {
    if (!client.password) continue;
    
    try {
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(client.password, 10);
      
      await prisma.client.update({
        where: { id: client.id },
        data: { password: hashedPassword },
      });

      console.log(`   ✅ Migré: ${client.email}`);
      migratedCount++;
    } catch (error) {
      console.error(`   ❌ Erreur pour ${client.email}:`, error);
      errorCount++;
    }
  }

  // Migrer les mots de passe des admins
  console.log("\n📋 Migration des admins...");
  const admins = await prisma.admin.findMany({
    where: {
      password: {
        not: {
          startsWith: "$2", // Exclure les mots de passe déjà hashés
        },
      },
    },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  console.log(`   Trouvé ${admins.length} admin(s) avec mot de passe en clair`);

  for (const admin of admins) {
    try {
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      
      await prisma.admin.update({
        where: { id: admin.id },
        data: { password: hashedPassword },
      });

      console.log(`   ✅ Migré: ${admin.email}`);
      migratedCount++;
    } catch (error) {
      console.error(`   ❌ Erreur pour ${admin.email}:`, error);
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Migration terminée:`);
  console.log(`   - ${migratedCount} mot(s) de passe migré(s)`);
  if (errorCount > 0) {
    console.log(`   - ${errorCount} erreur(s)`);
  }
  console.log("=".repeat(50));

  await prisma.$disconnect();
}

// Exécuter la migration
migratePasswords()
  .catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });

