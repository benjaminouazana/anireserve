import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Configuration de la DATABASE_URL avec paramètres de connexion
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL n'est pas défini");
  }
  
  // Si l'URL contient déjà des paramètres, les préserver
  if (url.includes("?")) {
    return url;
  }
  
  // Ajouter des paramètres pour gérer les connexions fermées
  // connection_limit: nombre max de connexions dans le pool
  // pool_timeout: timeout pour obtenir une connexion du pool
  // connect_timeout: timeout pour établir une connexion
  return `${url}?connection_limit=10&pool_timeout=20&connect_timeout=10`;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

// Fonction helper pour gérer les erreurs de connexion fermée
export async function withReconnect<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Si la connexion est fermée, tenter de reconnecter
    if (errorMessage.includes("Closed") || errorMessage.includes("connection")) {
      console.warn("⚠️ Connexion fermée, tentative de reconnexion...");
      try {
        await prisma.$connect();
        // Réessayer l'opération après reconnexion
        return await operation();
      } catch (reconnectError) {
        console.error("❌ Échec de la reconnexion:", reconnectError);
        throw reconnectError;
      }
    }
    throw error;
  }
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}


