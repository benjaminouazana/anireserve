# 🚀 Guide de Déploiement - AniReserve

## 📋 Prérequis

- [ ] Compte Vercel (ou autre plateforme)
- [ ] Base de données Supabase configurée
- [ ] Variables d'environnement préparées
- [ ] Domaine configuré (optionnel)

---

## 🔧 Étape 1 : Préparation de l'Environnement

### 1.1 Variables d'environnement

Créer un fichier `.env.production` avec :

```env
# Base de données
DATABASE_URL="postgresql://user:password@host:port/database"

# Next.js
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"
NODE_ENV="production"

# Supabase (si utilisé)
NEXT_PUBLIC_SUPABASE_URL="https://votre-projet.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-clé-anon"
SUPABASE_SERVICE_ROLE_KEY="votre-clé-service"

# Email (Resend)
RESEND_API_KEY="votre-clé-resend"
FROM_EMAIL="noreply@votre-domaine.com"

# Stripe (si utilisé)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
```

### 1.2 Migration de la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Vérifier la connexion
npx prisma db pull
```

---

## 🌐 Étape 2 : Déploiement sur Vercel

### 2.1 Via l'interface Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "New Project"
3. Importer le repository GitHub
4. Configurer :
   - **Framework Preset** : Next.js
   - **Root Directory** : `apps/web`
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`
5. Ajouter les variables d'environnement
6. Déployer

### 2.2 Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
cd apps/web
vercel

# Déployer en production
vercel --prod
```

---

## 🗄️ Étape 3 : Configuration Supabase

### 3.1 Créer le projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Récupérer les clés API
4. Configurer le storage pour les images

### 3.2 Configuration du Storage

```sql
-- Créer le bucket "images"
-- Dans Supabase Dashboard > Storage > Create Bucket
-- Nom : images
-- Public : true
```

---

## 📧 Étape 4 : Configuration Email (Resend)

1. Créer un compte sur [resend.com](https://resend.com)
2. Vérifier votre domaine
3. Récupérer la clé API
4. Ajouter dans les variables d'environnement

---

## ✅ Étape 5 : Vérifications Post-Déploiement

### Checklist :

- [ ] Site accessible
- [ ] Connexion à la base de données fonctionnelle
- [ ] Inscription client fonctionne
- [ ] Inscription pro fonctionne
- [ ] Recherche fonctionne
- [ ] Réservation fonctionne
- [ ] Upload d'images fonctionne
- [ ] Emails envoyés correctement
- [ ] Pas d'erreurs dans les logs

### Commandes de vérification :

```bash
# Vérifier les logs
vercel logs

# Vérifier la base de données
npx prisma studio
```

---

## 🔒 Étape 6 : Sécurité

### Actions à effectuer :

1. **HTTPS** : Vérifier que le site est en HTTPS
2. **Variables d'environnement** : Ne jamais commiter `.env`
3. **Rate Limiting** : Configurer sur Vercel
4. **CORS** : Configurer correctement
5. **Headers de sécurité** : Vérifier dans `next.config.js`

---

## 📊 Étape 7 : Monitoring

### Outils recommandés :

1. **Vercel Analytics** : Activé automatiquement
2. **Sentry** : Pour le tracking d'erreurs
3. **Google Analytics** : Pour les statistiques (optionnel)

---

## 🔄 Étape 8 : Déploiement Continu

### Configuration GitHub Actions (optionnel)

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🐛 En cas de Problème

### Erreurs courantes :

1. **Erreur de connexion DB** : Vérifier `DATABASE_URL`
2. **Images ne s'affichent pas** : Vérifier Supabase config
3. **Emails non envoyés** : Vérifier Resend API key
4. **Build échoue** : Vérifier les logs Vercel

---

## 📝 Notes Importantes

- Toujours tester en staging avant production
- Faire des backups réguliers de la base de données
- Surveiller les logs après déploiement
- Tester toutes les fonctionnalités après déploiement

