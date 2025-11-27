"use client";

import { useState } from "react";
import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CITIES, SERVICES, SERVICE_SUBCATEGORIES } from "@/app/pro/register/constants";

// Données mockées de secours
const FALLBACK_PROS = [
  {
    id: 1,
    name: "Sarah Coiffure",
    city: "Tel Aviv",
    service: "Coiffeur",
    languages: ["Français", "Hébreu"],
    description: "Spécialisée en coupes modernes et coloration.",
  },
  {
    id: 2,
    name: "Dr Cohen",
    city: "Jérusalem",
    service: "Médecin",
    languages: ["Français", "Anglais"],
    description: "Médecin généraliste, suivi famille et enfants.",
  },
];

type Professional = (typeof FALLBACK_PROS)[number];

export default function Home() {
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [availableToday, setAvailableToday] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [results, setResults] = useState<Professional[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [occupiedSlots, setOccupiedSlots] = useState<Array<{start: string, end: string}>>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setHasSearched(true);
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (city) params.append("city", city);
      if (service) params.append("service", service);
      if (subcategory) params.append("subcategory", subcategory);
      if (availableToday) params.append("availableToday", "true");
      if (sortBy) params.append("sortBy", sortBy);

      const response = await fetch(`/api/professionals?${params.toString()}`, {
        cache: "force-cache", // Utiliser le cache du navigateur
      });
      if (!response.ok) throw new Error("Erreur API");

      const data: Professional[] = await response.json();
      setResults(data);
      // Réinitialiser le formulaire lors d'une nouvelle recherche
      setSelectedPro(null);
      setClientName("");
      setClientEmail("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setAvailableSlots([]);
      setOccupiedSlots([]);
      setBookingMessage(null);
    } catch {
      const filtered = FALLBACK_PROS.filter((pro) => {
        const matchCity = city ? pro.city === city : true;
        const matchService = service ? pro.service === service : true;
        return matchCity && matchService;
      });
      setResults(filtered);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPro) return;

    // Validation côté client
    if (!clientName.trim() || !clientEmail.trim() || !date || !startTime || !endTime) {
      setBookingMessage("❌ Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      setBookingMessage("❌ Veuillez entrer une adresse email valide.");
      return;
    }

    setBookingLoading(true);
    setBookingMessage(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professionalId: selectedPro.id,
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          date,
          startTime,
          endTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de la création du rendez-vous");
      }

      const data = await response.json();
      setBookingMessage(
        data.message || "✅ Rendez-vous créé avec succès ! Le professionnel recevra la demande de confirmation. 💳 Le paiement se fera sur place au moment de la prestation."
      );
      
      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setClientName("");
        setClientEmail("");
        setDate("");
        setStartTime("");
        setEndTime("");
        setAvailableSlots([]);
        setOccupiedSlots([]);
        setSelectedPro(null);
        setBookingMessage(null);
      }, 3000);
    } catch (error: any) {
      setBookingMessage(
        `❌ ${error.message || "Impossible de créer le rendez-vous. Réessaie plus tard."}`
      );
    } finally {
      setBookingLoading(false);
    }
  }

  async function loadAvailableSlots(proId: number, selectedDate: string) {
    if (!selectedDate) {
      setAvailableSlots([]);
      setOccupiedSlots([]);
      return;
    }

    setLoadingSlots(true);
    try {
      const slotsResponse = await fetch(
        `/api/professionals/${proId}/slots?date=${selectedDate}`
      );
      if (slotsResponse.ok) {
        const slotsData = await slotsResponse.json();
        setAvailableSlots(slotsData.availableSlots || []);
      }

      const occupiedResponse = await fetch(
        `/api/professionals/${proId}/availability?date=${selectedDate}`
      );
      if (occupiedResponse.ok) {
        const occupiedData = await occupiedResponse.json();
        setOccupiedSlots(occupiedData.occupiedSlots || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des créneaux", error);
    } finally {
      setLoadingSlots(false);
    }
  }

  function handleDateChange(newDate: string) {
    setDate(newDate);
    setStartTime("");
    setEndTime("");
    setBookingMessage(null); // Effacer les messages précédents
    if (selectedPro && newDate) {
      loadAvailableSlots(selectedPro.id, newDate);
    } else {
      setAvailableSlots([]);
      setOccupiedSlots([]);
    }
  }

  function handleSlotSelect(slotTime: string) {
    if (!selectedPro) return;
    
    // Le format est maintenant "HH:MM-HH:MM"
    if (slotTime.includes("-")) {
      const [start, end] = slotTime.split("-");
      setStartTime(start);
      setEndTime(end);
    } else {
      // Fallback pour l'ancien format (juste l'heure de début)
      const [hours, minutes] = slotTime.split(":").map(Number);
      const endDate = new Date();
      endDate.setHours(hours, minutes + 30, 0, 0);
      const endTimeStr = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
      setStartTime(slotTime);
      setEndTime(endTimeStr);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 sm:mb-8 flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Ani reserve
            </h1>
            <p className="mt-2 text-sm text-zinc-600 font-medium">
              La plateforme de réservation en Israel<br />Pour les Français.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ThemeToggle />
            <Link
              href="/my-bookings"
              className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-semibold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
            >
              📅 Mes réservations
            </Link>
            <Link
              href="/client/login"
              className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-semibold text-pink-700 shadow-lg hover-lift hover:shadow-xl transition-all"
            >
              👤 Connexion client
            </Link>
            <Link
              href="/pro/login"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover-lift hover:shadow-xl transition-all animate-pulse-glow"
            >
              ⚡ Espace pro
            </Link>
          </div>
        </header>

        <main className="grid flex-1 gap-6 sm:gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <section className="rounded-3xl glass p-4 sm:p-6 shadow-2xl border-2 border-purple-200/50 hover-lift">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🔍 Trouver un professionnel
            </h2>
            <p className="mt-2 text-sm text-zinc-600 font-medium">
              Choisis ta ville et le service dont tu as besoin ✨
            </p>

            <form onSubmit={handleSearch} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Ville
                </label>
                <select
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none ring-0 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50 hover:border-purple-300"
                >
                  <option value="">Toutes les villes</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Type de service
                </label>
                <select
                  id="service"
                  value={service}
                  onChange={(e) => {
                    setService(e.target.value);
                    setSubcategory(""); // Reset subcategory when service changes
                  }}
                  className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none ring-0 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50 hover:border-purple-300"
                >
                  <option value="">Tous les services</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {service && SERVICE_SUBCATEGORIES[service] && (
                <div className="space-y-2">
                  <label
                    htmlFor="subcategory"
                    className="block text-sm font-medium text-zinc-800"
                  >
                    Sous-catégorie ({service})
                  </label>
                  <select
                    id="subcategory"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="block w-full rounded-xl glass border-2 border-pink-200/50 px-3 py-2 text-sm shadow-lg outline-none ring-0 transition-all focus:border-pink-500 focus:ring-2 focus:ring-pink-300/50 hover:border-pink-300"
                  >
                    <option value="">Toutes les sous-catégories</option>
                    {SERVICE_SUBCATEGORIES[service].map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-800">
                  Trier par
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none ring-0 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50 hover:border-purple-300"
                >
                  <option value="name">Nom (A-Z)</option>
                  <option value="rating">Meilleure note</option>
                  <option value="reviews">Plus d'avis</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="availableToday"
                  checked={availableToday}
                  onChange={(e) => setAvailableToday(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <label htmlFor="availableToday" className="text-sm text-zinc-700">
                  Disponible aujourd'hui
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all disabled:cursor-not-allowed disabled:opacity-70 animate-gradient"
              >
                {loading ? "🔍 Recherche en cours..." : "🚀 Rechercher des professionnels"}
              </button>
            </form>
          </section>

          <section className="flex flex-col rounded-3xl glass p-4 sm:p-6 shadow-2xl border-2 border-pink-200/50">
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              📋 Résultats de la recherche
            </h2>
            <p className="mt-2 text-sm text-zinc-600 font-medium">
              Sélectionne un pro pour voir ses créneaux ✨
            </p>

            <div className="mt-4 flex-1 space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
              {!hasSearched && (
                <div className="rounded-2xl glass border-2 border-dashed border-purple-300/50 px-4 py-6 text-sm text-zinc-600 font-medium text-center">
                  🎯 Lance une recherche pour voir les professionnels disponibles ✨
                  <p className="mt-2 text-xs text-zinc-400">
                    Sélectionne une ville et un service pour commencer
                  </p>
                </div>
              )}

              {hasSearched && !loading && results.length === 0 && (
                <div className="rounded-2xl glass border-2 border-pink-300/50 px-4 py-6 text-sm text-zinc-600 font-medium text-center">
                  😔 Aucun professionnel trouvé avec ces critères pour le moment
                </div>
              )}

              {results.map((pro) => (
                <div key={pro.id}>
                  <article
                    className="group flex flex-col gap-2 rounded-2xl glass px-4 py-4 text-sm shadow-lg hover-lift border-2 border-purple-200/30 hover:border-purple-400/50 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/professionals/${pro.id}`}
                            className="block"
                          >
                            <h3 className="text-sm font-semibold text-zinc-900 hover:text-zinc-700 transition">
                              {pro.name}
                            </h3>
                          </Link>
                          {"verified" in pro && (pro as any).verified && (
                            <span className="text-xs text-blue-600">✓</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 truncate">
                          {pro.service} · {pro.city}
                        </p>
                        {"averageRating" in pro && (pro as any).averageRating > 0 && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-xs font-medium text-amber-600">
                              ⭐ {(pro as any).averageRating.toFixed(1)}
                            </span>
                            <span className="text-xs text-zinc-400">
                              ({(pro as any).totalReviews || 0} avis)
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <button
                          onClick={() => {
                            // Si on clique sur un autre pro, réinitialiser le formulaire
                            if (selectedPro?.id !== pro.id) {
                              setClientName("");
                              setClientEmail("");
                              setDate("");
                              setStartTime("");
                              setEndTime("");
                              setAvailableSlots([]);
                              setOccupiedSlots([]);
                              setBookingMessage(null);
                            }
                            setSelectedPro(pro);
                            // Scroll to booking form after a short delay
                            setTimeout(() => {
                              const element = document.getElementById(`booking-form-${pro.id}`);
                              element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }, 100);
                          }}
                          className={`rounded-full px-3 py-2 text-xs font-bold text-white shadow-lg hover-lift hover:shadow-xl transition-all whitespace-nowrap ${
                            selectedPro?.id === pro.id
                              ? "bg-gradient-to-r from-purple-500 to-pink-500"
                              : "bg-gradient-to-r from-emerald-400 to-teal-500"
                          }`}
                        >
                          {selectedPro?.id === pro.id ? "✓ Sélectionné" : "✨ Réserver"}
                        </button>
                        <FavoriteButton professionalId={pro.id} />
                      </div>
                    </div>
                    {pro.description && (
                      <p className="text-xs text-zinc-600 line-clamp-2">{pro.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/professionals/${pro.id}`}
                        className="text-[11px] text-zinc-500 hover:text-zinc-700 transition"
                      >
                        Voir le profil →
                      </Link>
                    </div>
                  </article>
                  
                  {/* Formulaire de réservation affiché directement sous le professionnel sélectionné */}
                  {selectedPro?.id === pro.id && (
                    <div id={`booking-form-${pro.id}`} className="mt-4 rounded-3xl glass p-4 sm:p-6 text-sm shadow-2xl border-2 border-purple-200/50 animate-fade-in">
                      <h3 className="text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        📅 Demande de rendez-vous avec {selectedPro.name}
                      </h3>
                      <p className="mt-2 text-xs text-zinc-600 font-medium">
                        Remplis tes informations et le créneau souhaité. Le
                        professionnel confirmera ensuite le rendez-vous.
                      </p>
                      <p className="mt-3 text-xs font-bold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl px-3 py-2 sm:px-4 sm:py-3 border-2 border-purple-200/50">
                        💳 Le paiement se fera sur place au moment de la prestation.
                      </p>

                      <form
                        onSubmit={handleCreateBooking}
                        className="mt-4 grid gap-3 sm:grid-cols-2"
                      >
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-medium text-zinc-800">
                            Ton nom
                          </label>
                          <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            required
                            className="w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                            placeholder="Jean Dupont"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-medium text-zinc-800">
                            Ton email
                          </label>
                          <input
                            type="email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            required
                            className="w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                            placeholder="jean@example.com"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-medium text-zinc-800">
                            Date souhaitée
                          </label>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => {
                              handleDateChange(e.target.value);
                            }}
                            required
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                          />
                        </div>

                        {date && (
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-xs font-medium text-zinc-800">
                              Créneaux disponibles
                              {loadingSlots && <span className="ml-2 text-zinc-400">(chargement...)</span>}
                            </label>
                            {loadingSlots ? (
                              <div className="text-xs text-zinc-500 flex items-center gap-2">
                                <span className="animate-spin">⏳</span>
                                Chargement des créneaux disponibles...
                              </div>
                            ) : availableSlots.length > 0 ? (
                              <select
                                value={startTime && endTime ? `${startTime}-${endTime}` : ""}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const [start, end] = e.target.value.split("-");
                                    setStartTime(start);
                                    setEndTime(end);
                                  } else {
                                    setStartTime("");
                                    setEndTime("");
                                  }
                                }}
                                required
                                className="w-full rounded-xl glass border-2 border-purple-200/50 px-3 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
                              >
                                <option value="">Sélectionne un créneau</option>
                                {availableSlots.map((slot) => {
                                  const [start, end] = slot.split("-");
                                  return (
                                    <option key={slot} value={slot}>
                                      {start} - {end}
                                    </option>
                                  );
                                })}
                              </select>
                            ) : (
                              <div className="text-xs text-zinc-500 bg-amber-50 border-2 border-amber-200 rounded-xl px-3 py-2">
                                ⚠️ Aucun créneau disponible pour cette date. Choisis une autre date ou contacte le professionnel.
                              </div>
                            )}
                          </div>
                        )}

                        <div className="sm:col-span-2 flex flex-col gap-2">
                          <button
                            type="submit"
                            disabled={bookingLoading || !date || !startTime || !clientName || !clientEmail}
                            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all disabled:cursor-not-allowed disabled:opacity-70 animate-gradient"
                          >
                            {bookingLoading
                              ? "⏳ Envoi en cours..."
                              : "✨ Confirmer la demande"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPro(null);
                              setClientName("");
                              setClientEmail("");
                              setDate("");
                              setStartTime("");
                              setEndTime("");
                              setAvailableSlots([]);
                              setOccupiedSlots([]);
                              setBookingMessage(null);
                            }}
                            className="inline-flex w-full items-center justify-center rounded-full glass border-2 border-purple-200/50 px-4 py-2 text-sm font-bold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
                          >
                            Annuler
                          </button>
                        </div>
                      </form>

                      {bookingMessage && (
                        <div
                          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium animate-fade-in ${
                            bookingMessage.includes("succès") || bookingMessage.includes("✅")
                              ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200"
                              : "bg-red-50 text-red-700 border-2 border-red-200"
                          }`}
                        >
                          {bookingMessage}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
        </div>
          </section>
      </main>
      </div>
    </div>
  );
}
