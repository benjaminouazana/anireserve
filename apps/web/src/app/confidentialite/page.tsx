import Link from "next/link";

export default function ConfidentialitePage() {
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
            🔒 Politique de Confidentialité
          </h1>
          <p className="text-sm text-zinc-500">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Contenu */}
        <div className="space-y-8">
          {/* Introduction */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-purple-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Introduction
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              <strong>Ani reserve</strong> ("nous", "notre", "la plateforme") s'engage à protéger et respecter votre vie privée. 
              Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos données personnelles 
              lorsque vous utilisez notre plateforme de réservation.
            </p>
            <p className="text-zinc-700 leading-relaxed mt-4">
              En utilisant notre plateforme, vous acceptez les pratiques décrites dans cette politique. Si vous n'acceptez pas cette politique, 
              veuillez ne pas utiliser nos services.
            </p>
          </section>

          {/* 1. Données collectées */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-pink-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              1. Données que nous collectons
            </h2>
            <div className="space-y-4 text-zinc-700">
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">1.1 - Données des clients</h3>
                <p className="leading-relaxed">
                  Lors de la création d'un compte client, nous collectons :
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Nom complet</li>
                  <li>Adresse email</li>
                  <li>Mot de passe (hashé de manière sécurisée)</li>
                  <li>Historique des réservations</li>
                  <li>Avis et évaluations laissés</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">1.2 - Données des professionnels</h3>
                <p className="leading-relaxed">
                  Lors de l'inscription professionnelle, nous collectons :
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Villes de travail</li>
                  <li>Services proposés</li>
                  <li>Teoudate Zeoute (carte d'identité israélienne) - pour vérification uniquement</li>
                  <li>Disponibilités et créneaux</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">1.3 - Données techniques</h3>
                <p className="leading-relaxed">
                  Nous collectons automatiquement certaines données techniques lorsque vous utilisez notre plateforme :
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Adresse IP</li>
                  <li>Type de navigateur et système d'exploitation</li>
                  <li>Pages visitées et actions effectuées</li>
                  <li>Date et heure de connexion</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. Utilisation des données */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-blue-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              2. Comment nous utilisons vos données
            </h2>
            <div className="space-y-4 text-zinc-700">
              <p className="leading-relaxed">
                Nous utilisons vos données personnelles pour les finalités suivantes :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Fournir nos services :</strong> Gérer vos réservations, faciliter la communication entre clients et professionnels</li>
                <li><strong>Vérification :</strong> Valider l'identité des professionnels et garantir la sécurité de la plateforme</li>
                <li><strong>Communication :</strong> Vous envoyer des confirmations de réservation, des rappels et des notifications importantes</li>
                <li><strong>Amélioration :</strong> Analyser l'utilisation de la plateforme pour améliorer nos services</li>
                <li><strong>Sécurité :</strong> Détecter et prévenir la fraude, les abus et les activités suspectes</li>
                <li><strong>Obligations légales :</strong> Respecter nos obligations légales et réglementaires</li>
              </ul>
            </div>
          </section>

          {/* 3. Partage des données */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-emerald-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              3. Partage de vos données
            </h2>
            <div className="space-y-4 text-zinc-700">
              <p className="leading-relaxed">
                <strong>Nous ne vendons jamais vos données personnelles à des tiers.</strong> Nous partageons vos données uniquement dans les cas suivants :
              </p>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">3.1 - Avec les professionnels</h3>
                <p className="leading-relaxed">
                  Lors d'une réservation, nous partageons avec le professionnel concerné :
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Votre nom</li>
                  <li>Votre email</li>
                  <li>Votre numéro de téléphone (si fourni)</li>
                  <li>Les détails de la réservation</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">3.2 - Prestataires de services</h3>
                <p className="leading-relaxed">
                  Nous pouvons partager certaines données avec des prestataires de services de confiance qui nous aident à faire fonctionner la plateforme 
                  (hébergement, emails, analyse). Ces prestataires sont contractuellement tenus de protéger vos données.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">3.3 - Obligations légales</h3>
                <p className="leading-relaxed">
                  Nous pouvons divulguer vos données si la loi l'exige ou si nous pensons de bonne foi qu'une telle divulgation est nécessaire pour 
                  protéger nos droits, votre sécurité ou celle d'autrui.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Sécurité des données */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-amber-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              4. Sécurité de vos données
            </h2>
            <div className="space-y-4 text-zinc-700">
              <p className="leading-relaxed">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Chiffrement :</strong> Les mots de passe sont hashés avec bcrypt</li>
                <li><strong>HTTPS :</strong> Toutes les communications sont chiffrées via SSL/TLS</li>
                <li><strong>Accès restreint :</strong> Seuls les membres autorisés de notre équipe ont accès aux données</li>
                <li><strong>Sauvegardes :</strong> Vos données sont sauvegardées régulièrement</li>
                <li><strong>Surveillance :</strong> Nous surveillons activement les tentatives d'accès non autorisées</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est 100% sécurisée. 
                Bien que nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger vos données, 
                nous ne pouvons garantir leur sécurité absolue.
              </p>
            </div>
          </section>

          {/* 5. Vos droits */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-red-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
              5. Vos droits
            </h2>
            <div className="space-y-4 text-zinc-700">
              <p className="leading-relaxed">
                Conformément à la réglementation sur la protection des données, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Droit d'accès :</strong> Vous pouvez demander une copie de vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> Vous pouvez corriger vos données inexactes ou incomplètes</li>
                <li><strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données dans certains cas</li>
                <li><strong>Droit à la portabilité :</strong> Vous pouvez demander à recevoir vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données dans certains cas</li>
                <li><strong>Droit de retrait du consentement :</strong> Vous pouvez retirer votre consentement à tout moment</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Pour exercer ces droits, contactez-nous à <a href="mailto:contact@anireserve.com" className="text-purple-600 hover:text-purple-700 underline">contact@anireserve.com</a>
              </p>
            </div>
          </section>

          {/* 6. Conservation des données */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-indigo-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              6. Conservation des données
            </h2>
            <div className="space-y-4 text-zinc-700">
              <p className="leading-relaxed">
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Comptes actifs :</strong> Vos données sont conservées tant que votre compte est actif</li>
                <li><strong>Comptes fermés :</strong> Après fermeture de compte, nous conservons certaines données pendant 3 ans pour des raisons légales</li>
                <li><strong>Réservations :</strong> L'historique des réservations est conservé pendant 5 ans</li>
                <li><strong>Documents de vérification :</strong> Les Teoudate Zeoute sont supprimés après validation du profil</li>
              </ul>
            </div>
          </section>

          {/* 7. Cookies */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-purple-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              7. Cookies et technologies similaires
            </h2>
            <div className="space-y-4 text-zinc-700">
              <p className="leading-relaxed">
                Nous utilisons des cookies et technologies similaires pour :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintenir votre session de connexion</li>
                <li>Mémoriser vos préférences</li>
                <li>Analyser l'utilisation de la plateforme</li>
                <li>Améliorer l'expérience utilisateur</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Vous pouvez contrôler les cookies via les paramètres de votre navigateur. 
                Cependant, la désactivation des cookies peut affecter certaines fonctionnalités de la plateforme.
              </p>
            </div>
          </section>

          {/* 8. Modifications */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-pink-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              8. Modifications de cette politique
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications importantes vous seront notifiées 
              par email ou via une notification sur la plateforme. La date de dernière mise à jour est indiquée en haut de cette page.
            </p>
          </section>

          {/* 9. Contact */}
          <section className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-blue-200/50 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              9. Contact
            </h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, contactez-nous :
            </p>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-200/50">
              <p className="text-zinc-900 font-semibold mb-2">📧 Email :</p>
              <a href="mailto:contact@anireserve.com" className="text-purple-600 hover:text-purple-700 underline">
                contact@anireserve.com
              </a>
            </div>
          </section>
        </div>

        {/* Footer de la page */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full glass border-2 border-purple-200/50 px-6 py-3 text-sm font-semibold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/cgv"
            className="inline-flex items-center justify-center rounded-full glass border-2 border-purple-200/50 px-6 py-3 text-sm font-semibold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
          >
            Voir les CGV
          </Link>
        </div>
      </div>
    </div>
  );
}




