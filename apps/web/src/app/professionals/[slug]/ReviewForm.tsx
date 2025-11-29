"use client";

import { useState } from "react";

function StarIcon({ 
  filled, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  filled: boolean; 
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`h-6 w-6 transition ${
        filled ? "text-amber-400" : "text-zinc-300 hover:text-amber-200"
      }`}
    >
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </button>
  );
}

export function ReviewForm({
  bookingId,
  professionalId,
  onSuccess,
  onCancel,
}: {
  bookingId: number;
  professionalId: number;
  onSuccess: (review: any) => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (rating === 0) {
      setError("Sélectionne une note");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          rating,
          comment: comment.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la création de l'avis");
      }

      const data = await response.json();
      onSuccess(data.review);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de l'avis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <h3 className="mb-4 text-sm font-semibold text-zinc-900">
        Laisser un avis
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Note *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                filled={star <= (hoveredRating || rating)}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              />
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="comment"
            className="mb-2 block text-sm font-medium text-zinc-700"
          >
            Commentaire (optionnel)
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            placeholder="Partage ton expérience..."
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || rating === 0}
            className="flex-1 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Envoi..." : "Publier l'avis"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

