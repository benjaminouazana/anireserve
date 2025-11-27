"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface Professional {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string | null;
  city: string;
  cities: string | null;
  serviceType: string;
  services: string | null;
  subcategories: string | null;
  description: string | null;
  teoudatZeout: string | null;
  status: string;
  createdAt: string;
}

export function AdminPendingProfessionalsContent({ admin }: { admin: Admin }) {
  const router = useRouter();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    loadProfessionals();
  }, []);

  async function loadProfessionals() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/professionals/pending", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Erreur API");
      const data = await response.json();
      setProfessionals(data.professionals || []);
    } catch (error) {
      console.error("Erreur chargement profils:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleValidate(professionalId: number, action: "approve" | "reject") {
    if (action === "reject" && !rejectionReason.trim()) {
      alert("Veuillez indiquer une raison de rejet");
      return;
    }

    setProcessing(professionalId);
    try {
      const response = await fetch(`/api/admin/professionals/${professionalId}/validate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          rejectionReason: action === "reject" ? rejectionReason : null,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la validation");
      }

      // Recharger la liste
      loadProfessionals();
      setSelectedPro(null);
      setRejectionReason("");
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-xl font-bold text-purple-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              ⏳ Profils en attente de validation
            </h1>
            <p className="mt-2 text-sm text-zinc-600 font-medium">
              Connecté en tant que {admin.name} ({admin.email})
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-semibold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
            >
              🛡️ Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-semibold text-red-700 shadow-lg hover-lift hover:shadow-xl transition-all"
            >
              🚪 Déconnexion
            </button>
          </div>
        </header>

        {professionals.length === 0 ? (
          <div className="rounded-3xl glass p-8 shadow-2xl border-2 border-purple-200/50 text-center">
            <p className="text-lg text-zinc-600 font-medium">
              ✅ Aucun profil en attente de validation
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {professionals.map((pro) => (
              <div
                key={pro.id}
                className="rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50 animate-fade-in"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-4">
                      {pro.firstName} {pro.lastName}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-zinc-700">Email:</span>{" "}
                        <span className="text-zinc-600">{pro.email}</span>
                      </div>
                      {pro.phone && (
                        <div>
                          <span className="font-medium text-zinc-700">Téléphone:</span>{" "}
                          <span className="text-zinc-600">{pro.phone}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-zinc-700">Ville principale:</span>{" "}
                        <span className="text-zinc-600">{pro.city}</span>
                      </div>
                      {pro.cities && (
                        <div>
                          <span className="font-medium text-zinc-700">Autres villes:</span>{" "}
                          <span className="text-zinc-600">{pro.cities}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-zinc-700">Service principal:</span>{" "}
                        <span className="text-zinc-600">{pro.serviceType}</span>
                      </div>
                      {pro.services && (
                        <div>
                          <span className="font-medium text-zinc-700">Services:</span>{" "}
                          <span className="text-zinc-600">{pro.services}</span>
                        </div>
                      )}
                      {pro.subcategories && (
                        <div>
                          <span className="font-medium text-zinc-700">Sous-catégories:</span>{" "}
                          <span className="text-zinc-600">{pro.subcategories}</span>
                        </div>
                      )}
                      {pro.description && (
                        <div>
                          <span className="font-medium text-zinc-700">Description:</span>{" "}
                          <span className="text-zinc-600">{pro.description}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-zinc-700">Date d'inscription:</span>{" "}
                        <span className="text-zinc-600">
                          {new Date(pro.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {pro.teoudatZeout && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                          Teoudate Zeoute:
                        </label>
                        <a
                          href={pro.teoudatZeout}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-4 py-2 text-sm font-medium hover:bg-blue-200 transition"
                        >
                          📄 Voir le document
                        </a>
                      </div>
                    )}

                    {selectedPro?.id === pro.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Raison du rejet (obligatoire si rejet)"
                          className="w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleValidate(pro.id, "approve")}
                            disabled={processing === pro.id}
                            className="flex-1 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-emerald-600 transition disabled:opacity-50"
                          >
                            ✅ Approuver
                          </button>
                          <button
                            onClick={() => handleValidate(pro.id, "reject")}
                            disabled={processing === pro.id || !rejectionReason.trim()}
                            className="flex-1 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-red-600 transition disabled:opacity-50"
                          >
                            ❌ Rejeter
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPro(null);
                              setRejectionReason("");
                            }}
                            className="rounded-full glass border-2 border-purple-200/50 px-4 py-2 text-sm font-semibold text-purple-700 shadow-lg hover-lift transition"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPro(pro);
                            setRejectionReason("");
                          }}
                          className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover-lift transition"
                        >
                          Valider ce profil
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

