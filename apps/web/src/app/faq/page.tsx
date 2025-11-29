"use client";

import { useState } from "react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: "client" | "professional" | "general";
}

const faqs: FAQItem[] = [
  {
    category: "general",
    question: "Qu'est-ce qu'Ani reserve ?",
    answer: "Ani reserve est une plateforme de réservation en ligne dédiée à la communauté francophone en Israël. Elle permet aux clients de trouver et réserver facilement des services auprès de professionnels vérifiés qui parlent français.",
  },
  {
    category: "client",
    question: "Comment réserver un rendez-vous ?",
    answer: "C'est très simple ! Recherchez un professionnel par ville et type de service, consultez ses créneaux disponibles, puis remplissez le formulaire de réservation. Le professionnel validera votre demande et vous recevrez une confirmation par email.",
  },
  {
    category: "client",
    question: "Le paiement se fait-il en ligne ?",
    answer: "Non, le paiement se fait directement sur place, au moment de la prestation, entre vous et le professionnel. Aucun paiement en ligne n'est requis, ce qui garantit votre sécurité financière.",
  },
  {
    category: "client",
    question: "Puis-je annuler un rendez-vous ?",
    answer: "Oui, vous pouvez annuler un rendez-vous, mais attention : les annulations dans les 24 heures précédant le service ne sont pas autorisées. Pour annuler, connectez-vous à votre compte et allez dans 'Mes réservations'.",
  },
  {
    category: "client",
    question: "Comment créer un compte client ?",
    answer: "Cliquez sur 'Créer un compte' dans le menu ou le footer, remplissez le formulaire avec vos informations (nom, email, mot de passe), et voilà ! Votre compte est créé instantanément.",
  },
  {
    category: "client",
    question: "Les professionnels sont-ils vérifiés ?",
    answer: "Oui, tous les professionnels doivent fournir leur Teoudate Zeoute (carte d'identité israélienne) lors de l'inscription. Notre équipe vérifie tous les documents avant d'activer un profil professionnel.",
  },
  {
    category: "professional",
    question: "Comment s'inscrire comme professionnel ?",
    answer: "Remplissez le formulaire d'inscription professionnel avec vos informations (nom, prénom, email, téléphone), sélectionnez vos villes et services, puis uploadez votre Teoudate Zeoute. Notre équipe vérifiera votre profil sous 24-48h.",
  },
  {
    category: "professional",
    question: "Combien de temps prend la validation du profil ?",
    answer: "La validation de votre profil prend généralement entre 24 et 48 heures. Vous recevrez un email une fois votre profil validé ou si des informations supplémentaires sont nécessaires.",
  },
  {
    category: "professional",
    question: "Comment gérer mes réservations ?",
    answer: "Une fois connecté à votre espace professionnel, vous verrez toutes vos réservations en attente. Vous pouvez les valider ou les refuser. Les créneaux validés sont automatiquement bloqués pour éviter les doubles réservations.",
  },
  {
    category: "professional",
    question: "Puis-je modifier mes créneaux disponibles ?",
    answer: "Oui, dans votre espace professionnel, vous pouvez configurer vos heures de disponibilité, vos jours de fermeture, et vos pauses. Les modifications sont prises en compte immédiatement.",
  },
  {
    category: "professional",
    question: "Y a-t-il des frais pour les professionnels ?",
    answer: "Pour le moment, l'inscription et l'utilisation de la plateforme sont gratuites. Nous mettrons en place un système d'abonnement optionnel dans le futur pour des fonctionnalités premium.",
  },
  {
    category: "general",
    question: "Dans quelles villes la plateforme est-elle disponible ?",
    answer: "La plateforme couvre toutes les principales villes d'Israël : Tel Aviv, Jérusalem, Haïfa, Netanya, Rishon LeZion, Petah Tikva, Ashdod, Beer Sheva, et bien d'autres. Vous pouvez rechercher par ville lors de votre recherche de professionnel.",
  },
  {
    category: "general",
    question: "Quels types de services sont disponibles ?",
    answer: "Nous proposons une large gamme de services : coiffure, esthétique, coaching sportif, services juridiques, comptabilité, médecine, psychologie, dentisterie, kinésithérapie, architecture, design, et bien plus encore.",
  },
  {
    category: "general",
    question: "Comment fonctionne le système d'avis ?",
    answer: "Après chaque rendez-vous, les clients peuvent laisser un avis et une note (1 à 5 étoiles) sur le professionnel. Ces avis sont publics et aident les autres clients à choisir le bon professionnel.",
  },
  {
    category: "general",
    question: "Mes données sont-elles sécurisées ?",
    answer: "Oui, nous prenons la sécurité de vos données très au sérieux. Vos informations personnelles sont protégées et ne sont jamais partagées avec des tiers. Nous respectons strictement la réglementation sur la protection des données.",
  },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "client" | "professional" | "general">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFAQs = selectedCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

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
            ❓ Questions fréquentes (FAQ)
          </h1>
          <p className="text-lg text-zinc-600 font-medium">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[
            { key: "all", label: "Toutes", emoji: "📋" },
            { key: "client", label: "Clients", emoji: "👥" },
            { key: "professional", label: "Professionnels", emoji: "💼" },
            { key: "general", label: "Général", emoji: "ℹ️" },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setSelectedCategory(cat.key as any);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                selectedCategory === cat.key
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "glass border-2 border-purple-200/50 text-purple-700 hover:border-purple-300"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Liste des FAQ */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50 animate-fade-in"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                      {faq.category === "client" && "👥 Client"}
                      {faq.category === "professional" && "💼 Professionnel"}
                      {faq.category === "general" && "ℹ️ Général"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">
                    {faq.question}
                  </h3>
                </div>
                <span className="text-2xl text-purple-600 flex-shrink-0">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="mt-4 pt-4 border-t border-purple-200/50">
                  <p className="text-zinc-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Section contact */}
        <div className="mt-12 rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-purple-200/50 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-zinc-700 mb-6">
            Notre équipe est là pour vous aider. Contactez-nous et nous vous répondrons dans les plus brefs délais.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}

