# 🔧 Correction Variables d'Environnement Manquantes

## Problème

Le script `check-env.ts` a détecté que ces variables sont manquantes sur le serveur :

```
❌ NEXTAUTH_SECRET est OBLIGATOIRE
❌ NEXTAUTH_URL est OBLIGATOIRE
```

## Solution

### Sur le serveur, ajouter ces variables dans `.env` :

```bash
cd /var/www/anireserve/apps/web
nano .env
```

Ajouter ou vérifier ces lignes :

```env
# NextAuth (OBLIGATOIRE)
NEXTAUTH_URL="https://anireserve.com"
NEXTAUTH_SECRET="votre-secret-minimum-32-caracteres-long-ici-generer-un-aleatoire"
```

### Générer un secret sécurisé :

```bash
# Option 1: Avec openssl
openssl rand -base64 32

# Option 2: Avec node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Exemple de `.env` complet :

```env
# Base de données
DATABASE_URL="postgresql://postgres.zdduxtiebrfaqtcbsnkr:IYoB1QApCPtU06RW@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

# Application
NEXT_PUBLIC_BASE_URL="https://anireserve.com"
NEXTAUTH_URL="https://anireserve.com"
NEXTAUTH_SECRET="votre-secret-genere-avec-openssl-ou-node-minimum-32-caracteres"

# Supabase (optionnel)
# NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
# NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-cle"

# Resend (optionnel)
# RESEND_API_KEY="re_xxxxx"

# Stripe (optionnel)
# STRIPE_SECRET_KEY="sk_xxxxx"
# STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_xxxxx"
```

### Vérifier après ajout :

```bash
npm run check-env
```

Si tout est OK, vous verrez :
```
✅ Toutes les variables obligatoires sont présentes et valides!
```

### Puis rebuilder :

```bash
npm run build
pm2 start ../../ecosystem.config.js
pm2 save
pm2 status
```

---

**Note:** Ne jamais commiter le fichier `.env` dans Git (déjà dans `.gitignore`).
