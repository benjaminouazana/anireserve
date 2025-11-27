"use client";

import Link from "next/link";

export default function VerificationPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl glass p-8 shadow-2xl border-2 border-purple-200/50 text-center animate-fade-in">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-4">
              <span className="text-4xl">⏳</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Profil en cours de vérification
            </h1>
            <p className="text-sm text-zinc-600 font-medium">
              Ta demande d'inscription a été soumise avec succès !
            </p>
          </div>

          <div className="space-y-4 text-left bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200/50">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📋</span>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">
                  Prochaines étapes
                </h3>
                <p className="text-sm text-zinc-600">
                  Notre équipe va examiner ton profil et vérifier les informations que tu as fournies, notamment ta Teoudate Zeoute.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">
                  Délai de vérification
                </h3>
                <p className="text-sm text-zinc-600">
                  La vérification prend généralement entre 24 et 48 heures. Tu recevras un email dès que ton profil sera validé.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">
                  Une fois validé
                </h3>
                <p className="text-sm text-zinc-600">
                  Tu pourras te connecter à ton espace professionnel et commencer à recevoir des réservations !
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/pro/login"
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all animate-gradient"
            >
              Retour à la connexion
            </Link>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-full glass border-2 border-purple-200/50 px-6 py-3 text-sm font-semibold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

