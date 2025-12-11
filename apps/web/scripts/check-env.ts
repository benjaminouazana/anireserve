#!/usr/bin/env tsx
/**
 * Script de validation des variables d'environnement
 * Usage: npx tsx scripts/check-env.ts
 */

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
  validate?: (value: string) => boolean | string;
}

const requiredVars: EnvVar[] = [
  {
    name: "DATABASE_URL",
    required: true,
    description: "URL de connexion PostgreSQL (Supabase)",
    validate: (value) => {
      if (!value.startsWith("postgresql://")) {
        return "Doit commencer par postgresql://";
      }
      return true;
    },
  },
  {
    name: "NEXT_PUBLIC_BASE_URL",
    required: true,
    description: "URL de base de l'application",
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return "Doit être une URL valide";
      }
    },
  },
  {
    name: "NEXTAUTH_SECRET",
    required: true,
    description: "Secret pour NextAuth (minimum 32 caractères)",
    validate: (value) => {
      if (value.length < 32) {
        return "Doit contenir au moins 32 caractères";
      }
      return true;
    },
  },
  {
    name: "NEXTAUTH_URL",
    required: true,
    description: "URL pour NextAuth (généralement identique à NEXT_PUBLIC_BASE_URL)",
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return "Doit être une URL valide";
      }
    },
  },
];

const optionalVars: EnvVar[] = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    required: false,
    description: "URL Supabase (optionnel, pour stockage images)",
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return "Doit être une URL valide";
      }
    },
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    required: false,
    description: "Clé anonyme Supabase (optionnel)",
  },
  {
    name: "RESEND_API_KEY",
    required: false,
    description: "Clé API Resend (optionnel, pour envoi emails)",
    validate: (value) => {
      if (!value.startsWith("re_")) {
        return "Doit commencer par re_";
      }
      return true;
    },
  },
  {
    name: "STRIPE_SECRET_KEY",
    required: false,
    description: "Clé secrète Stripe (optionnel, pour paiements)",
    validate: (value) => {
      if (!value.startsWith("sk_")) {
        return "Doit commencer par sk_";
      }
      return true;
    },
  },
  {
    name: "STRIPE_WEBHOOK_SECRET",
    required: false,
    description: "Secret webhook Stripe (optionnel)",
    validate: (value) => {
      if (!value.startsWith("whsec_")) {
        return "Doit commencer par whsec_";
      }
      return true;
    },
  },
  {
    name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    required: false,
    description: "Clé publique Stripe (optionnel)",
    validate: (value) => {
      if (!value.startsWith("pk_")) {
        return "Doit commencer par pk_";
      }
      return true;
    },
  },
];

function checkEnvVars(): { success: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Charger les variables d'environnement
  require("dotenv").config({ path: ".env.local" });
  require("dotenv").config();

  // Vérifier les variables obligatoires
  for (const envVar of requiredVars) {
    const value = process.env[envVar.name];

    if (!value) {
      errors.push(`❌ ${envVar.name} est OBLIGATOIRE: ${envVar.description}`);
      continue;
    }

    if (envVar.validate) {
      const validation = envVar.validate(value);
      if (validation !== true) {
        errors.push(
          `❌ ${envVar.name} est invalide: ${validation} (valeur actuelle: ${value.substring(0, 20)}...)`
        );
      }
    }
  }

  // Vérifier les variables optionnelles
  for (const envVar of optionalVars) {
    const value = process.env[envVar.name];

    if (!value) {
      warnings.push(`⚠️  ${envVar.name} n'est pas défini (optionnel): ${envVar.description}`);
      continue;
    }

    if (envVar.validate) {
      const validation = envVar.validate(value);
      if (validation !== true) {
        warnings.push(`⚠️  ${envVar.name} semble invalide: ${validation}`);
      }
    }
  }

  // Vérifications spéciales
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    warnings.push(
      "⚠️  NEXT_PUBLIC_SUPABASE_URL est défini mais NEXT_PUBLIC_SUPABASE_ANON_KEY manque"
    );
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    warnings.push(
      "⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY est défini mais NEXT_PUBLIC_SUPABASE_URL manque"
    );
  }

  if (process.env.STRIPE_SECRET_KEY && !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    warnings.push(
      "⚠️  STRIPE_SECRET_KEY est défini mais NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY manque"
    );
  }

  return {
    success: errors.length === 0,
    errors,
    warnings,
  };
}

// Exécuter le script
if (require.main === module) {
  console.log("🔍 Vérification des variables d'environnement...\n");

  const result = checkEnvVars();

  if (result.errors.length > 0) {
    console.error("❌ ERREURS CRITIQUES:\n");
    result.errors.forEach((error) => console.error(error));
    console.error("\n");
  }

  if (result.warnings.length > 0) {
    console.warn("⚠️  AVERTISSEMENTS:\n");
    result.warnings.forEach((warning) => console.warn(warning));
    console.warn("\n");
  }

  if (result.success) {
    console.log("✅ Toutes les variables obligatoires sont présentes et valides!\n");
    if (result.warnings.length > 0) {
      console.log("ℹ️  Certaines variables optionnelles sont manquantes (normal si non utilisées)\n");
    }
    process.exit(0);
  } else {
    console.error("❌ Des variables obligatoires sont manquantes ou invalides.\n");
    process.exit(1);
  }
}

export { checkEnvVars };
