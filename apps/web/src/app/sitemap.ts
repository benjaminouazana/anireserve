import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://anireserve.com";

  // Pages statiques publiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/professionals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/comment-ca-marche`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/qui-sommes-nous`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/conditions-generales`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cgv`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/confidentialite`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Pages de professionnels (dynamiques)
  try {
    // Vérifier que Prisma est disponible (pas en build si DATABASE_URL manque)
    if (typeof window === "undefined" && process.env.DATABASE_URL && prisma) {
      const professionals = await prisma.professional.findMany({
        where: {
          status: "approved",
          slug: { not: null },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      }).catch((error) => {
        console.error("Erreur Prisma lors de la génération du sitemap:", error);
        return [];
      });

      const professionalPages: MetadataRoute.Sitemap = professionals.map((pro) => ({
        url: `${baseUrl}/professionals/${pro.slug}`,
        lastModified: pro.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

      return [...staticPages, ...professionalPages];
    }
  } catch (error) {
    console.error("Erreur lors de la génération du sitemap:", error);
  }
  
  // En cas d'erreur ou si Prisma n'est pas disponible, retourner au moins les pages statiques
  return staticPages;
}
