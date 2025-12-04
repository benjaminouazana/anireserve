import Link from "next/link";

export default function ConditionsGeneralesPage() {
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
            📋 Conditions Générales
          </h1>
          <p className="text-sm text-zinc-500">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Contenu */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-purple-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Qu'est-ce qu'ANIRESERVE et comment cela fonctionne ?
            </h2>
            <div className="text-zinc-700 leading-relaxed space-y-4">
              <p>
                <strong>ANI RESERVE</strong> est une plateforme sécurisée qui rassemble des travailleurs proposant des services, titulaires d'un Essek au minimum Patour. Avec ANI RESERVE, le partage est simple, agréable et sûr. Nous vérifions les profils des membres, nous proposons un système de messagerie intelligent qui permet aux ANI RESERVE Pro et utilisateurs de communiquer en toute confiance, et nous offrons une plateforme sécurisée pour la collecte des paiements. Votre sécurité est notre priorité numéro un.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-pink-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Sécurité des clients
            </h2>
            <div className="text-zinc-700 leading-relaxed space-y-4">
              <p>
                Afin d'assurer la sécurité des services, des expériences et des interactions, certains comportements et activités ne sont pas autorisés chez ANI RESERVE.
              </p>
              
              <div className="space-y-3 mt-4">
                <div className="pl-4 border-l-4 border-red-300">
                  <p className="font-semibold text-red-700">Les menaces ou mauvais traitements</p>
                  <p className="text-zinc-600 text-sm mt-1">
                    Les menaces, la violence ou les mauvais traitements envers autrui, y compris les partenaires intimes, les enfants, les animaux et les personnes malades ou handicapées, n'ont pas leur place au sein d'ANI RESERVE.
                  </p>
                </div>

                <div className="pl-4 border-l-4 border-red-300">
                  <p className="font-semibold text-red-700">Les agressions et atteintes sexuelles</p>
                  <p className="text-zinc-600 text-sm mt-1">
                    Les agressions et atteintes sexuelles de quelque nature que ce soit sont interdites. Les contacts non désirés ou non sollicités, les comportements aguicheurs ou sexuels, ou les conversations au sujet des relations personnelles ou des préférences sexuelles ne sont pas acceptables.
                  </p>
                </div>

                <div className="pl-4 border-l-4 border-amber-300">
                  <p className="font-semibold text-amber-700">Les animaux dangereux ou illégaux</p>
                  <p className="text-zinc-600 text-sm mt-1">
                    Les animaux domestiques, de ferme et sauvages qui peuvent présenter un risque pour la sécurité lors d'une réservation doivent être correctement confinés et leur présence doit être divulguée à l'avance à l'ANI RESERVE Pro.
                  </p>
                </div>

                <div className="pl-4 border-l-4 border-amber-300">
                  <p className="font-semibold text-amber-700">Les armes non sécurisées/non déclarées</p>
                  <p className="text-zinc-600 text-sm mt-1">
                    Toute arme légalement détenue doit être déclarée et sécurisée.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-blue-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Nous sommes là pour vous aider
            </h2>
            <div className="text-zinc-700 leading-relaxed">
              <p>
                Si vous ou une autre personne vous sentez menacé ou en danger, veuillez d'abord contacter les forces de l'ordre locales pour obtenir de l'aide.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-purple-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Vos responsabilités en tant qu'utilisateur ANI RESERVE
            </h2>
            <div className="text-zinc-700 leading-relaxed space-y-4">
              <p>
                Vous êtes responsable du lieu, du moment, de la sécurité et de la manière dont vous accueillez les ANI RESERVE Pro. Nous souhaitons donc que vous vous renseigniez sur toutes les informations nécessaires sur la législation et les taxes locales. Si vous avez des questions, n'hésitez pas à contacter vos autorités locales.
              </p>
              <p>
                Nous vous demandons de vous renseigner sur les lois et règlements en vigueur dans votre région et de consulter toutes nos conditions avant d'utiliser ANI RESERVE. Lorsque vous acceptez nos conditions de service et publiez votre profil, vous vous engagez à respecter les lois et réglementations applicables.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg mt-4">
                <p className="font-semibold text-amber-800">
                  ⚠️ Déclaration importante
                </p>
                <p className="text-amber-700 text-sm mt-2">
                  Vous déclarez sur l'honneur respecter les réglementations applicables ainsi que de ne conclure aucun accord entre ANI RESERVE et ANI RESERVE Pro en dehors des heures de service réservées en ligne. Le travail non déclaré est interdit sous peine de lourde amende et d'emprisonnement.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-pink-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Vérification de votre identité
            </h2>
            <div className="text-zinc-700 leading-relaxed space-y-4">
              <p>
                ANI RESERVE veille continuellement à la sécurité de l'ensemble de ses utilisateurs. En fournissant les informations relatives à votre identité, vous contribuez à instaurer la confiance au sein de la plateforme. <strong>Une carte d'identité est obligatoire pour s'inscrire sur ANI RESERVE.</strong>
              </p>
              <p>
                Nous ne partageons jamais votre pièce d'identité avec d'autres utilisateurs ANI RESERVE. Cependant, nous transmettons :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-600">
                <li>Le prénom figurant sur la pièce d'identité</li>
                <li>Votre photo de profil et le nom figurant sur votre profil</li>
                <li>Votre numéro de téléphone figurant sur votre profil</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-blue-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Quels sont les aspects juridiques et règlementaires à prendre en compte avant de s'inscrire sur ANI RESERVE ?
            </h2>
            <div className="text-zinc-700 leading-relaxed space-y-4">
              <p>
                Lorsque vous prenez la décision d'être ANI RESERVE Pro ou utilisateur ANI RESERVE, il est important pour vous de comprendre comment les lois s'appliquent dans votre ville.
              </p>
              <p>
                Les utilisateurs ANI RESERVE sont responsables de régler leurs impôts annuels perçus et de déclarer leurs revenus ANI RESERVE.
              </p>
              <p>
                En acceptant nos Conditions de service et en mettant en ligne son planning, vous vous engagez à respecter vos lois et réglementations locales.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mt-4">
                <p className="font-semibold text-blue-800">
                  📋 Permis de travail
                </p>
                <p className="text-blue-700 text-sm mt-2">
                  Il est obligatoire de disposer d'un permis de travail ou d'avoir la nationalité israélienne pour travailler en Israël, ainsi qu'un Essek au minimum Patour. Contactez votre administration locale pour vérifier si vous en avez besoin et, le cas échéant, pour vous informer sur la façon de l'obtenir.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-purple-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Calendrier et réservations
            </h2>
            <div className="text-zinc-700 leading-relaxed space-y-4">
              <h3 className="text-xl font-semibold text-zinc-800 mt-4">
                Comment gérer mon calendrier ?
              </h3>
              <p>
                Il est possible de modifier à tout moment les heures de travail sur le planning, ou le taux horaire. Pour modifier le tarif et le planning de disponibilité, un tutoriel sera envoyé après la signature du contrat avec ANI RESERVE.
              </p>
              <p>
                Les utilisateurs ANI RESERVE ne verront votre profil dans leurs résultats de recherche que si elle correspond à leur demande suivant votre planning de disponibilités et la ville.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-pink-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Versements et taxes
            </h2>
            <div className="text-zinc-700 leading-relaxed space-y-4">
              <p>
                Sur notre plateforme, tous les paiements sont effectués en dehors de celle-ci. Nous ne sommes pas responsables des éventuels problèmes survenant lors des transactions, y compris les différends liés aux paiements. Il est impératif que le prix et le mode de paiement soient renseignés avant la confirmation du service.
              </p>
              <p>
                Nous vous encourageons vivement à régler tous les détails financiers avec votre prestataire de services directement et à clarifier les termes et conditions de paiement avant de réserver un service.
              </p>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mt-4">
                <p className="font-semibold text-green-800">
                  💰 Taxe et TVA
                </p>
                <p className="text-green-700 text-sm mt-2">
                  Il est conseillé aux ANI RESERVE Pro de contacter leur centre des impôts le plus proche ou leurs conseillers fiscaux pour en savoir plus sur les conséquences fiscales spécifiques à leur activité.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-blue-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Paramètres de réservation
            </h2>
            <div className="text-zinc-700 leading-relaxed space-y-4">
              <p>
                Pour confirmer une réservation d'un utilisateur, le profil du ANI RESERVE Pro doit être auparavant vérifié et confirmé par nos services, une carte de crédit valide sera encaissée des enregistrements.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-purple-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Comment puis-je contacter un ANIRESERVE Pro et utilisateur ANIRESERVE au sujet d'une réservation ?
            </h2>
            <div className="text-zinc-700 leading-relaxed space-y-4">
              <p>
                Il est important que vous communiquiez facilement avec les utilisateurs d'ANI RESERVE après une confirmation de réservation.
              </p>
              <p>
                La manière la plus sûre et sécurisée de se contacter est de passer par la messagerie ANI RESERVE. Vous pouvez communiquer une fois seulement la confirmation du service.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-pink-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Fonctionnement de ANIRESERVE
            </h2>
            <div className="text-zinc-700 leading-relaxed space-y-4">
              <p>
                Contacter ANI RESERVE directement par mail :{" "}
                <a 
                  href="mailto:contact@anireserve.com" 
                  className="text-purple-600 hover:text-purple-700 font-semibold underline"
                >
                  contact@anireserve.com
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}



