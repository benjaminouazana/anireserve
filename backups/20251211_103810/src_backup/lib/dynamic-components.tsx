/**
 * Composants dynamiques avec lazy loading pour optimiser les performances mobile
 * Utilisé pour les composants lourds qui ne sont pas toujours visibles
 */

import dynamic from 'next/dynamic';

// ============================================  
// COMPOSANTS DE RÉSERVATION (Lourds)
// ============================================

/**
 * BookingForm - Formulaire de réservation complet
 * Chargé seulement quand un professionnel est sélectionné
 */
export const DynamicBookingForm = dynamic(
    () => import('@/app/_components/BookingForm').then(mod => ({ default: mod.BookingForm })),
    {
        loading: () => (
            <div className="rounded-2xl glass p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        ),
        ssr: false, // Pas de SSR pour ce composant (client-only)
    }
);

/**
 * Calendar/DatePicker - Calendrier de sélection de date
 * Chargé seulement lors de la réservation
 */
export const DynamicCalendar = dynamic(
    () => import('@/components/Calendar').then(mod => ({ default: mod.Calendar })),
    {
        loading: () => (
            <div className="rounded-xl glass p-4 animate-pulse">
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }).map((_, i) => (
                        <div key={i} className="h-10 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        ),
        ssr: false,
    }
);

// ============================================
// DASHBOARD COMPONENTS (Lourds)
// ============================================

/**
 * AnalyticsChart - Graphiques de statistiques
 * Utilisé dans les dashboards pro/admin
 */
export const DynamicAnalyticsChart = dynamic(
    () => import('@/components/AnalyticsChart').then(mod => ({ default: mod.AnalyticsChart })),
    {
        loading: () => (
            <div className="rounded-xl glass p-6 animate-pulse">
                <div className="h-64 bg-gray-200 rounded"></div>
            </div>
        ),
        ssr: false,
    }
);

/**
 * DataTable - Table de données avec pagination
 * Utilisé pour listings clients, réservations, etc.
 */
export const DynamicDataTable = dynamic(
    () => import('@/components/DataTable').then(mod => ({ default: mod.DataTable })),
    {
        loading: () => (
            <div className="rounded-xl glass p-4 animate-pulse">
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        ),
        ssr: false,
    }
);

// ============================================
// MESSAGES & CHAT (Lourds)
// ============================================

/**
 * ChatBox - Messagerie en temps réel
 * Chargé seulement sur la page messages
 */
export const DynamicChatBox = dynamic(
    () => import('@/components/ChatBox').then(mod => ({ default: mod.ChatBox })),
    {
        loading: () => (
            <div className="rounded-xl glass p-4 animate-pulse h-96">
                <div className="flex flex-col space-y-2">
                    <div className="h-16 bg-gray-200 rounded self-start w-2/3"></div>
                    <div className="h-16 bg-gray-300 rounded self-end w-2/3"></div>
                </div>
            </div>
        ),
        ssr: false,
    }
);

// ============================================
// MODALS (Medium weight)
// ============================================

/**
 * ImageGallery - Galerie d'images professionnels
 * Chargé au clic sur une image
 */
export const DynamicImageGallery = dynamic(
    () => import('@/components/ImageGallery').then(mod => ({ default: mod.ImageGallery })),
    {
        loading: () => (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </div>
        ),
        ssr: false,
    }
);

/**
 * ReviewModal - Modal pour laisser un avis
 * Chargé au clic sur "Laisser un avis"
 */
export const DynamicReviewModal = dynamic(
    () => import('@/components/ReviewModal').then(mod => ({ default: mod.ReviewModal })),
    {
        loading: () => (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className="rounded-xl glass p-6 w-96 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-24 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        ),
        ssr: false,
    }
);

// ============================================
// NOTES D'UTILISATION
// ============================================

/**
 * Comment utiliser ces composants dynamiques:
 * 
 * AVANT (page.tsx):
 * import { BookingForm } from '@/components/BookingForm';
 * <BookingForm {...props} />
 * 
 * APRÈS (page.tsx):
 * import { DynamicBookingForm } from '@/lib/dynamic-components';
 * <DynamicBookingForm {...props} />
 * 
 * AVANTAGES:
 * - Bundle JS initial réduit ~30-50%
 * - Temps First Contentful Paint amélioré
 * - Meilleure expérience mobile (moins de RAM)
 * - Code-splitting automatique par Next.js
 * 
 * IMPORTANT pour iOS/Android:
 * - Les composants se chargent à la demande
 * - Loading states évitent "écran blanc"
 * - ssr: false évite hydration mismatch sur mobile
 */
