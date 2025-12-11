import Image from "next/image";
import type { Professional } from "@/types/professional";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${filled ? "text-amber-400" : "text-zinc-300"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export function ProfileHeader({
  professional,
  averageRating,
  totalReviews,
  cities,
}: {
  professional: Professional;
  averageRating: number;
  totalReviews: number;
  cities: string[];
}) {
  const roundedRating = Math.round(averageRating * 10) / 10;

  return (
    <div className="border-b border-zinc-200 bg-white px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Image de profil */}
        <div className="flex-shrink-0">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-zinc-200 sm:h-32 sm:w-32 relative">
            {professional.profileImage ? (
              <Image
                src={professional.profileImage}
                alt={professional.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 96px, 128px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-400">
                {professional.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Informations */}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            {professional.name}
          </h1>
          <p className="mt-1 text-base text-zinc-600 sm:text-lg">
            {professional.serviceType}
          </p>

          {/* Note moyenne */}
          {totalReviews > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} filled={star <= Math.round(averageRating)} />
                ))}
              </div>
              <span className="text-sm font-medium text-zinc-700">
                {roundedRating}
              </span>
              <span className="text-sm text-zinc-500">
                ({totalReviews} avis{totalReviews > 1 ? "s" : ""})
              </span>
            </div>
          )}

          {/* Villes */}
          <div className="mt-3 flex flex-wrap gap-2">
            {cities.map((city) => (
              <span
                key={city}
                className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
              >
                📍 {city}
              </span>
            ))}
          </div>

          {/* Badges */}
          {professional.verified && (
            <div className="mt-3">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                ✓ Vérifié
              </span>
            </div>
          )}
          {professional.badge && (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                ⭐ {professional.badge}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

