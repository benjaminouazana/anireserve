/**
 * Système d'avis complet avec étoiles
 * Component pour afficher et soumettre des avis
 */

'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface Review {
    id: number;
    rating: number;
    comment: string;
    clientName: string;
    date: string;
}

interface ReviewSystemProps {
    professionalId: number;
    professionalSlug: string;
    existingReviews?: Review[];
    canReview?: boolean;
    bookingId?: number;
}

export function ReviewSystem({
    professionalId,
    professionalSlug,
    existingReviews = [],
    canReview = false,
    bookingId,
}: ReviewSystemProps) {
    const [reviews, setReviews] = useState<Review[]>(existingReviews);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating || !bookingId) return;

        setLoading(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    professionalId,
                    bookingId,
                    rating,
                    comment,
                }),
            });

            if (res.ok) {
                const newReview = await res.json();
                setReviews([newReview, ...reviews]);
                setRating(0);
                setComment('');
                setShowForm(false);
            }
        } catch (error) {
            console.error('Erreur soumission avis:', error);
        } finally {
            setLoading(false);
        }
    };

    const avgRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return (
        <div className="space-y-6">
            {/* Moyenne des avis */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-primary">
                            {avgRating.toFixed(1)}
                        </div>
                        <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.round(avgRating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            {reviews.length} avis
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulaire d'avis */}
            {canReview && (
                <div className="glass rounded-2xl p-6">
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn-primary w-full"
                        >
                            Laisser un avis
                        </button>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Votre note
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= (hoverRating || rating)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Votre commentaire (optionnel)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="input min-h-[100px]"
                                    placeholder="Partagez votre expérience..."
                                    maxLength={500}
                                />
                                <div className="text-xs text-muted-foreground mt-1">
                                    {comment.length}/500 caractères
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={!rating || loading}
                                    className="btn-primary flex-1"
                                >
                                    {loading ? 'Envoi...' : 'Publier mon avis'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setRating(0);
                                        setComment('');
                                    }}
                                    className="btn-secondary"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Liste des avis */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Avis clients</h3>
                {reviews.length === 0 ? (
                    <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
                        Aucun avis pour le moment
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="glass rounded-2xl p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="font-semibold">{review.clientName}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(review.date).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-muted-foreground">{review.comment}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
