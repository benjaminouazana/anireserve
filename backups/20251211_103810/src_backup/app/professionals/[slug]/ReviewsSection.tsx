"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ReviewForm } from "./ReviewForm";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-5 w-5 ${filled ? "text-amber-400" : "text-zinc-300"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

type Review = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: Date | string;
  client: {
    name: string;
  };
};

export function ReviewsSection({
  professionalId,
  reviews: initialReviews,
  averageRating,
}: {
  professionalId: number;
  reviews: Review[];
  averageRating: number;
}) {
  const searchParams = useSearchParams();
  const reviewBookingId = searchParams?.get("review") || null;
  
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(!!reviewBookingId);
  const [bookingId, setBookingId] = useState<number | null>(
    reviewBookingId ? parseInt(reviewBookingId) : null
  );
  const [canReview, setCanReview] = useState<{
    canReview: boolean;
    reason: string | null;
    bookingId: number | null;
  } | null>(null);
  const [loadingCanReview, setLoadingCanReview] = useState(true);

  useEffect(() => {
    async function checkCanReview() {
      setLoadingCanReview(true);
      try {
        const res = await fetch(`/api/reviews/can-review?professionalId=${professionalId}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setCanReview(data);
          // Si on peut laisser un avis et qu'on a un bookingId depuis l'URL, l'utiliser
          if (data.canReview && data.bookingId && reviewBookingId) {
            setBookingId(data.bookingId);
            setShowReviewForm(true);
          }
        }
      } catch (error) {
        console.error("Erreur vérification avis:", error);
      } finally {
        setLoadingCanReview(false);
      }
    }
    checkCanReview();
  }, [professionalId, reviewBookingId]);

  function formatDate(date: Date | string) {
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function handleReviewAdded(newReview: any) {
    // Convertir le Review de l'API en Review local avec client
    const localReview: Review = {
      id: newReview.id,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: newReview.createdAt,
      client: {
        name: newReview.client?.name || "Client anonyme",
      },
    };
    setReviews([localReview, ...reviews]);
    setShowReviewForm(false);
    setCanReview({ canReview: false, reason: "already_reviewed", bookingId: null });
  }

  function handleLeaveReviewClick() {
    if (canReview?.canReview && canReview.bookingId) {
      setBookingId(canReview.bookingId);
      setShowReviewForm(true);
    }
  }

  return (
    <div className="border-b border-zinc-200 bg-white px-4 py-6 sm:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Avis clients</h2>
          {reviews.length > 0 && (
            <p className="mt-1 text-sm text-zinc-500">
              {reviews.length} avis{reviews.length > 1 ? "s" : ""} · Note moyenne :{" "}
              {Math.round(averageRating * 10) / 10}/5
            </p>
          )}
        </div>
        {!loadingCanReview && canReview?.canReview && !showReviewForm && (
          <button
            onClick={handleLeaveReviewClick}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
          >
            ⭐ Laisser un avis
          </button>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-8 text-center">
          <p className="text-sm text-zinc-500">
            Aucun avis pour le moment. Sois le premier à laisser un avis !
          </p>
          {!loadingCanReview && canReview?.canReview && !showReviewForm && (
            <button
              onClick={handleLeaveReviewClick}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              ⭐ Laisser un avis
            </button>
          )}
          {!loadingCanReview && canReview && !canReview.canReview && canReview.reason === "not_logged_in" && (
            <p className="mt-4 text-xs text-zinc-400">
              Connecte-toi pour laisser un avis après une réservation confirmée
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-zinc-100 pb-6 last:border-0">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-medium text-zinc-900">{review.client.name}</p>
                  <p className="text-xs text-zinc-500">{formatDate(review.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} filled={star <= review.rating} />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm leading-relaxed text-zinc-700">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {showReviewForm && bookingId && (
        <ReviewForm
          bookingId={bookingId}
          professionalId={professionalId}
          onSuccess={handleReviewAdded}
          onCancel={() => {
            setShowReviewForm(false);
            setBookingId(null);
          }}
        />
      )}
    </div>
  );
}

