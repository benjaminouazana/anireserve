import Link from "next/link";

export default function QuiSommesNousPage() {
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
            Qui sommes-nous ?
          </h1>
          <p className="text-lg text-zinc-600 font-medium">
            La plateforme de réservation en Israël pour les Français
          </p>
        </div>

        {/* Contenu principal */}
        <div className="space-y-8">
          {/* Section 1: Notre mission */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-purple-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🎯 Notre mission
            </h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              <strong>Ani reserve</strong> est née d'un constat simple : les Français installés en Israël ou de passage ont besoin de trouver facilement des professionnels de confiance qui parlent leur langue et comprennent leurs besoins.
            </p>
            <p className="text-zinc-700 leading-relaxed">
              Notre mission est de créer un pont entre les professionnels qualifiés et la communauté francophone en Israël, en facilitant la prise de rendez-vous et en garantissant une expérience fluide et sécurisée pour tous.
            </p>
          </section>

          {/* Section 2: Comment ça marche */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-pink-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              ⚙️ Comment ça marche ?
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  Pour les clients 👥
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-zinc-700">
                  <li><strong>Recherche :</strong> Utilisez notre moteur de recherche pour trouver un professionnel par ville et par type de service</li>
                  <li><strong>Sélection :</strong> Consultez les profils, les avis et les créneaux disponibles</li>
                  <li><strong>Réservation :</strong> Choisissez un créneau et remplissez le formulaire de réservation</li>
                  <li><strong>Confirmation :</strong> Le professionnel valide votre demande et vous recevez une confirmation par email</li>
                  <li><strong>Rendez-vous :</strong> Vous vous rendez au rendez-vous et le paiement se fait sur place</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  Pour les professionnels 💼
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-zinc-700">
                  <li><strong>Inscription :</strong> Créez votre profil en remplissant le formulaire d'inscription avec vos informations et votre Teoudate Zeoute</li>
                  <li><strong>Vérification :</strong> Notre équipe vérifie votre profil sous 24-48h</li>
                  <li><strong>Activation :</strong> Une fois validé, votre profil est visible et vous pouvez recevoir des réservations</li>
                  <li><strong>Gestion :</strong> Gérez vos réservations depuis votre espace professionnel : validez ou refusez les demandes</li>
                  <li><strong>Croissance :</strong> Recevez des avis clients et développez votre activité</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Section 3: Nos valeurs */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-blue-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              ✨ Nos valeurs
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-200/50">
                <h3 className="font-semibold text-zinc-900 mb-2">🤝 Confiance</h3>
                <p className="text-sm text-zinc-700">
                  Tous nos professionnels sont vérifiés et leurs documents sont validés par notre équipe.
                </p>
              </div>
              <div className="bg-gradient-to-r from-pink-100 to-blue-100 rounded-xl p-4 border-2 border-pink-200/50">
                <h3 className="font-semibold text-zinc-900 mb-2">🌍 Communauté</h3>
                <p className="text-sm text-zinc-700">
                  Une plateforme dédiée à la communauté francophone en Israël, par des Français, pour des Français.
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4 border-2 border-blue-200/50">
                <h3 className="font-semibold text-zinc-900 mb-2">⚡ Simplicité</h3>
                <p className="text-sm text-zinc-700">
                  Une interface intuitive et un processus de réservation en quelques clics seulement.
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-emerald-100 rounded-xl p-4 border-2 border-emerald-200/50">
                <h3 className="font-semibold text-zinc-900 mb-2">💬 Transparence</h3>
                <p className="text-sm text-zinc-700">
                  Système d'avis et de notes pour garantir la qualité des services proposés.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Services proposés */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-emerald-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              🛠️ Services proposés
            </h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              Notre plateforme couvre une large gamme de services pour répondre à tous vos besoins :
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Coiffeur / Coiffeuse",
                "Esthéticienne",
                "Coach sportif",
                "Avocat",
                "Comptable",
                "Médecin",
                "Psychologue",
                "Dentiste",
                "Kinésithérapeute",
                "Architecte",
                "Designer",
                "Et bien plus encore..."
              ].map((service) => (
                <div
                  key={service}
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 border border-emerald-200/50"
                >
                  {service}
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Sécurité et paiement */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-amber-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              🔒 Sécurité et paiement
            </h2>
            <div className="space-y-4 text-zinc-700">
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">Vérification des professionnels</h3>
                <p className="text-sm leading-relaxed">
                  Chaque professionnel doit fournir sa Teoudate Zeoute (carte d'identité israélienne) lors de l'inscription. Notre équipe vérifie tous les documents avant d'activer un profil.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">Paiement sur place</h3>
                <p className="text-sm leading-relaxed">
                  Le paiement se fait directement entre vous et le professionnel, sur place, au moment de la prestation. Aucun paiement en ligne n'est requis, ce qui garantit votre sécurité financière.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">Protection des données</h3>
                <p className="text-sm leading-relaxed">
                  Vos données personnelles sont protégées et ne sont jamais partagées avec des tiers. Nous respectons strictement la réglementation sur la protection des données.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Contact */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-purple-200/50 animate-fade-in text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              📧 Une question ?
            </h2>
            <p className="text-zinc-700 mb-6">
              Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question ou suggestion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all animate-gradient"
              >
                Nous contacter
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full glass border-2 border-purple-200/50 px-6 py-3 text-sm font-semibold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
              >
                Retour à l'accueil
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}












