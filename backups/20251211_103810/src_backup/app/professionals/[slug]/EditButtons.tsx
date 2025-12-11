"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { ImageUploadButton } from "@/app/pro/settings/ImageUploadButton";

interface EditButtonsProps {
  professionalId: number;
  currentGallery: string[];
  currentPricing: Record<string, number>;
}

export function EditButtons({ professionalId, currentGallery, currentPricing }: EditButtonsProps) {
  const router = useRouter();
  const toast = useToast();
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [galleryUrls, setGalleryUrls] = useState<string>("");
  const [pricingEntries, setPricingEntries] = useState<Array<{service: string; price: string}>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function checkOwner() {
      try {
        const res = await fetch("/api/pro/me", { credentials: "include" });
        if (res.ok) {
          const pro = await res.json();
          setIsOwner(pro.id === professionalId);
        }
      } catch (error) {
        // Pas connecté ou erreur
      } finally {
        setLoading(false);
      }
    }
    checkOwner();
  }, [professionalId]);

  useEffect(() => {
    // Initialiser les données
    setGalleryUrls(currentGallery.join(", "));
    setPricingEntries(
      Object.entries(currentPricing).map(([service, price]) => ({
        service,
        price: price.toString(),
      }))
    );
  }, [currentGallery, currentPricing]);

  async function handleSaveImages() {
    setSaving(true);
    try {
      const response = await fetch("/api/pro/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gallery: galleryUrls,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      toast.showToast("Images mises à jour avec succès !", "success");
      setShowImageModal(false);
      router.refresh();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.showToast(err.message || "Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePricing() {
    setSaving(true);
    try {
      const pricingObj: Record<string, number> = {};
      pricingEntries.forEach((entry) => {
        if (entry.service.trim() && entry.price.trim()) {
          const price = parseFloat(entry.price);
          if (!isNaN(price) && price > 0) {
            pricingObj[entry.service.trim()] = price;
          }
        }
      });

      const response = await fetch("/api/pro/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pricing: JSON.stringify(pricingObj),
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      toast.showToast("Tarifs mis à jour avec succès !", "success");
      setShowPricingModal(false);
      router.refresh();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.showToast(err.message || "Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !isOwner) {
    return null;
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setShowImageModal(true)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition shadow-lg hover:shadow-xl"
          style={{ background: "linear-gradient(135deg, #18223b 0%, #2FB190 100%)" }}
        >
          📷 Ajouter des images
        </button>
        <button
          onClick={() => setShowPricingModal(true)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition shadow-lg hover:shadow-xl"
          style={{ background: "linear-gradient(135deg, #18223b 0%, #2FB190 100%)" }}
        >
          💰 Gérer mes prix
        </button>
        <Link
          href="/pro/settings"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
        >
          ⚙️ Paramètres complets
        </Link>
      </div>

      {/* Modal Images */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-zinc-900">
                Gérer mes images
              </h2>
              <button
                onClick={() => setShowImageModal(false)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-800 mb-2">
                  URLs des images (séparées par des virgules)
                </label>
                <textarea
                  value={galleryUrls}
                  onChange={(e) => setGalleryUrls(e.target.value)}
                  rows={6}
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                />
                <p className="mt-2 text-xs text-zinc-500">
                  Collez les URLs de vos images séparées par des virgules. Vous pouvez aussi utiliser le bouton ci-dessous pour uploader.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-800 mb-2">
                  Ou uploader une image
                </label>
                <ImageUploadButton
                  onUpload={(url) => {
                    const currentUrls = galleryUrls.trim() ? galleryUrls.split(",").map(u => u.trim()) : [];
                    const newUrls = [...currentUrls, url].filter(Boolean);
                    setGalleryUrls(newUrls.join(", "));
                  }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveImages}
                  disabled={saving}
                  className="flex-1 rounded-full px-4 py-2 text-sm font-medium text-white transition shadow-lg hover:shadow-xl disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #18223b 0%, #2FB190 100%)" }}
                >
                  {saving ? "Sauvegarde..." : "Sauvegarder"}
                </button>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Prix */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-zinc-900">
                Gérer mes tarifs
              </h2>
              <button
                onClick={() => setShowPricingModal(false)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                {pricingEntries.map((entry, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={entry.service}
                      onChange={(e) => {
                        const newEntries = [...pricingEntries];
                        newEntries[index].service = e.target.value;
                        setPricingEntries(newEntries);
                      }}
                      className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                      placeholder="Nom du service (ex: Consultation)"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={entry.price}
                      onChange={(e) => {
                        const newEntries = [...pricingEntries];
                        newEntries[index].price = e.target.value;
                        setPricingEntries(newEntries);
                      }}
                      className="w-32 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                      placeholder="Prix (₪)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPricingEntries(
                          pricingEntries.filter((_, i) => i !== index)
                        );
                      }}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 transition hover:bg-red-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setPricingEntries([...pricingEntries, { service: "", price: "" }]);
                  }}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
                >
                  + Ajouter un service
                </button>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSavePricing}
                  disabled={saving}
                  className="flex-1 rounded-full px-4 py-2 text-sm font-medium text-white transition shadow-lg hover:shadow-xl disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #18223b 0%, #2FB190 100%)" }}
                >
                  {saving ? "Sauvegarde..." : "Sauvegarder"}
                </button>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

