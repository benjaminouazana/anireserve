"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClientRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/client/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      // Rediriger vers la page de login avec un message de succès
      router.push("/client/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-100">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Inscription client
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Créez votre compte pour gérer vos réservations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-800"
              >
                Nom complet *
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="Jean Dupont"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-800"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="jean@example.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-800"
              >
                Mot de passe *
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-zinc-800"
              >
                Confirmer le mot de passe *
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Inscription en cours..." : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/client/login"
              className="text-sm text-zinc-500 hover:text-zinc-700 transition"
            >
              Déjà un compte ? Se connecter
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-700 transition"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




