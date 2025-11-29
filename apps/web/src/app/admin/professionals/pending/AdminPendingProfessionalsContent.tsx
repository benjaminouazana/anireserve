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
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState(false);

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
                        <button
                          onClick={() => {
                            setViewingDocument(pro.teoudatZeout);
                            setDocumentError(false);
                          }}
                          className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-4 py-2 text-sm font-medium hover:bg-blue-200 transition"
                        >
                          📄 Voir le document
                        </button>
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

      {/* Modal pour afficher le document */}
      {viewingDocument && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setViewingDocument(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-zinc-900">
                📄 Teoudate Zeoute
              </h3>
              <button
                onClick={() => setViewingDocument(null)}
                className="text-zinc-500 hover:text-zinc-700 text-2xl font-bold transition"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)] flex items-center justify-center bg-gray-50">
              {documentError ? (
                <div className="text-center p-8">
                  <p className="text-zinc-600 font-semibold mb-4">
                    Impossible d'afficher le document directement
                  </p>
                  <p className="text-sm text-zinc-500 mb-4">
                    Le document peut être une image ou un PDF. Cliquez sur le lien ci-dessous pour l'ouvrir.
                  </p>
                  <a
                    href={viewingDocument || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    📄 Ouvrir le document dans un nouvel onglet
                  </a>
                </div>
              ) : (() => {
                // Détecter si c'est une URL placeholder (mode développement)
                const isPlaceholder = viewingDocument.includes('via.placeholder.com') || viewingDocument.includes('placeholder.com');
                
                if (isPlaceholder) {
                  return (
                    <div className="text-center p-8">
                      <div className="mb-4">
                        <div className="text-6xl mb-4">📄</div>
                        <p className="text-zinc-600 font-semibold mb-2">
                          Document de test (mode développement)
                        </p>
                        <p className="text-sm text-zinc-500 mb-4">
                          En production, le document Teoudate Zeoute sera stocké sur Supabase et affiché ici.
                        </p>
                        <p className="text-xs text-zinc-400 mb-4">
                          URL: {viewingDocument.substring(0, 80)}...
                        </p>
                      </div>
                      <a
                        href={viewingDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                      >
                        📄 Essayer d'ouvrir l'URL
                      </a>
                    </div>
                  );
                }
                
                // Extraire l'extension du fichier même avec des paramètres de requête
                const urlWithoutParams = viewingDocument.split('?')[0];
                const extension = urlWithoutParams.split('.').pop()?.toLowerCase() || '';
                const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'bmp', 'svg'].includes(extension);
                const isPdf = extension === 'pdf';
                
                // Utiliser l'URL proxy pour éviter les problèmes CORS (sauf pour les placeholders)
                const proxyUrl = `/api/admin/document?url=${encodeURIComponent(viewingDocument)}`;
                
                // Si c'est un PDF, afficher dans un iframe
                if (isPdf) {
                  return (
                    <iframe
                      src={proxyUrl}
                      className="w-full h-[calc(90vh-120px)] rounded-lg shadow-lg"
                      title="Teoudate Zeoute PDF"
                      onError={() => setDocumentError(true)}
                    />
                  );
                }
                
                // Pour les images ou formats inconnus, essayer d'abord comme image
                // Utiliser l'URL proxy pour éviter les problèmes CORS
                return (
                  <img
                    src={proxyUrl}
                    alt="Teoudate Zeoute"
                    className="max-w-full max-h-[calc(90vh-200px)] object-contain rounded-lg shadow-lg mx-auto"
                    onError={() => setDocumentError(true)}
                    onLoad={() => setDocumentError(false)}
                  />
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

