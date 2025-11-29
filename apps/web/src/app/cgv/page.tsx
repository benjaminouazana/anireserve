import Link from "next/link";

export default function CGVPage() {
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
            📜 Conditions Générales de Vente
          </h1>
          <p className="text-sm text-zinc-500">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Contenu */}
        <div className="space-y-8">
          {/* Article 1 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-purple-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Article 1 - Objet
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation de la plateforme <strong>Ani reserve</strong>, 
              une plateforme de mise en relation entre des clients et des professionnels pour la réservation de services en Israël.
            </p>
            <p className="text-zinc-700 leading-relaxed mt-4">
              La plateforme <strong>Ani reserve</strong> agit en tant qu'intermédiaire technique et ne fournit pas directement les services 
              réservés. Les services sont fournis directement par les professionnels indépendants.
            </p>
          </section>

          {/* Article 2 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-pink-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Article 2 - Acceptation des CGV
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              L'utilisation de la plateforme <strong>Ani reserve</strong> implique l'acceptation pleine et entière des présentes CGV. 
              En créant un compte ou en utilisant la plateforme, vous reconnaissez avoir lu, compris et accepté ces conditions.
            </p>
            <p className="text-zinc-700 leading-relaxed mt-4">
              Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser la plateforme.
            </p>
          </section>

          {/* Article 3 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-blue-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Article 3 - Inscription et compte utilisateur
            </h2>
            <div className="space-y-4 text-zinc-700">
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">3.1 - Compte client</h3>
                <p className="leading-relaxed">
                  Pour réserver un service, vous devez créer un compte en fournissant des informations exactes et à jour. 
                  Vous êtes responsable de la confidentialité de vos identifiants de connexion.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">3.2 - Compte professionnel</h3>
                <p className="leading-relaxed">
                  Les professionnels doivent fournir leur Teoudate Zeoute (carte d'identité israélienne) et accepter la vérification 
                  de leur profil par notre équipe. Le profil professionnel n'est activé qu'après validation.
                </p>
              </div>
            </div>
          </section>

          {/* Article 4 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-emerald-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Article 4 - Réservation et paiement
            </h2>
            <div className="space-y-4 text-zinc-700">
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">4.1 - Processus de réservation</h3>
                <p className="leading-relaxed">
                  La réservation d'un service se fait en ligne via la plateforme. Le professionnel reçoit une notification 
                  et doit valider la demande. Une fois validée, la réservation est confirmée et un email de confirmation est envoyé.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">4.2 - Paiement</h3>
                <p className="leading-relaxed">
                  <strong>Le paiement se fait directement sur place, au moment de la prestation, entre le client et le professionnel.</strong> 
                  Aucun paiement en ligne n'est requis via la plateforme. La plateforme <strong>Ani reserve</strong> n'intervient pas 
                  dans le processus de paiement.
                </p>
              </div>
            </div>
          </section>

          {/* Article 5 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-amber-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Article 5 - Annulation et remboursement
            </h2>
            <div className="space-y-4 text-zinc-700">
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">5.1 - Annulation par le client</h3>
                <p className="leading-relaxed">
                  Le client peut annuler une réservation à tout moment, <strong>sauf dans les 24 heures précédant le service</strong>. 
                  Les annulations dans les 24 heures précédant le service ne sont pas autorisées.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">5.2 - Annulation par le professionnel</h3>
                <p className="leading-relaxed">
                  Le professionnel peut annuler une réservation à tout moment. Le client sera notifié par email et pourra 
                  rechercher un autre créneau disponible.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">5.3 - Remboursement</h3>
                <p className="leading-relaxed">
                  Étant donné que le paiement se fait directement sur place, tout remboursement doit être géré directement 
                  entre le client et le professionnel selon leurs propres conditions.
                </p>
              </div>
            </div>
          </section>

          {/* Article 6 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-red-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Article 6 - Responsabilité
            </h2>
            <div className="space-y-4 text-zinc-700">
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">6.1 - Responsabilité de la plateforme</h3>
                <p className="leading-relaxed">
                  <strong>Ani reserve</strong> agit uniquement en tant qu'intermédiaire technique. La plateforme ne peut être tenue 
                  responsable de la qualité des services fournis par les professionnels, des retards, des annulations, ou de tout 
                  dommage résultant de l'utilisation des services réservés.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">6.2 - Responsabilité des professionnels</h3>
                <p className="leading-relaxed">
                  Les professionnels sont seuls responsables de la qualité et de l'exécution des services qu'ils fournissent. 
                  Ils doivent respecter toutes les réglementations en vigueur et posséder les qualifications nécessaires.
                </p>
              </div>
            </div>
          </section>

          {/* Article 7 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-indigo-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Article 7 - Avis et évaluations
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              Les clients peuvent laisser des avis et des notes sur les professionnels après chaque rendez-vous. Les avis doivent 
              être objectifs et respectueux. <strong>Ani reserve</strong> se réserve le droit de modérer ou supprimer tout avis 
              inapproprié, diffamatoire ou contraire aux valeurs de la plateforme.
            </p>
          </section>

          {/* Article 8 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-purple-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Article 8 - Protection des données
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              La collecte et le traitement de vos données personnelles sont régis par notre <Link href="/confidentialite" className="text-purple-600 hover:text-purple-700 underline">Politique de Confidentialité</Link>. 
              En utilisant la plateforme, vous acceptez le traitement de vos données conformément à cette politique.
            </p>
          </section>

          {/* Article 9 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-pink-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Article 9 - Propriété intellectuelle
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              Tous les éléments de la plateforme <strong>Ani reserve</strong> (textes, images, logos, design) sont protégés par le droit 
              de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>
          </section>

          {/* Article 10 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-blue-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Article 10 - Modification des CGV
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              <strong>Ani reserve</strong> se réserve le droit de modifier les présentes CGV à tout moment. Les utilisateurs seront 
              informés des modifications par email ou via une notification sur la plateforme. L'utilisation continue de la plateforme 
              après modification implique l'acceptation des nouvelles conditions.
            </p>
          </section>

          {/* Article 11 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-emerald-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Article 11 - Droit applicable et juridiction
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              Les présentes CGV sont régies par le droit israélien. En cas de litige, et à défaut d'accord amiable, les tribunaux 
              israéliens seront seuls compétents.
            </p>
          </section>

          {/* Article 12 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-amber-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Article 12 - Contact
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              Pour toute question concernant les présentes CGV, vous pouvez nous contacter à l'adresse suivante : 
              <a href="mailto:contact@anireserve.com" className="text-purple-600 hover:text-purple-700 underline ml-1">
                contact@anireserve.com
              </a>
            </p>
          </section>
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

