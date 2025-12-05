/**
 * Hook pour gérer la recherche et le chargement des professionnels
 */

import { useState, useCallback } from "react";
import type { Professional } from "@/types/professional";

// Données mockées de secours
const FALLBACK_PROS: Professional[] = [
    {
        id: 1,
        name: "Sarah Coiffure",
        city: "Tel Aviv",
        serviceType: "Coiffeur",
        languages: "Français, Hébreu",
        description: "Spécialisée en coupes modernes et coloration.",
    },
    {
        id: 2,
        name: "Dr Cohen",
        city: "Jérusalem",
        serviceType: "Médecin",
        languages: "Français, Anglais",
        description: "Médecin généraliste, suivi famille et enfants.",
    },
];

interface SearchParams {
    city?: string;
    service?: string;
    subcategory?: string;
    availableToday?: boolean;
    sortBy?: string;
    keyword?: string;
    page?: number;
}

export function useProfessionals() {
    const [results, setResults] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const loadDefaultProfessionals = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/professionals?page=1&limit=20`);

            if (!response.ok) {
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

            const professionals = Array.isArray(data) ? data : (data.professionals || []);
            setResults(professionals);
            setTotalPages(data.pagination?.totalPages || 1);
            setTotalResults(data.pagination?.total || professionals.length);
            setHasSearched(true);
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(String(error));
            console.warn("Erreur chargement pros par défaut:", err.message);
            setResults(FALLBACK_PROS.slice(0, 20));
            setTotalPages(1);
            setTotalResults(FALLBACK_PROS.length);
            setHasSearched(true);
        } finally {
            setLoading(false);
        }
    }, []);

    const searchProfessionals = useCallback(async (params: SearchParams) => {
        setHasSearched(true);
        setLoading(true);
        const page = params.page || 1;
        setCurrentPage(page);

        try {
            const searchParams = new URLSearchParams();
            if (params.city) searchParams.append("city", params.city);
            if (params.service) searchParams.append("service", params.service);
            if (params.subcategory) searchParams.append("subcategory", params.subcategory);
            if (params.availableToday) searchParams.append("availableToday", "true");
            if (params.sortBy) searchParams.append("sortBy", params.sortBy);
            if (params.keyword) searchParams.append("keyword", params.keyword);
            searchParams.append("page", page.toString());
            searchParams.append("limit", "20");

            const response = await fetch(`/api/professionals?${searchParams.toString()}`, {
                cache: "force-cache",
            });

            if (!response.ok) throw new Error("Erreur API");

            const data = await response.json();
            const professionals = Array.isArray(data) ? data : (data.professionals || []);
            setResults(professionals);
            setTotalPages(data.pagination?.totalPages || 1);
            setTotalResults(data.pagination?.total || professionals.length);
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(String(error));
            console.error("Erreur recherche professionnels:", err);

            // Fallback avec filtrage local
            const filtered = FALLBACK_PROS.filter((pro) => {
                const matchCity = params.city ? pro.city === params.city : true;
                const matchService = params.service ? pro.serviceType === params.service : true;
                return matchCity && matchService;
            });
            setResults(filtered);
            setTotalPages(1);
            setTotalResults(filtered.length);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        results,
        loading,
        hasSearched,
        currentPage,
        totalPages,
        totalResults,
        loadDefaultProfessionals,
        searchProfessionals,
    };
}
