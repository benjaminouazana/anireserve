import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const professional = await prisma.professional.findUnique({
    where: { slug },
    select: {
      name: true,
      serviceType: true,
      city: true,
      description: true,
      profileImage: true,
    },
  });

  if (!professional) {
    return {
      title: "Professionnel introuvable",
    };
  }

  const title = `${professional.name} - ${professional.serviceType} à ${professional.city} | AniReserve`;
  const description = professional.description || 
    `Réservez un rendez-vous avec ${professional.name}, ${professional.serviceType} à ${professional.city}. Disponible sur AniReserve.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: professional.profileImage ? [professional.profileImage] : [],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}




