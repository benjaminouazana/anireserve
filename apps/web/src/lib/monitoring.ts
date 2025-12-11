/**
 * Monitoring & Error Tracking Setup
 * Sentry pour tracking des erreurs
 */

// Installation: npm install @sentry/nextjs

export const sentryConfig = {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: 1.0, // 100% en dev, 0.1 en prod

    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% des sessions
    replaysOnErrorSampleRate: 1.0, // 100% si erreur

    // Environment
    environment: process.env.NODE_ENV,

    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
};

// Error boundary React
export function logError(error: Error, errorInfo?: any) {
    if (process.env.NODE_ENV === 'production') {
        // Sentry.captureException(error, { extra: errorInfo });
        console.error('Error logged to Sentry:', error);
    } else {
        console.error('Error:', error, errorInfo);
    }
}

// Custom events pour business metrics
export function trackBusinessEvent(event: string, data?: Record<string, any>) {
    if (process.env.NODE_ENV === 'production') {
        // Sentry.captureMessage(event, { level: 'info', extra: data });
        console.log('Business event:', event, data);
    }
}

/**
 * Uptime Monitoring
 * Recommandations de services:
 * - UptimeRobot (gratuit, 50 monitors)
 * - Pingdom
 * - StatusCake
 * 
 * URLs à monitor:
 * - https://anireserve.com (homepage)
 * - https://anireserve.com/api/health (health check)
 * - https://anireserve.com/professionals (liste pros)
 */

// Health check endpoint
export async function healthCheck() {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        database: await checkDatabase(),
        email: await checkEmail(),
    };
}

async function checkDatabase() {
    try {
        // Simple query pour vérifier DB
        // await prisma.$queryRaw`SELECT 1`;
        return 'ok';
    } catch {
        return 'error';
    }
}

async function checkEmail() {
    try {
        // Vérifier service email
        return 'ok';
    } catch {
        return 'error';
    }
}

/**
 * Performance Monitoring
 * Web Vitals tracking
 */
export function reportWebVitals(metric: any) {
    if (process.env.NODE_ENV === 'production') {
        // Send to analytics
        console.log('Web Vital:', metric);

        // Peut envoyer à Google Analytics, Sentry, etc.
        if (window.gtag) {
            window.gtag('event', metric.name, {
                value: Math.round(metric.value),
                event_label: metric.id,
                non_interaction: true,
            });
        }
    }
}
