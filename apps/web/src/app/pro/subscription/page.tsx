"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Plan = {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
};

const plans: Plan[] = [
  {
    id: "free",
    name: "Gratuit",
    price: 0,
    features: [
      "Jusqu'à 10 réservations/mois",
      "Profil de base",
      "Statistiques simples",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 99,
    features: [
      "Réservations illimitées",
      "Profil personnalisé",
      "Statistiques avancées",
      "Badge vérifié",
      "Support prioritaire",
    ],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 199,
    features: [
      "Tout Premium",
      "Calendrier avancé",
      "Export de données",
      "API personnalisée",
      "Gestion d'équipe",
    ],
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      try {
        const response = await fetch("/api/pro/me");
        if (response.ok) {
          const data = await response.json();
          setCurrentPlan(data.subscriptionPlan || "free");
        }
      } catch (error) {
        console.error("Erreur chargement plan", error);
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, []);

  async function handleUpgrade(planId: string) {
    try {
      const response = await fetch("/api/pro/subscription", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      if (response.ok) {
        setCurrentPlan(planId);
        alert("Abonnement mis à jour avec succès !");
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour de l'abonnement");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10 sm:px-8 lg:px-12">
        <Link
          href="/pro/dashboard"
          className="mb-6 inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 transition"
        >
          ← Retour au tableau de bord
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Abonnements
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Choisis le plan qui correspond à tes besoins
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border bg-white p-6 shadow-sm ${
                plan.popular
                  ? "border-zinc-900 ring-2 ring-zinc-900"
                  : "border-zinc-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white">
                    Populaire
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-zinc-900">
                  {plan.name}
                </h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-zinc-900">
                    {plan.price === 0 ? "Gratuit" : `${plan.price}₪`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm text-zinc-500">/mois</span>
                  )}
                </div>
              </div>

              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-zinc-700">
                    <span className="text-emerald-600">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {currentPlan === plan.id ? (
                <button
                  disabled
                  className="w-full rounded-full border border-zinc-300 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-500"
                >
                  Plan actuel
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  className={`w-full rounded-full px-4 py-2 text-sm font-medium text-white transition ${
                    plan.popular
                      ? "bg-zinc-900 hover:bg-zinc-800"
                      : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                >
                  {currentPlan === "free" ? "S'abonner" : "Changer de plan"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




