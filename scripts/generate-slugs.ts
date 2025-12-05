/**
 * Script de migration pour générer les slugs manquants
 * Pour les professionnels existants qui n'ont pas de slug
 */

import { PrismaClient } from "@prisma/client";
import { generateUniqueSlugFromDB } from "../apps/web/src/lib/slug.js";


const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Démarrage de la migration des slugs...\n");

    // Trouver tous les professionnels sans slug
    const professionalsWithoutSlug = await prisma.professional.findMany({
        where: {
            OR: [
                { slug: null },
                { slug: "" }
            ]
        },
        select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            slug: true
        }
    });

    console.log(`📊 Trouvé ${professionalsWithoutSlug.length} professionnels sans slug\n`);

    if (professionalsWithoutSlug.length === 0) {
        console.log("✅ Tous les professionnels ont déjà un slug!");
        return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const pro of professionalsWithoutSlug) {
        try {
            // Utiliser le nom existant ou construire à partir de firstName/lastName
            const name = pro.name || `${pro.firstName || ""} ${pro.lastName || ""}`.trim();

            if (!name) {
                console.log(`⚠️  ID ${pro.id}: Pas de nom disponible, utilisation de l'ID`);
                const slug = `professional-${pro.id}`;
                await prisma.professional.update({
                    where: { id: pro.id },
                    data: { slug }
                });
                console.log(`   → Slug créé: ${slug}`);
                successCount++;
                continue;
            }

            // Générer un slug unique
            const slug = await generateUniqueSlugFromDB(name, pro.id);

            // Mettre à jour le professionnel
            await prisma.professional.update({
                where: { id: pro.id },
                data: { slug }
            });

            console.log(`✅ ID ${pro.id} (${name}): ${slug}`);
            successCount++;

        } catch (error) {
            console.error(`❌ Erreur pour ID ${pro.id}:`, error);
            errorCount++;
        }
    }

    console.log(`\n📊 Résultats de la migration:`);
    console.log(`   ✅ Succès: ${successCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    console.log(`\n🎉 Migration terminée!`);
}

main()
    .catch((error) => {
        console.error("❌ Erreur fatale:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
