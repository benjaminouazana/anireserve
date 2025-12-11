/**
 * Rate Limiting simple en mémoire
 * Pour production avec plusieurs instances, utiliser Redis/Upstash
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

class RateLimiter {
    private requests: Map<string, RateLimitEntry> = new Map();
    private windowMs: number;
    private maxRequests: number;

    constructor(windowMs: number = 60000, maxRequests: number = 10) {
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;

        // Nettoyer les anciennes entrées toutes les minutes
        setInterval(() => this.cleanup(), 60000);
    }

    private cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.requests.entries()) {
            if (now > entry.resetTime) {
                this.requests.delete(key);
            }
        }
    }

    async checkLimit(identifier: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
        const now = Date.now();
        const entry = this.requests.get(identifier);

        if (!entry || now > entry.resetTime) {
            // Nouvelle fenêtre
            const resetTime = now + this.windowMs;
            this.requests.set(identifier, { count: 1, resetTime });
            return {
                success: true,
                limit: this.maxRequests,
                remaining: this.maxRequests - 1,
                reset: resetTime
            };
        }

        if (entry.count >= this.maxRequests) {
            // Limite atteinte
            return {
                success: false,
                limit: this.maxRequests,
                remaining: 0,
                reset: entry.resetTime
            };
        }

        // Incrémenter le compteur
        entry.count++;
        this.requests.set(identifier, entry);

        return {
            success: true,
            limit: this.maxRequests,
            remaining: this.maxRequests - entry.count,
            reset: entry.resetTime
        };
    }
}

// Rate limiters pour différents endpoints
export const loginLimiter = new RateLimiter(15 * 60 * 1000, 5); // 5 tentatives par 15 min
export const registerLimiter = new RateLimiter(60 * 60 * 1000, 3); // 3 inscriptions par heure
export const bookingLimiter = new RateLimiter(60 * 1000, 10); // 10 réservations par minute
export const apiLimiter = new RateLimiter(60 * 1000, 60); // 60 requêtes par minute pour APIs générales

/**
 * Helper pour obtenir l'identifiant client (IP ou user ID)
 */
export function getClientIdentifier(request: Request): string {
    // Essayer d'obtenir l'IP depuis les headers
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    return ip;
}

/**
 * Middleware de rate limiting pour Next.js
 */
export async function rateLimit(
    request: Request,
    limiter: RateLimiter = apiLimiter
): Promise<{ success: boolean; response?: Response }> {
    const identifier = getClientIdentifier(request);
    const result = await limiter.checkLimit(identifier);

    if (!result.success) {
        const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);

        return {
            success: false,
            response: new Response(
                JSON.stringify({
                    error: "Trop de requêtes. Veuillez réessayer plus tard.",
                    retryAfter
                }),
                {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "X-RateLimit-Limit": result.limit.toString(),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": result.reset.toString(),
                        "Retry-After": retryAfter.toString()
                    }
                }
            )
        };
    }

    return { success: true };
}
