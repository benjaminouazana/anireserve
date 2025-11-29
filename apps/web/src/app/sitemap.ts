import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/client/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/client/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pro/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pro/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/professionals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qui-sommes-nous`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/comment-ca-marche`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  try {
    // Pages dynamiques des professionnels
    const professionals = await prisma.professional.findMany({
      where: {
        status: "approved",
      },
      select: {
        id: true,
        slug: true,
        name: true,
        createdAt: true,
      },
      take: 1000, // Limiter pour éviter les problèmes de performance
    });

    const professionalPages: MetadataRoute.Sitemap = professionals.map((pro) => {
      // Utiliser le slug s'il existe, sinon générer à partir du nom, sinon utiliser l'ID
      const slug = pro.slug || (pro.name ? pro.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : pro.id.toString());
      return {
        url: `${baseUrl}/professionals/${slug}`,
        lastModified: pro.createdAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      };
    });

    return [...staticPages, ...professionalPages];
  } catch (error) {
    console.error("Erreur génération sitemap:", error);
    return staticPages;
  }
}

