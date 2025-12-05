/**
 * Schémas de validation Zod pour les APIs
 * Validation server-side pour sécuriser les données
 */

import { z } from "zod";

// ============================================
// VALIDATION AUTHENTIFICATION
// ============================================

export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe minimum 6 caractères"),
});

export const clientRegisterSchema = z.object({
    name: z.string().min(2, "Nom minimum 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe minimum 6 caractères"),
});

export const proRegisterSchema = z.object({
    firstName: z.string().min(2, "Prénom minimum 2 caractères"),
    lastName: z.string().min(2, "Nom minimum 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe minimum 6 caractères"),
    phone: z.string().optional(),
    city: z.string().min(1, "Ville requise"),
    serviceType: z.string().min(1, "Type de service requis"),
    description: z.string().optional(),
    teoudatZeout: z.string().min(1, "Teoudat Zeoute requise"),
    languages: z.string().default("fr"),
});

// ============================================
// VALIDATION RÉSERVATIONS
// ============================================

export const bookingSchema = z.object({
    professionalId: z.number().int().positive("ID professionnel invalide"),
    clientName: z.string().min(2, "Nom client minimum 2 caractères"),
    clientEmail: z.string().email("Email client invalide"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format date invalide (YYYY-MM-DD)"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format heure invalide (HH:MM)"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Format heure invalide (HH:MM)"),
}).refine(
    (data) => {
        // Vérifier que endTime > startTime
        const [startH, startM] = data.startTime.split(":").map(Number);
        const [endH, endM] = data.endTime.split(":").map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        return endMinutes > startMinutes;
    },
    {
        message: "L'heure de fin doit être après l'heure de début",
        path: ["endTime"],
    }
);

// ============================================
// VALIDATION AVIS
// ============================================

export const reviewSchema = z.object({
    professionalId: z.number().int().positive(),
    bookingId: z.number().int().positive(),
    rating: z.number().int().min(1, "Note minimum 1").max(5, "Note maximum 5"),
    comment: z.string().min(10, "Commentaire minimum 10 caractères").max(500, "Commentaire maximum 500 caractères").optional(),
});

// ============================================
// VALIDATION MOT DE PASSE
// ============================================

export const passwordResetSchema = z.object({
    email: z.string().email("Email invalide"),
});

export const passwordResetConfirmSchema = z.object({
    token: z.string().min(1, "Token requis"),
    password: z.string().min(6, "Mot de passe minimum 6 caractères"),
});

// ============================================
// HELPER FUNCTION
// ============================================

/**
 * Valide les données avec un schéma Zod
 * Retourne { success: true, data } ou { success: false, error }
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown):
    | { success: true; data: T }
    | { success: false; error: string; errors: z.ZodError } {

    try {
        const validated = schema.parse(data);
        return { success: true, data: validated };
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Formater les erreurs pour l'utilisateur
            const firstError = error.errors[0];
            const message = firstError.message;

            return {
                success: false,
                error: message,
                errors: error,
            };
        }

        return {
            success: false,
            error: "Validation échouée",
            errors: error as z.ZodError,
        };
    }
}

// ============================================
// TYPES TYPESCRIPT
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type ClientRegisterInput = z.infer<typeof clientRegisterSchema>;
export type ProRegisterInput = z.infer<typeof proRegisterSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>;
