/**
 * Protection CSRF simple pour Next.js
 * Pour l'app mobile iOS/Android, on utilise un système basé sur Origin
 */

const ALLOWED_ORIGINS = [
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    "capacitor://localhost", // Capacitor iOS
    "http://localhost", // Capacitor Android
    "ionic://localhost", // Ionic  
];

/**
 * Vérifie l'origine de la requête pour prévenir les attaques CSRF
 */
export function checkCSRF(request: Request): { success: boolean; error?: string } {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");

    // Pour les requêtes d'apps mobiles Capacitor
    if (origin) {
        // Vérifier si l'origine est autorisée
        const isAllowed = ALLOWED_ORIGINS.some(allowed => {
            if (allowed.includes("localhost")) {
                // Pour localhost, accepter tous les ports
                return origin.includes("localhost") || origin.includes("127.0.0.1");
            }
            return origin.startsWith(allowed);
        });

        if (isAllowed) {
            return { success: true };
        }
    }

    // Pour les requêtes web normales, vérifier le referer
    if (referer) {
        const isAllowed = ALLOWED_ORIGINS.some(allowed => {
            if (allowed.includes("localhost")) {
                return referer.includes("localhost") || referer.includes("127.0.0.1");
            }
            return referer.startsWith(allowed);
        });

        if (isAllowed) {
            return { success: true };
        }
    }

    // Si ni origin ni referer, bloquer (probable attaque)
    if (!origin && !referer) {
        return {
            success: false,
            error: "Missing origin or referer header"
        };
    }

    return {
        success: false,
        error: "Invalid origin or referer"
    };
}

/**
 * Middleware CSRF pour les routes API
 */
export async function csrfProtection(request: Request): Promise<{ success: boolean; response?: Response }> {
    // Ignorer les requêtes GET (safe methods)
    if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") {
        return { success: true };
    }

    const check = checkCSRF(request);

    if (!check.success) {
        return {
            success: false,
            response: new Response(
                JSON.stringify({
                    error: "CSRF validation failed",
                    message: "Cette requête n'est pas autorisée"
                }),
                {
                    status: 403,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        };
    }

    return { success: true };
}
