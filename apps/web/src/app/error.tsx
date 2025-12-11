"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur pour le debugging
    console.error("Erreur application:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full rounded-2xl bg-white p-8 shadow-lg border-2 border-red-200">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          ⚠️ Erreur de l'application
        </h2>
        <p className="text-zinc-700 mb-6">
          Une erreur s'est produite. Veuillez réessayer.
        </p>
        {process.env.NODE_ENV === "development" && (
          <details className="mb-6">
            <summary className="cursor-pointer text-sm text-zinc-500 mb-2">
              Détails de l'erreur (développement)
            </summary>
            <pre className="text-xs bg-zinc-100 p-4 rounded overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700 transition"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="flex-1 rounded-lg bg-zinc-200 px-4 py-2 text-zinc-800 font-semibold hover:bg-zinc-300 transition text-center"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

