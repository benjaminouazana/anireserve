"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Simulation d'envoi (à remplacer par un vrai appel API)
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

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
            📧 Nous contacter
          </h1>
          <p className="text-lg text-zinc-600 font-medium">
            Une question ? Une suggestion ? Nous sommes là pour vous aider !
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Informations de contact */}
          <div className="space-y-6">
            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Informations de contact
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-2">📧 Email</h3>
                  <a
                    href="mailto:contact@anireserve.com"
                    className="text-purple-600 hover:text-purple-700 transition"
                  >
                    contact@anireserve.com
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-2">⏰ Horaires</h3>
                  <p className="text-zinc-700 text-sm">
                    Du lundi au vendredi : 9h - 18h<br />
                    Samedi : 10h - 14h<br />
                    Dimanche : Fermé
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-2">📍 Localisation</h3>
                  <p className="text-zinc-700 text-sm">
                    Israël<br />
                    Service en ligne disponible 24/7
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-pink-200/50">
              <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Besoin d'aide ?
              </h2>
              <p className="text-zinc-700 text-sm mb-4">
                Consultez notre FAQ pour trouver rapidement des réponses aux questions les plus fréquentes.
              </p>
              <Link
                href="/faq"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold transition"
              >
                Voir la FAQ →
              </Link>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="rounded-3xl glass p-6 sm:p-8 shadow-2xl border-2 border-blue-200/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Envoyez-nous un message
            </h2>

            {status === "success" ? (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-emerald-700 font-semibold">
                  ✅ Message envoyé avec succès !<br />
                  <span className="text-sm font-normal">Nous vous répondrons dans les plus brefs délais.</span>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl glass border-2 border-purple-200/50 px-4 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl glass border-2 border-purple-200/50 px-4 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 mb-2">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl glass border-2 border-purple-200/50 px-4 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="question">Question générale</option>
                    <option value="technical">Problème technique</option>
                    <option value="professional">Question professionnel</option>
                    <option value="client">Question client</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl glass border-2 border-purple-200/50 px-4 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50 resize-none"
                    placeholder="Décrivez votre question ou votre demande..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? "Envoi en cours..." : "Envoyer le message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

