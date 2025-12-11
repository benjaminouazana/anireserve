/**
 * Google Analytics 4 - Tracking
 * Pour mesurer le trafic et comportement utilisateurs
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Page view tracking
export const pageview = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
};

// Event tracking
export const event = ({ action, category, label, value }: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Custom events for AniReserve
export const trackSearch = (service: string, city: string) => {
    event({
        action: 'search',
        category: 'engagement',
        label: `${service} - ${city}`,
    });
};

export const trackBookingStart = (professionalId: number) => {
    event({
        action: 'booking_start',
        category: 'conversion',
        label: `Professional ${professionalId}`,
    });
};

export const trackBookingComplete = (professionalId: number, value?: number) => {
    event({
        action: 'booking_complete',
        category: 'conversion',
        label: `Professional ${professionalId}`,
        value,
    });
};

export const trackProfessionalView = (slug: string) => {
    event({
        action: 'view_professional',
        category: 'engagement',
        label: slug,
    });
};

export const trackSignup = (userType: 'client' | 'professional') => {
    event({
        action: 'sign_up',
        category: 'conversion',
        label: userType,
    });
};

export const trackLogin = (userType: 'client' | 'professional') => {
    event({
        action: 'login',
        category: 'engagement',
        label: userType,
    });
};

// Type declaration for gtag
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}
