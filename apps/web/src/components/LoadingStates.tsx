/**
 * Loading States & Skeletons
 * Améliorations UX pendant les chargements
 */

export function ProfessionalCardSkeleton() {
    return (
        <div className="glass rounded-2xl p-6 animate-pulse">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gray-200" />

                <div className="flex-1 space-y-3">
                    {/* Nom */}
                    <div className="h-6 bg-gray-200 rounded w-3/4" />

                    {/* Ville */}
                    <div className="h-4 bg-gray-200 rounded w-1/2" />

                    {/* Rating */}
                    <div className="h-4 bg-gray-200 rounded w-1/3" />

                    {/* Description */}
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-5/6" />
                    </div>
                </div>
            </div>

            {/* Bouton */}
            <div className="mt-4 h-10 bg-gray-200 rounded-lg" />
        </div>
    );
}

export function SearchFormSkeleton() {
    return (
        <div className="glass rounded-2xl p-6 animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="h-12 bg-primary/20 rounded-lg" />
        </div>
    );
}

export function BookingFormSkeleton() {
    return (
        <div className="glass rounded-2xl p-6 animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
            </div>
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-primary/20 rounded-lg" />
        </div>
    );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary rounded-full animate-spin`} />
    );
}

export function LoadingOverlay({ message = 'Chargement...' }: { message?: string }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4">
                <Spinner size="lg" />
                <p className="text-lg font-medium">{message}</p>
            </div>
        </div>
    );
}

// Hook pour gérer les états de chargement
export function useLoading() {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const withLoading = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
        setLoading(true);
        setError(null);
        try {
            const result = await fn();
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, withLoading, setError };
}
