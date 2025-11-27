import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ReviewsSection } from "./ReviewsSection";
import { ProfileHeader } from "./ProfileHeader";
import { CalendarView } from "./CalendarView";

export default async function ProfessionalProfilePage({
  params,
}: {
  params: { id: string };
}) {
  // Récupérer le professionnel et ses avis séparément pour éviter les problèmes de cache
  const professional = await prisma.professional.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!professional) {
    notFound();
  }

  // Récupérer les avis séparément
  const reviews = await prisma.review.findMany({
    where: {
      professionalId: professional.id,
    },
    include: {
      client: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const cities = professional.cities
    ? professional.cities.split(",").map((c) => c.trim())
    : [professional.city];

  const gallery = professional.gallery
    ? professional.gallery.split(",").map((url) => url.trim()).filter(Boolean)
    : [];

  // Calculer la moyenne des notes
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <div className="mx-auto max-w-4xl">
        {/* Header avec image de profil */}
        <ProfileHeader
          professional={professional}
          averageRating={averageRating}
          totalReviews={reviews.length}
          cities={cities}
        />

        {/* Bio */}
        {professional.bio && (
          <div className="border-b border-zinc-200 bg-white px-4 py-6 sm:px-8">
            <p className="text-sm leading-relaxed text-zinc-700">
              {professional.bio}
            </p>
          </div>
        )}

        {/* Description si pas de bio */}
        {!professional.bio && professional.description && (
          <div className="border-b border-zinc-200 bg-white px-4 py-6 sm:px-8">
            <p className="text-sm leading-relaxed text-zinc-700">
              {professional.description}
            </p>
          </div>
        )}

        {/* Galerie de photos */}
        {gallery.length > 0 && (
          <div className="border-b border-zinc-200 bg-white px-4 py-6 sm:px-8">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900">
              Galerie
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {gallery.map((url, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg bg-zinc-100"
                >
                  <img
                    src={url}
                    alt={`Photo ${index + 1} de ${professional.name}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informations de contact */}
        <div className="border-b border-zinc-200 bg-white px-4 py-6 sm:px-8">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Informations
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-zinc-700">Villes :</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {cities.map((city) => (
                  <span
                    key={city}
                    className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {professional.phone && (
              <div>
                <span className="font-medium text-zinc-700">Téléphone :</span>
                <a
                  href={`tel:${professional.phone}`}
                  className="ml-2 text-zinc-600 hover:text-zinc-900 transition"
                >
                  {professional.phone}
                </a>
              </div>
            )}

            <div>
              <span className="font-medium text-zinc-700">Service :</span>
              <p className="text-zinc-600">{professional.serviceType}</p>
            </div>
          </div>
        </div>

        {/* Calendrier interactif */}
        <div className="border-b border-zinc-200 bg-white px-4 py-6 sm:px-8">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Calendrier et disponibilités
          </h2>
          <CalendarView professionalId={professional.id} />
        </div>

        {/* Section des avis */}
        <ReviewsSection
          professionalId={professional.id}
          reviews={reviews}
          averageRating={averageRating}
        />

        {/* Bouton de réservation */}
        <div className="sticky bottom-0 border-t border-zinc-200 bg-white px-4 py-4 sm:px-8">
          <Link
            href={`/?proId=${professional.id}`}
            className="flex w-full items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
          >
            Réserver un rendez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}
