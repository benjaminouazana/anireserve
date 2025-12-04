"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-4">
      <div className="rounded-3xl glass p-8 shadow-2xl border-2 border-red-200/50 max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Erreur</h2>
        <p className="text-zinc-700 mb-6">{error?.message || "Une erreur est survenue"}</p>
        <button
          onClick={reset}
          className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-bold text-white shadow-lg hover-lift hover:shadow-xl transition-all"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}








