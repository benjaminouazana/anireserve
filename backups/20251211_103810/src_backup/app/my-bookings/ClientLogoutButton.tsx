"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ClientLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/client/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-70"
    >
      {loading ? "Déconnexion..." : "Déconnexion"}
    </button>
  );
}












