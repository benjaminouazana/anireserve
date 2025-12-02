"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

function ClientResetPasswordContent() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    const tokenParam = searchParams?.get("token");
    const emailParam = searchParams?.get("email");
    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.showToast("Les mots de passe ne correspondent pas", "error");
      return;
    }

    if (newPassword.length < 6) {
      toast.showToast("Le mot de passe doit contenir au moins 6 caractères", "error");
      return;
    }

    if (!token || !email) {
      toast.showToast("Lien de réinitialisation invalide", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/client/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la réinitialisation");
      }

      toast.showToast("Mot de passe réinitialisé avec succès !", "success");
      setTimeout(() => {
        router.push("/client/login");
      }, 2000);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      toast.showToast(error.message || "Erreur lors de la réinitialisation", "error");
    } finally {
      setLoading(false);
    }
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl glass p-8 shadow-2xl border-2 border-red-200/50 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">❌ Lien invalide</h1>
            <p className="text-zinc-700 mb-6">
              Le lien de réinitialisation est invalide ou a expiré.
            </p>
            <Link
              href="/client/forgot-password"
              className="inline-block rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover-lift transition"
            >
              Demander un nouveau lien
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl glass p-8 shadow-2xl border-2 border-purple-200/50">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              🔐 Nouveau mot de passe
            </h1>
            <p className="text-sm text-zinc-600">
              Crée un nouveau mot de passe pour ton compte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-zinc-800"
              >
                Nouveau mot de passe
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full rounded-xl glass border-2 border-purple-200/50 px-4 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                placeholder="Minimum 6 caractères"
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-zinc-800"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-xl glass border-2 border-purple-200/50 px-4 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                placeholder="Répète le mot de passe"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover-lift transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/client/login"
              className="block text-sm text-zinc-500 hover:text-zinc-700 transition"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientResetPasswordPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ClientResetPasswordContent />
    </Suspense>
  );
}




