/**
 * Rate Limiting pour les routes API
 * Protection contre les attaques DDoS et brute force
 */

// Store simple en mémoire (pour production, utiliser Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number; // Fenêtre de temps en millisecondes
  maxRequests: number; // Nombre maximum de requêtes
  identifier?: string; // Identifiant personnalisé (par défaut: IP)
}

/**
 * Rate limiter simple basé sur l'IP
 * Pour production, utiliser une solution Redis (Upstash, etc.)
 */
export async function rateLimit(
  request: Request,
  options: RateLimitOptions
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const { windowMs, maxRequests, identifier } = options;

  // Obtenir l'identifiant (IP par défaut)
  const id = identifier || getClientIP(request);
  const now = Date.now();

  // Nettoyer les entrées expirées (toutes les 100 requêtes pour performance)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries(now);
  }

  // Récupérer ou créer l'entrée
  let entry = requestCounts.get(id);

  if (!entry || entry.resetTime < now) {
    // Nouvelle fenêtre
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
    requestCounts.set(id, entry);
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: entry.resetTime,
    };
  }

  // Incrémenter le compteur
  entry.count++;

  if (entry.count > maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      response: new Response(
        JSON.stringify({
          error: "Trop de requêtes. Veuillez réessayer plus tard.",
          retryAfter: Math.ceil((entry.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(entry.resetTime).toISOString(),
            "Retry-After": Math.ceil((entry.resetTime - Date.now()) / 1000).toString(),
          },
        }
      ),
    };
  }

  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Obtenir l'IP du client depuis la requête
 */
function getClientIP(request: Request): string {
  // Essayer les headers X-Forwarded-For (proxy/load balancer)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // Essayer X-Real-IP
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback: utiliser une valeur par défaut (ne devrait pas arriver)
  return "unknown";
}

/**
 * Nettoyer les entrées expirées
 */
function cleanupExpiredEntries(now: number): void {
  for (const [id, entry] of requestCounts.entries()) {
    if (entry.resetTime < now) {
      requestCounts.delete(id);
    }
  }
}

/**
 * Preset pour login (compatibilité avec ancien code)
 */
export const loginLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 tentatives par 15 minutes
};

/**
 * Presets de rate limiting pour différents types de routes
 */
export const rateLimitPresets = {
  // Routes d'authentification (stricte)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 tentatives par 15 minutes
  },
  // Routes API générales
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requêtes par minute
  },
  // Routes d'upload (stricte)
  upload: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads par minute
  },
  // Routes publiques (plus permissif)
  public: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requêtes par minute
  },
};

/**
 * Middleware helper pour Next.js API routes
 */
export async function withRateLimit(
  request: Request,
  preset: keyof typeof rateLimitPresets,
  handler: () => Promise<Response>
): Promise<Response> {
  const limit = await rateLimit(request, rateLimitPresets[preset]);

  if (!limit.success) {
    return new Response(
      JSON.stringify({
        error: "Trop de requêtes. Veuillez réessayer plus tard.",
        retryAfter: Math.ceil((limit.resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": rateLimitPresets[preset].maxRequests.toString(),
          "X-RateLimit-Remaining": limit.remaining.toString(),
          "X-RateLimit-Reset": new Date(limit.resetTime).toISOString(),
          "Retry-After": Math.ceil((limit.resetTime - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // Ajouter les headers de rate limit à la réponse
  const response = await handler();
  response.headers.set("X-RateLimit-Limit", rateLimitPresets[preset].maxRequests.toString());
  response.headers.set("X-RateLimit-Remaining", limit.remaining.toString());
  response.headers.set("X-RateLimit-Reset", new Date(limit.resetTime).toISOString());

  return response;
}
