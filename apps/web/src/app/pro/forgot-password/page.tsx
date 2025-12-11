"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

export const dynamic = 'force-dynamic';

export default function ProForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/pro/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setSent(true);
      toast.showToast("Si cet email existe, un lien de réinitialisation a été envoyé.", "success");
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      toast.showToast(error.message || "Erreur lors de l'envoi de l'email", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl glass p-8 shadow-2xl border-2 border-purple-200/50">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              🔐 Mot de passe oublié
            </h1>
            <p className="text-sm text-zinc-600">
              Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 text-center">
                ✅ Email envoyé !<br />
                Si cet email existe dans notre système, tu recevras un lien de réinitialisation.
              </div>
              <Link
                href="/pro/login"
                className="block w-full text-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover-lift transition"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl glass border-2 border-purple-200/50 px-4 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                  placeholder="votre@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover-lift transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center space-y-2">
            <Link
              href="/pro/login"
              className="block text-sm font-medium text-zinc-700 hover:text-zinc-900 transition"
            >
              ← Retour à la connexion
            </Link>
            <Link
              href="/"
              className="block text-sm text-zinc-500 hover:text-zinc-700 transition"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}






