"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

interface NotesSectionProps {
  professionalId: number;
}

export function NotesSection({ professionalId }: NotesSectionProps) {
  const router = useRouter();
  const toast = useToast();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    checkClient();
  }, []);

  useEffect(() => {
    if (isClient) {
      loadNote();
    }
  }, [isClient, professionalId]);

  async function checkClient() {
    try {
      const res = await fetch("/api/client/me");
      if (res.ok) {
        setIsClient(true);
      }
    } catch (error) {
      setIsClient(false);
    }
  }

  async function loadNote() {
    if (!isClient) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/client/notes?professionalId=${professionalId}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setNote(data.note || "");
        }
      }
    } catch (error) {
      console.error("Erreur chargement note:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!isClient) {
      const shouldLogin = confirm(
        "Pour ajouter des notes, vous devez être connecté.\n\n" +
        "Voulez-vous vous connecter maintenant ?"
      );
      
      if (shouldLogin) {
        router.push("/client/login");
      }
      return;
    }

    if (note.trim().length === 0) {
      toast.showToast("La note ne peut pas être vide", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/client/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId,
          note: note.trim(),
        }),
      });

      if (res.ok) {
        toast.showToast("Note sauvegardée avec succès", "success");
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.showToast(err.message || "Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/client/notes?professionalId=${professionalId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNote("");
        toast.showToast("Note supprimée avec succès", "success");
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.showToast(err.message || "Erreur lors de la suppression", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="border-b border-zinc-200 bg-white px-4 py-6 sm:px-8">
        <p className="text-sm text-zinc-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="border-b border-zinc-200 bg-white px-4 py-6 sm:px-8">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900">
        📝 Mes notes privées
      </h2>
      <p className="mb-4 text-sm text-zinc-500">
        Ajoutez des notes privées sur ce professionnel. Ces notes ne sont visibles que par vous.
      </p>
      
      <div className="space-y-3">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ex: Excellent service, très ponctuel, à refaire..."
          rows={4}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          disabled={!isClient}
        />
        
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !isClient}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Sauvegarde..." : "💾 Sauvegarder"}
          </button>
          
          {note && isClient && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🗑️ Supprimer
            </button>
          )}
        </div>

        {!isClient && (
          <p className="text-xs text-zinc-500">
            💡 <Link href="/client/login" className="text-zinc-900 hover:underline">Connectez-vous</Link> pour ajouter des notes privées
          </p>
        )}
      </div>
    </div>
  );
}

