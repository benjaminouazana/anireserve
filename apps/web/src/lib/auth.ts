import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function loginProfessional(email: string, password: string) {
  const professional = await prisma.professional.findUnique({
    where: { email },
  });

  if (!professional || !professional.password) {
    return null;
  }

  // Comparaison simple pour l'instant (à remplacer par bcrypt plus tard)
  // TODO: utiliser bcrypt.compare une fois bcryptjs installé
  if (password !== professional.password) {
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

  // Utiliser bcrypt si disponible, sinon comparaison simple pour compatibilité
  let isValid = false;
  try {
    const bcrypt = await import("bcryptjs");
    isValid = await bcrypt.compare(password, client.password);
  } catch {
    // Fallback si bcrypt n'est pas disponible
    isValid = password === client.password;
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

  // Utiliser bcrypt si disponible
  let isValid = false;
  try {
    const bcrypt = await import("bcryptjs");
    isValid = await bcrypt.compare(password, admin.password);
  } catch {
    // Fallback si bcrypt n'est pas disponible
    isValid = password === admin.password;
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

