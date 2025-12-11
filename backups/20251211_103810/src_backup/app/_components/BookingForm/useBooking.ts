/**
 * Hook pour gérer la logique de réservation
 */

import { useState, useCallback } from "react";
import { useToast } from "@/components/ToastProvider";
import type { Professional } from "@/types/professional";

export function useBooking() {
    const toast = useToast();
    const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingMessage, setBookingMessage] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [occupiedSlots, setOccupiedSlots] = useState<Array<{ start: string, end: string }>>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

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
                const slots = slotsData.slots || slotsData.availableSlots || [];
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
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(String(error));
            console.error("Erreur lors du chargement des créneaux", err);
            toast.showToast("Erreur lors du chargement des créneaux disponibles", "error");
            setAvailableSlots([]);
            setOccupiedSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    }, [toast]);

    const createBooking = useCallback(async () => {
        if (!selectedPro) return false;

        // Validation
        if (!clientName.trim() || !clientEmail.trim() || !date || !startTime || !endTime) {
            setBookingMessage("❌ Veuillez remplir tous les champs obligatoires.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clientEmail)) {
            setBookingMessage("❌ Veuillez entrer une adresse email valide.");
            return false;
        }

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            setBookingMessage("❌ La date ne peut pas être dans le passé.");
            return false;
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
            const successMessage = data.message || "Rendez-vous créé avec succès !";
            setBookingMessage(successMessage);
            toast.showToast(successMessage, "success");

            return true;
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(String(error));
            const errorMessage = err.message || "Impossible de créer le rendez-vous.";
            setBookingMessage(`❌ ${errorMessage}`);
            toast.showToast(errorMessage, "error");
            return false;
        } finally {
            setBookingLoading(false);
        }
    }, [selectedPro, clientName, clientEmail, date, startTime, endTime, toast]);

    const resetBookingForm = useCallback(() => {
        setDate("");
        setStartTime("");
        setEndTime("");
        setAvailableSlots([]);
        setOccupiedSlots([]);
        setBookingMessage(null);
    }, []);

    const selectSlot = useCallback((slotTime: string) => {
        if (slotTime.includes("-")) {
            const [start, end] = slotTime.split("-");
            setStartTime(start);
            setEndTime(end);
        } else {
            const [hours, minutes] = slotTime.split(":").map(Number);
            const endDate = new Date();
            endDate.setHours(hours, minutes + 30, 0, 0);
            const endTimeStr = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
            setStartTime(slotTime);
            setEndTime(endTimeStr);
        }
    }, []);

    return {
        selectedPro,
        setSelectedPro,
        clientName,
        setClientName,
        clientEmail,
        setClientEmail,
        date,
        setDate,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        bookingLoading,
        bookingMessage,
        setBookingMessage,
        availableSlots,
        occupiedSlots,
        loadingSlots,
        loadAvailableSlots,
        createBooking,
        resetBookingForm,
        selectSlot,
    };
}
