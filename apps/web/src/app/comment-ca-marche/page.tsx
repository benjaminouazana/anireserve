import Link from "next/link";

export default function CommentCaMarchePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 mb-6 transition"
          >
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            ⚙️ Comment ça marche ?
          </h1>
          <p className="text-lg text-zinc-600 font-medium">
            Découvrez comment utiliser Ani reserve en quelques étapes simples
          </p>
        </div>

        {/* Pour les clients */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              👥 Pour les clients
            </h2>
            <p className="text-zinc-600">
              Réservez un rendez-vous en quelques clics
            </p>
          </div>

          <div className="space-y-6">
            {/* Étape 1 */}
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    🔍 Recherchez un professionnel
                  </h3>
                  <p className="text-zinc-700 leading-relaxed">
                    Utilisez notre moteur de recherche sur la page d'accueil. Filtrez par <strong>ville</strong> et par <strong>type de service</strong> 
                    (coiffeur, esthéticienne, coach sportif, etc.). Vous pouvez aussi parcourir tous les professionnels disponibles.
                  </p>
                  <Link
                    href="/professionals"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold mt-2 transition"
                  >
                    Voir tous les professionnels →
                  </Link>
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-pink-200/50 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    📋 Consultez le profil
                  </h3>
                  <p className="text-zinc-700 leading-relaxed">
                    Cliquez sur un professionnel pour voir son profil détaillé : ses services, ses disponibilités, ses avis clients, 
                    sa note moyenne, et toutes les informations importantes. Tous nos professionnels sont vérifiés.
                  </p>
                </div>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-blue-200/50 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    📅 Choisissez un créneau
                  </h3>
                  <p className="text-zinc-700 leading-relaxed">
                    Consultez le calendrier du professionnel et sélectionnez un créneau disponible qui vous convient. 
                    Les créneaux déjà réservés sont automatiquement masqués.
                  </p>
                </div>
              </div>
            </div>

            {/* Étape 4 */}
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-emerald-200/50 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    ✍️ Remplissez le formulaire
                  </h3>
                  <p className="text-zinc-700 leading-relaxed">
                    Remplissez le formulaire de réservation avec vos informations (nom, email, téléphone) et confirmez votre demande. 
                    Vous pouvez créer un compte pour faciliter vos prochaines réservations, mais ce n'est pas obligatoire.
                  </p>
                  <Link
                    href="/client/register"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold mt-2 transition"
                  >
                    Créer un compte client →
                  </Link>
                </div>
              </div>
            </div>

            {/* Étape 5 */}
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-amber-200/50 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    ✅ Confirmation et rendez-vous
                  </h3>
                  <p className="text-zinc-700 leading-relaxed">
                    Le professionnel reçoit votre demande et la valide. Vous recevez une <strong>confirmation par email</strong> avec tous les détails. 
                    Le jour du rendez-vous, vous vous présentez chez le professionnel et le <strong>paiement se fait sur place</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pour les professionnels */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              💼 Pour les professionnels
            </h2>
            <p className="text-zinc-600">
              Rejoignez notre plateforme et développez votre activité
            </p>
          </div>

          <div className="space-y-6">
            {/* Étape 1 */}
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    📝 Inscription
                  </h3>
                  <p className="text-zinc-700 leading-relaxed">
                    Remplissez le formulaire d'inscription avec vos informations : nom, prénom, email, téléphone, villes où vous travaillez, 
                    services proposés, et uploadez votre <strong>Teoudate Zeoute</strong> (carte d'identité israélienne) pour vérification.
                  </p>
                  <Link
                    href="/pro/register"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold mt-2 transition"
                  >
                    S'inscrire comme professionnel →
                  </Link>
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-pink-200/50 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    ⏳ Vérification
                  </h3>
                  <p className="text-zinc-700 leading-relaxed">
                    Notre équipe vérifie votre profil et vos documents sous <strong>24 à 48 heures</strong>. 
                    Vous recevrez un email une fois votre profil validé ou si des informations supplémentaires sont nécessaires.
                  </p>
                </div>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-blue-200/50 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    ⚙️ Configuration
                  </h3>
                  <p className="text-zinc-700 leading-relaxed">
                    Une fois validé, connectez-vous à votre espace professionnel et configurez vos disponibilités : 
                    heures d'ouverture, jours de fermeture, pauses, durée des créneaux. Vous pouvez aussi personnaliser votre profil.
                  </p>
                </div>
              </div>
            </div>

            {/* Étape 4 */}
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-emerald-200/50 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    📥 Recevez des réservations
                  </h3>
                  <p className="text-zinc-700 leading-relaxed">
                    Les clients peuvent maintenant vous trouver et réserver des créneaux. Vous recevez une notification pour chaque nouvelle demande. 
                    Validez ou refusez les réservations depuis votre tableau de bord.
                  </p>
                </div>
              </div>
            </div>

            {/* Étape 5 */}
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-amber-200/50 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    ⭐ Développez votre réputation
                  </h3>
                  <p className="text-zinc-700 leading-relaxed">
                    Après chaque rendez-vous, les clients peuvent laisser un avis et une note. 
                    Les bons avis améliorent votre visibilité et attirent de nouveaux clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA */}
        <div className="mt-12 rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-purple-200/50 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-zinc-700 mb-6">
            Rejoignez la communauté francophone d'Israël et simplifiez vos réservations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/professionals"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all"
            >
              Trouver un professionnel
            </Link>
            <Link
              href="/pro/register"
              className="inline-flex items-center justify-center rounded-full glass border-2 border-purple-200/50 px-6 py-3 text-sm font-semibold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
            >
              Devenir professionnel
            </Link>
          </div>
        </div>

        {/* Footer de la page */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full glass border-2 border-purple-200/50 px-6 py-3 text-sm font-semibold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}











