"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FavoriteButton } from "./FavoriteButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CITIES, SERVICES, SERVICE_SUBCATEGORIES } from "@/app/pro/register/constants";
import { useToast } from "@/components/ToastProvider";
import { Logo } from "@/components/Logo";
import { generateSlug } from "@/lib/slug";

// Fonction pour obtenir le slug d'un professionnel
function getProfessionalSlug(pro: any): string {
  if (pro.slug) return pro.slug;
  return generateSlug(pro.name);
}

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
  const toast = useToast();
  const searchParams = useSearchParams();
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [availableToday, setAvailableToday] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Professional[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
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
  
  async function loadDefaultProfessionals() {
    setLoading(true);
    try {
      const response = await fetch(`/api/professionals?page=1&limit=20`);
      
      if (!response.ok) {
        // Si l'API retourne une erreur, utiliser les données fallback
        console.warn("API non disponible, utilisation des données fallback");
        setResults(FALLBACK_PROS.slice(0, 20));
        setTotalPages(1);
        setTotalResults(FALLBACK_PROS.length);
        setHasSearched(true);
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Erreur parsing JSON:", parseError);
        setResults(FALLBACK_PROS.slice(0, 20));
        setTotalPages(1);
        setTotalResults(FALLBACK_PROS.length);
        setHasSearched(true);
        return;
      }
      
      // Gérer les deux formats possibles : {professionals: [...]} ou [...]
      const professionals = Array.isArray(data) ? data : (data.professionals || []);
      setResults(professionals);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalResults(data.pagination?.total || professionals.length);
      setHasSearched(true);
    } catch (error: any) {
      // Erreur réseau ou autre - utiliser les données fallback silencieusement
      console.warn("Erreur chargement pros par défaut, utilisation fallback:", error.message);
      setResults(FALLBACK_PROS.slice(0, 20));
      setTotalPages(1);
      setTotalResults(FALLBACK_PROS.length);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }

  const loadAvailableSlots = useCallback(async (proSlug: string, selectedDate: string) => {
    if (!selectedDate || !proSlug) {
      setAvailableSlots([]);
      setOccupiedSlots([]);
      return;
    }

    setLoadingSlots(true);
    try {
      const slotsResponse = await fetch(
        `/api/professionals/${proSlug}/slots?date=${selectedDate}`
      );
      if (slotsResponse.ok) {
        const slotsData = await slotsResponse.json();
        const slots = slotsData.availableSlots || [];
        setAvailableSlots(slots);
        if (slots.length === 0) {
          toast.showToast("Aucun créneau disponible pour cette date", "info");
        }
      } else {
        const errorData = await slotsResponse.json().catch(() => ({}));
        console.error("Erreur slots:", errorData);
        setAvailableSlots([]);
        toast.showToast("Erreur lors du chargement des créneaux", "error");
      }

      const occupiedResponse = await fetch(
        `/api/professionals/${proSlug}/availability?date=${selectedDate}`
      );
      if (occupiedResponse.ok) {
        const occupiedData = await occupiedResponse.json();
        setOccupiedSlots(occupiedData.occupiedSlots || []);
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement des créneaux", error);
      toast.showToast("Erreur lors du chargement des créneaux disponibles", "error");
      setAvailableSlots([]);
      setOccupiedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [toast]);

  // Charger des pros par défaut au chargement et gérer proSlug dans l'URL
  useEffect(() => {
    loadDefaultProfessionals();
  }, []);

  // Gérer proSlug dans l'URL après le chargement des pros
  useEffect(() => {
    const proSlug = searchParams.get("proSlug");
    if (proSlug && results.length > 0) {
      const pro = results.find((p) => getProfessionalSlug(p) === proSlug);
      if (pro && (!selectedPro || getProfessionalSlug(selectedPro) !== proSlug)) {
        setSelectedPro(pro);
      }
    }
  }, [searchParams, results, selectedPro]);

  // Charger les créneaux quand un pro est sélectionné et qu'une date existe
  useEffect(() => {
    if (selectedPro && date) {
      loadAvailableSlots(getProfessionalSlug(selectedPro), date);
    } else if (!date) {
      setAvailableSlots([]);
      setOccupiedSlots([]);
    }
  }, [selectedPro?.id, date, loadAvailableSlots]);

  async function handleSearch(e?: React.FormEvent, page: number = 1) {
    if (e) e.preventDefault();
    setHasSearched(true);
    setLoading(true);
    setCurrentPage(page);

    try {
      const params = new URLSearchParams();
      if (city) params.append("city", city);
      if (service) params.append("service", service);
      if (subcategory) params.append("subcategory", subcategory);
      if (availableToday) params.append("availableToday", "true");
      if (sortBy) params.append("sortBy", sortBy);
      if (keyword) params.append("keyword", keyword);
      params.append("page", page.toString());
      params.append("limit", "20");

      const response = await fetch(`/api/professionals?${params.toString()}`, {
        cache: "force-cache", // Utiliser le cache du navigateur
      });
      if (!response.ok) throw new Error("Erreur API");

      const data = await response.json();
      // Gérer les deux formats possibles : {professionals: [...]} ou [...]
      const professionals = Array.isArray(data) ? data : (data.professionals || []);
      setResults(professionals);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalResults(data.pagination?.total || professionals.length);
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
    } catch (error: any) {
      console.error("Erreur recherche professionnels:", error);
      toast.showToast("Erreur lors de la recherche. Réessaye plus tard.", "error");
      const filtered = FALLBACK_PROS.filter((pro) => {
        const matchCity = city ? pro.city === city : true;
        const matchService = service ? pro.service === service : true;
        return matchCity && matchService;
      });
      setResults(filtered);
      setTotalPages(1);
      setTotalResults(filtered.length);
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

    // Validation de la date (ne doit pas être dans le passé)
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setBookingMessage("❌ La date ne peut pas être dans le passé.");
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
      const successMessage = data.message || "Rendez-vous créé avec succès ! Le professionnel recevra la demande de confirmation. 💳 Le paiement se fera sur place au moment de la prestation.";
      setBookingMessage(successMessage);
      toast.showToast(successMessage, "success");
      
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
      const errorMessage = error.message || "Impossible de créer le rendez-vous. Réessaie plus tard.";
      setBookingMessage(`❌ ${errorMessage}`);
      toast.showToast(errorMessage, "error");
    } finally {
      setBookingLoading(false);
    }
  }

  function handleDateChange(newDate: string) {
    setDate(newDate);
    setStartTime("");
    setEndTime("");
    setBookingMessage(null); // Effacer les messages précédents
    if (selectedPro && newDate) {
      // Charger les créneaux immédiatement
      loadAvailableSlots(getProfessionalSlug(selectedPro), newDate);
    } else {
      setAvailableSlots([]);
      setOccupiedSlots([]);
    }
  }

  // Charger les créneaux quand un pro est sélectionné et qu'une date existe
  useEffect(() => {
    if (selectedPro && date) {
      loadAvailableSlots(getProfessionalSlug(selectedPro), date);
    } else if (!date) {
      setAvailableSlots([]);
      setOccupiedSlots([]);
    }
  }, [selectedPro?.id, date, loadAvailableSlots]);

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
    <div className="min-h-screen font-sans text-zinc-900" style={{ background: "linear-gradient(to bottom right, #f0f9f7, #fffef0, #f0f4f8)" }}>
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ backgroundColor: "#2FB190" }}></div>
        <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ backgroundColor: "#FFDE59", animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ backgroundColor: "#18223b", animationDelay: '4s' }}></div>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 sm:mb-8 flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
          <div>
            <Logo className="mb-2" />
            <p className="mt-3 text-sm text-zinc-600 font-medium" role="doc-subtitle">
              La plateforme de réservation en Israel<br />Pour les Français.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ThemeToggle />
            <Link
              href="/my-bookings"
              className="inline-flex items-center justify-center rounded-full glass px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold shadow-lg hover-lift hover:shadow-xl transition-all"
              style={{ color: "#18223b", backgroundColor: "rgba(255, 255, 255, 0.8)", border: "1px solid #2FB190" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#2FB190"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; e.currentTarget.style.color = "#18223b"; }}
            >
              <span className="hidden sm:inline">📅 </span>Mes réservations
            </Link>
            <Link
              href="/my-favorites"
              className="inline-flex items-center justify-center rounded-full glass px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold shadow-lg hover-lift hover:shadow-xl transition-all"
              style={{ color: "#18223b", backgroundColor: "rgba(255, 255, 255, 0.8)", border: "1px solid #2FB190" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#2FB190"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; e.currentTarget.style.color = "#18223b"; }}
            >
              <span className="hidden sm:inline">⭐ </span>Favoris
            </Link>
            <Link
              href="/client/login"
              className="inline-flex items-center justify-center rounded-full glass px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold shadow-lg hover-lift hover:shadow-xl transition-all"
              style={{ color: "#18223b", backgroundColor: "rgba(255, 255, 255, 0.8)", border: "1px solid #2FB190" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#2FB190"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; e.currentTarget.style.color = "#18223b"; }}
            >
              <span className="hidden sm:inline">👤 </span>Connexion
            </Link>
            <Link
              href="/pro/login"
              className="inline-flex items-center justify-center rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-lg hover-lift hover:shadow-xl transition-all"
              style={{ background: "linear-gradient(135deg, #18223b 0%, #2FB190 100%)" }}
            >
              <span className="hidden sm:inline">⚡ </span>Espace pro
            </Link>
          </div>
        </header>

        <main className="grid flex-1 gap-4 sm:gap-6 lg:gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <section className="rounded-2xl sm:rounded-3xl glass p-3 sm:p-4 lg:p-6 shadow-2xl hover-lift" style={{ border: "2px solid #2FB190" }}>
            <h2 className="text-lg sm:text-xl font-bold" style={{ color: "#18223b" }}>
              🔍 Trouver un professionnel
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-zinc-600 font-medium" id="search-description">
              Choisis ta ville et le service dont tu as besoin ✨
            </p>

            <form onSubmit={handleSearch} className="mt-6 space-y-5" aria-labelledby="search-description">
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
                  className="block w-full rounded-lg sm:rounded-xl glass border-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg outline-none ring-0 transition-all"
                  style={{ borderColor: "#2FB190" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47, 177, 144, 0.2)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "none"; }}
                  onMouseEnter={(e) => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = "#18223b"; }}
                  onMouseLeave={(e) => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = "#2FB190"; }}
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
                  className="block w-full rounded-lg sm:rounded-xl glass border-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg outline-none ring-0 transition-all"
                  style={{ borderColor: "#2FB190" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47, 177, 144, 0.2)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "none"; }}
                  onMouseEnter={(e) => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = "#18223b"; }}
                  onMouseLeave={(e) => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = "#2FB190"; }}
                >
                  <option value="">Tous les services</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="keyword"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Recherche par mots-clés
                </label>
                <input
                  id="keyword"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ex: spécialisé, expérimenté, moderne..."
                  className="block w-full rounded-lg sm:rounded-xl glass border-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg outline-none ring-0 transition-all"
                  style={{ borderColor: "#2FB190" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47, 177, 144, 0.2)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "none"; }}
                  onMouseEnter={(e) => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = "#18223b"; }}
                  onMouseLeave={(e) => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = "#2FB190"; }}
                />
                <p className="text-xs text-zinc-500">
                  Recherche dans les descriptions des professionnels
                </p>
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
                    className="block w-full rounded-xl glass border-2 border-2 px-3 py-2 text-sm shadow-lg outline-none ring-0 transition-all focus:border-pink-500 focus:ring-2 focus:ring-pink-300/50 hover:border-pink-300"
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
                  className="block w-full rounded-lg sm:rounded-xl glass border-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg outline-none ring-0 transition-all"
                  style={{ borderColor: "#2FB190" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47, 177, 144, 0.2)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "none"; }}
                  onMouseEnter={(e) => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = "#18223b"; }}
                  onMouseLeave={(e) => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = "#2FB190"; }}
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
                className="mt-2 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all disabled:cursor-not-allowed disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #18223b 0%, #2FB190 100%)" }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "linear-gradient(135deg, #2FB190 0%, #FFDE59 100%)"; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "linear-gradient(135deg, #18223b 0%, #2FB190 100%)"; }}
              >
                {loading ? "🔍 Recherche en cours..." : "🚀 Rechercher des professionnels"}
              </button>
            </form>
          </section>

          <section className="flex flex-col rounded-3xl glass p-4 sm:p-6 shadow-2xl border-2" style={{ borderColor: "#2FB190" }}>
            <h2 className="text-xl font-bold" style={{ color: "#18223b" }}>
              📋 Résultats de la recherche
            </h2>
            <p className="mt-2 text-sm text-zinc-600 font-medium">
              Sélectionne un pro pour voir ses créneaux ✨
            </p>

            <div className="mt-4 flex-1 space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
              {!hasSearched && (
                <div className="rounded-2xl glass border-2 border-dashed px-4 py-6 text-sm text-zinc-600 font-medium text-center" style={{ borderColor: "#2FB190" }}>
                  🎯 Lance une recherche pour voir les professionnels disponibles ✨
                  <p className="mt-2 text-xs text-zinc-400">
                    Sélectionne une ville et un service pour commencer
                  </p>
                </div>
              )}

              {hasSearched && !loading && results.length === 0 && (
                <div className="rounded-2xl glass border-2 px-4 py-6 text-sm text-zinc-600 font-medium text-center" style={{ borderColor: "#FFDE59" }}>
                  😔 Aucun professionnel trouvé avec ces critères pour le moment
                </div>
              )}

              {results.map((pro) => (
                <div key={pro.id}>
                  <article
                    className="group flex flex-col gap-2 rounded-2xl glass px-4 py-4 text-sm shadow-lg hover-lift border-2 transition-all"
                    style={{ borderColor: "#2FB190" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(47, 177, 144, 0.2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"; }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/professionals/${getProfessionalSlug(pro)}`}
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
                            // Si une date est déjà sélectionnée, charger les créneaux
                            if (date) {
                              loadAvailableSlots(getProfessionalSlug(pro), date);
                            }
                            // Scroll to booking form after a short delay
                            setTimeout(() => {
                              const element = document.getElementById(`booking-form-${pro.id}`);
                              element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }, 100);
                          }}
                          className="rounded-full px-3 py-2 text-xs font-bold text-white shadow-lg hover-lift hover:shadow-xl transition-all whitespace-nowrap"
                          style={{
                            background: selectedPro?.id === pro.id
                              ? "linear-gradient(135deg, #18223b 0%, #2FB190 100%)"
                              : "linear-gradient(135deg, #2FB190 0%, #FFDE59 100%)"
                          }}
                          onMouseEnter={(e) => {
                            if (selectedPro?.id !== pro.id) {
                              e.currentTarget.style.background = "linear-gradient(135deg, #2FB190 0%, #18223b 100%)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedPro?.id !== pro.id) {
                              e.currentTarget.style.background = "linear-gradient(135deg, #2FB190 0%, #FFDE59 100%)";
                            }
                          }}
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
                        href={`/professionals/${getProfessionalSlug(pro)}`}
                        className="text-[11px] text-zinc-500 hover:text-zinc-700 transition"
                      >
                        Voir le profil →
                      </Link>
                    </div>
                  </article>
                  
                  {/* Formulaire de réservation affiché directement sous le professionnel sélectionné */}
                  {selectedPro?.id === pro.id && (
                    <div id={`booking-form-${pro.id}`} className="mt-3 sm:mt-4 rounded-2xl sm:rounded-3xl glass p-3 sm:p-4 lg:p-6 text-xs sm:text-sm shadow-2xl border-2 animate-fade-in" style={{ borderColor: "#2FB190" }}>
                      <h3 className="text-sm sm:text-base font-bold" style={{ color: "#18223b" }}>
                        📅 Demande de rendez-vous avec {selectedPro.name}
                      </h3>
                      <p className="mt-1 sm:mt-2 text-xs text-zinc-600 font-medium">
                        Remplis tes informations et le créneau souhaité. Le
                        professionnel confirmera ensuite le rendez-vous.
                      </p>
                      <p className="mt-2 sm:mt-3 text-xs font-bold rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 lg:px-4 lg:py-3 border-2" style={{ color: "#18223b", backgroundColor: "#FFDE59", borderColor: "#2FB190" }}>
                        💳 Le paiement se fera sur place au moment de la prestation.
                      </p>

                      <form
                        onSubmit={handleCreateBooking}
                        className="mt-3 sm:mt-4 grid gap-2 sm:gap-3 sm:grid-cols-2"
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
                            className="w-full rounded-lg sm:rounded-xl glass border-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg outline-none transition-all"
                            style={{ borderColor: "#2FB190" }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47, 177, 144, 0.2)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "none"; }}
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
                            className="w-full rounded-xl glass border-2 px-3 py-2 text-sm shadow-lg outline-none transition-all"
                            style={{ borderColor: "#2FB190" }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47, 177, 144, 0.2)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "none"; }}
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
                            className="w-full rounded-xl glass border-2 px-3 py-2 text-sm shadow-lg outline-none transition-all"
                            style={{ borderColor: "#2FB190" }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47, 177, 144, 0.2)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "none"; }}
                          />
                        </div>

                        {date && (
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-xs font-medium text-zinc-800 flex items-center gap-2">
                              <span>Créneaux disponibles</span>
                              {loadingSlots && (
                                <span className="text-zinc-400 text-xs flex items-center gap-1">
                                  <span className="animate-spin">⏳</span>
                                  <span className="hidden sm:inline">chargement...</span>
                                </span>
                              )}
                            </label>
                            {loadingSlots ? (
                              <div className="text-xs text-zinc-500 flex items-center gap-2 py-3">
                                <span className="animate-spin">⏳</span>
                                <span>Chargement des créneaux disponibles...</span>
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
                                className="w-full rounded-lg sm:rounded-xl glass border-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg outline-none transition-all"
                                style={{ borderColor: "#2FB190" }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "#18223b"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(47, 177, 144, 0.2)"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "#2FB190"; e.currentTarget.style.boxShadow = "none"; }}
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
                            ) : date ? (
                              <div className="text-xs text-zinc-600 bg-amber-50 border-2 border-amber-200 rounded-lg sm:rounded-xl px-2 sm:px-3 py-2">
                                ⚠️ Aucun créneau disponible pour cette date. Choisis une autre date ou contacte le professionnel.
                              </div>
                            ) : null}
                          </div>
                        )}

                        <div className="sm:col-span-2 flex flex-col gap-2">
                          <button
                            type="submit"
                            disabled={bookingLoading || !date || !startTime || !clientName || !clientEmail}
                            className="mt-2 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-bold text-white shadow-xl hover-lift hover:shadow-2xl transition-all disabled:cursor-not-allowed disabled:opacity-70"
                            style={{ background: "linear-gradient(135deg, #18223b 0%, #2FB190 100%)" }}
                            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "linear-gradient(135deg, #2FB190 0%, #FFDE59 100%)"; }}
                            onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "linear-gradient(135deg, #18223b 0%, #2FB190 100%)"; }}
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
                            className="inline-flex w-full items-center justify-center rounded-full glass border-2 px-4 py-2 text-sm font-bold shadow-lg hover-lift hover:shadow-xl transition-all"
                            style={{ color: "#18223b", borderColor: "#2FB190" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#2FB190"; e.currentTarget.style.color = "white"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; e.currentTarget.style.color = "#18223b"; }}
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
              
              {/* Pagination */}
              {hasSearched && !loading && results.length > 0 && totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleSearch(undefined, currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-full glass border-2 text-sm font-semibold shadow-lg hover-lift hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ color: "#18223b", borderColor: "#2FB190" }}
                    onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.backgroundColor = "#2FB190"; e.currentTarget.style.color = "white"; } }}
                    onMouseLeave={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; e.currentTarget.style.color = "#18223b"; } }}
                  >
                    ← Précédent
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handleSearch(undefined, pageNum)}
                          className={`px-3 py-2 rounded-full text-sm font-semibold transition ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                              : "glass border-2 border-2 text-purple-700 hover-lift"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handleSearch(undefined, currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 rounded-full glass border-2 text-sm font-semibold shadow-lg hover-lift hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ color: "#18223b", borderColor: "#2FB190" }}
                    onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.backgroundColor = "#2FB190"; e.currentTarget.style.color = "white"; } }}
                    onMouseLeave={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; e.currentTarget.style.color = "#18223b"; } }}
                  >
                    Suivant →
                  </button>
                  
                  <div className="text-xs text-zinc-500 ml-2">
                    Page {currentPage} sur {totalPages} ({totalResults} résultats)
                  </div>
                </div>
              )}
        </div>
          </section>
      </main>
      </div>
    </div>
  );
}
