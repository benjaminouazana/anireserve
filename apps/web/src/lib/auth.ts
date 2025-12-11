import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function loginProfessional(email: string, password: string) {
  const professional = await prisma.professional.findUnique({
    where: { email },
  });

  if (!professional || !professional.password) {
    return null;
  }

  // Comparer le mot de passe avec bcrypt
  // Support pour les anciens mots de passe en clair (migration progressive)
  let isValid = false;
  try {
    const bcrypt = await import("bcryptjs");
    if (professional.password.startsWith("$2")) {
      // Mot de passe hashé avec bcrypt
      isValid = await bcrypt.compare(password, professional.password);
    } else {
      // Ancien mot de passe en clair (pour migration - À SUPPRIMER après migration complète)
      console.warn(`⚠️ Mot de passe en clair détecté pour le professionnel ${professional.email} - Migration requise`);
      isValid = password === professional.password;
    }
  } catch (error) {
    console.error("Erreur lors de la comparaison du mot de passe:", error);
    return null;
  }

  if (!isValid) {
    return null;
  }

  // Créer une session (cookie)
  const cookieStore = await cookies();
  cookieStore.set("pro_session", professional.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 jours pour sessions persistantes
    path: "/",
  });

  return {
    id: professional.id,
    name: professional.name,
    email: professional.email,
  };
}

export async function getCurrentProfessional() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("pro_session")?.value;

  if (!sessionId) {
    return null;
  }

  const professional = await prisma.professional.findUnique({
    where: { id: Number(sessionId) },
    select: {
      id: true,
      name: true,
      email: true,
      city: true,
      serviceType: true,
    },
  });

  return professional;
}

export async function logoutProfessional() {
  const cookieStore = await cookies();
  cookieStore.delete("pro_session");
}

// Fonctions d'authentification pour les clients
export async function loginClient(email: string, password: string) {
  const client = await prisma.client.findUnique({
    where: { email },
  });

  if (!client || !client.password) {
    return null;
  }

  // Comparer le mot de passe avec bcrypt
  // Support pour les anciens mots de passe en clair (migration progressive)
  let isValid = false;
  try {
    const bcrypt = await import("bcryptjs");
    if (client.password.startsWith("$2")) {
      // Mot de passe hashé avec bcrypt
      isValid = await bcrypt.compare(password, client.password);
    } else {
      // Ancien mot de passe en clair (pour migration - À SUPPRIMER après migration complète)
      console.warn(`⚠️ Mot de passe en clair détecté pour le client ${client.email} - Migration requise`);
      isValid = password === client.password;
    }
  } catch (error) {
    console.error("Erreur lors de la comparaison du mot de passe:", error);
    return null;
  }

  if (!isValid) {
    return null;
  }

  // Créer une session (cookie)
  const cookieStore = await cookies();
  cookieStore.set("client_session", client.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 jours pour sessions persistantes
    path: "/",
  });

  return {
    id: client.id,
    name: client.name,
    email: client.email,
  };
}

export async function getCurrentClient() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("client_session")?.value;

  if (!sessionId) {
    return null;
  }

  const client = await prisma.client.findUnique({
    where: { id: Number(sessionId) },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return client;
}

export async function logoutClient() {
  const cookieStore = await cookies();
  cookieStore.delete("client_session");
}

// Fonctions d'authentification pour les admins
export async function loginAdmin(email: string, password: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin || !admin.password) {
      return null;
    }

  // Comparer le mot de passe avec bcrypt
  // Support pour les anciens mots de passe en clair (migration progressive)
  let isValid = false;
  try {
    const bcrypt = await import("bcryptjs");
    if (admin.password.startsWith("$2")) {
      // Mot de passe hashé avec bcrypt
      isValid = await bcrypt.compare(password, admin.password);
    } else {
      // Ancien mot de passe en clair (pour migration - À SUPPRIMER après migration complète)
      console.warn(`⚠️ Mot de passe en clair détecté pour l'admin ${admin.email} - Migration requise`);
      isValid = password === admin.password;
    }
  } catch (error) {
    console.error("Erreur lors de la comparaison du mot de passe:", error);
    return null;
  }

  if (!isValid) {
    return null;
  }

  // Créer une session (cookie)
  const cookieStore = await cookies();
  cookieStore.set("admin_session", admin.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 jours pour sessions persistantes
    path: "/",
  });

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    };
  } catch (error) {
    console.error("Erreur loginAdmin:", error);
    return null;
  }
}

export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;

    if (!sessionId) {
      return null;
    }

    const admin = await prisma.admin.findUnique({
      where: { id: Number(sessionId) },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return admin;
  } catch (error) {
    console.error("Erreur getCurrentAdmin:", error);
    return null;
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

