# Variables d'environnement requises

Créez un fichier `.env` à la racine de `apps/web/` avec les variables suivantes :

## Variables obligatoires

```env
# Base de données PostgreSQL (Supabase)
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"

# URL de base de l'application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
# En production : NEXT_PUBLIC_BASE_URL="https://anireserve.com"

# NextAuth (pour l'authentification)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
```

## Variables optionnelles

```env
# Supabase (pour le stockage d'images)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Stripe (pour les paiements)
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"

# Resend (pour l'envoi d'emails)
RESEND_API_KEY="re_xxxxx"

# Environnement
NODE_ENV="development"
```

## Notes importantes

- Les variables préfixées par `NEXT_PUBLIC_` sont accessibles côté client
- Les autres variables sont uniquement accessibles côté serveur
- Ne commitez JAMAIS le fichier `.env` dans Git
- Utilisez des valeurs différentes pour le développement et la production

