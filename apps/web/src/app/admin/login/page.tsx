"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur de connexion");
      }

      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl glass p-8 shadow-2xl border-2 border-purple-200/50">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              🔐 Administration
            </h1>
            <p className="mt-2 text-sm text-zinc-600 font-medium">
              Accès réservé aux administrateurs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-800"
              >
                Email administrateur
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none ring-0 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50 hover:border-purple-300"
                placeholder="admin@anireserve.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-800"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none ring-0 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50 hover:border-purple-300"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all disabled:cursor-not-allowed disabled:opacity-70 animate-gradient"
            >
              {loading ? "⏳ Connexion..." : "🚀 Se connecter"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-700 transition font-medium"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

