# 🚀 Guide de Déploiement Complet - AniReserve

## 📋 Étape 1 : Préparer le Projet

### 1.1 Vérifier que tout est commité

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
git status
git add .
git commit -m "Préparation déploiement production"
git push origin main
```

### 1.2 Vérifier la structure

Le projet doit avoir cette structure :
```
AniReserve/
├── apps/web/          (Application Next.js)
├── prisma/            (Schéma de base de données)
├── package.json       (Configuration monorepo)
└── vercel.json        (Configuration Vercel)
```

## 📋 Étape 2 : Préparer la Base de Données

### 2.1 Créer une base de données PostgreSQL

**Option A : Supabase (Recommandé - Gratuit)**
1. Va sur [supabase.com](https://supabase.com)
2. Crée un compte
3. Crée un nouveau projet
4. Va dans "Settings" > "Database"
5. Copie la "Connection string" (URI)

**Option B : Autre hébergeur PostgreSQL**
- Railway, Neon, Render, etc.

### 2.2 Appliquer les migrations

```bash
# Dans le terminal, depuis la racine du projet
cd /Users/macbookpro/Desktop/aniresa/AniReserve
npx prisma migrate deploy
npx prisma generate
```

## 📋 Étape 3 : Configurer Supabase (pour les fichiers)

### 3.1 Créer un bucket Supabase

1. Dans Supabase, va dans "Storage"
2. Crée un bucket nommé `documents` (public ou privé selon tes besoins)
3. Configure les politiques de sécurité

### 3.2 Récupérer les clés

1. Va dans "Settings" > "API"
2. Copie :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ SECRET)

## 📋 Étape 4 : Configurer Resend (pour les emails)

### 4.1 Créer un compte Resend

1. Va sur [resend.com](https://resend.com)
2. Crée un compte
3. Va dans "API Keys"
4. Crée une nouvelle clé API
5. Copie la clé (commence par `re_`)

### 4.2 Vérifier le domaine (optionnel mais recommandé)

Pour envoyer des emails depuis ton domaine, configure-le dans Resend.

## 📋 Étape 5 : Déployer sur Vercel

### 5.1 Créer un compte Vercel

1. Va sur [vercel.com](https://vercel.com)
2. Connecte-toi avec GitHub
3. Importe ton repository `AniReserve`

### 5.2 Configurer le projet

**Root Directory** : Laisse vide (Vercel détectera automatiquement)

**Build Command** : `cd apps/web && npm run build`

**Output Directory** : `apps/web/.next`

**Install Command** : `npm install`

### 5.3 Ajouter les variables d'environnement

Dans Vercel, va dans "Settings" > "Environment Variables" et ajoute :

```env
# Base de données (OBLIGATOIRE)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Supabase (OBLIGATOIRE pour les fichiers)
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (⚠️ SECRET)

# Resend (OBLIGATOIRE pour les emails)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# URL du site (OBLIGATOIRE)
NEXT_PUBLIC_BASE_URL=https://ton-domaine.com

# Admin (optionnel - pour créer le compte admin)
ADMIN_EMAIL=admin@ton-domaine.com
ADMIN_PASSWORD=TonMotDePasseSecurise123!
```

### 5.4 Déployer

1. Clique sur "Deploy"
2. Vercel va builder le projet
3. Une fois terminé, tu auras une URL temporaire (ex: `anireserve.vercel.app`)

## 📋 Étape 6 : Configurer le Nom de Domaine

### 6.1 Ajouter le domaine dans Vercel

1. Va dans "Settings" > "Domains"
2. Ajoute ton nom de domaine (ex: `anireserve.com`)
3. Vercel te donnera des instructions DNS

### 6.2 Configurer les DNS

**Chez ton registrar de domaine (ex: OVH, Namecheap, etc.)**

Ajoute ces enregistrements :

**Option A : CNAME (Recommandé)**
```
Type: CNAME
Name: @ (ou www)
Value: cname.vercel-dns.com
```

**Option B : A Record**
```
Type: A
Name: @
Value: 76.76.21.21 (IP Vercel - vérifie sur Vercel)
```

### 6.3 Attendre la propagation DNS

- Peut prendre de 5 minutes à 48 heures
- Vérifie avec : `nslookup ton-domaine.com`

### 6.4 SSL automatique

Vercel configure automatiquement le SSL (HTTPS) une fois le DNS configuré.

## 📋 Étape 7 : Créer le Compte Admin

### 7.1 Via l'API (recommandé)

Une fois le site déployé, crée le compte admin :

```bash
# Via curl ou Postman
curl -X POST https://ton-domaine.com/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ton-domaine.com",
    "password": "TonMotDePasseSecurise123!",
    "name": "Admin"
  }'
```

**OU** crée-le directement dans la base de données :

```sql
INSERT INTO "Admin" (email, password, name, "createdAt")
VALUES (
  'admin@ton-domaine.com',
  '$2a$10$...', -- Hash bcrypt du mot de passe
  'Admin',
  NOW()
);
```

Pour générer le hash bcrypt :
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('TonMotDePasse', 10).then(h => console.log(h))"
```

## 📋 Étape 8 : Vérifications Post-Déploiement

### Checklist de test

- [ ] Le site s'affiche correctement
- [ ] Les professionnels s'affichent sur la page d'accueil
- [ ] La recherche fonctionne
- [ ] L'inscription client fonctionne
- [ ] L'inscription pro fonctionne
- [ ] La connexion fonctionne (client, pro, admin)
- [ ] La création de réservation fonctionne
- [ ] Les créneaux s'affichent
- [ ] Les emails sont envoyés (vérifie dans Resend)
- [ ] L'upload de fichiers fonctionne (Teoudate Zeoute)
- [ ] Le chat fonctionne
- [ ] Les favoris fonctionnent
- [ ] Le dashboard admin fonctionne

## 🐛 Dépannage

### Erreur "Database connection failed"

1. Vérifie que `DATABASE_URL` est correct
2. Vérifie que la base de données accepte les connexions externes
3. Vérifie que le SSL est activé dans l'URL (ajoute `?sslmode=require`)

### Erreur "Prisma Client not generated"

Ajoute dans `vercel.json` ou dans les Build Settings :
```json
{
  "buildCommand": "cd apps/web && npx prisma generate && npm run build"
}
```

### Erreur 500 sur certaines pages

1. Vérifie les logs Vercel : "Deployments" > Clique sur le déploiement > "Functions" > Voir les logs
2. Vérifie que toutes les variables d'environnement sont définies
3. Vérifie que les migrations Prisma sont appliquées

### Les emails ne partent pas

1. Vérifie que `RESEND_API_KEY` est correct
2. Vérifie dans Resend > "Logs" pour voir les erreurs
3. Vérifie que le domaine est vérifié dans Resend (si tu utilises un domaine custom)

### Les fichiers ne s'uploadent pas

1. Vérifie que Supabase est configuré
2. Vérifie que le bucket existe et est accessible
3. Vérifie les politiques de sécurité du bucket

## 📝 Variables d'Environnement Complètes

Crée un fichier `.env.production` avec :

```env
# ============================================
# BASE DE DONNÉES (OBLIGATOIRE)
# ============================================
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# ============================================
# SUPABASE (OBLIGATOIRE pour fichiers)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (SECRET)

# ============================================
# RESEND (OBLIGATOIRE pour emails)
# ============================================
RESEND_API_KEY=re_xxxxxxxxxxxxx

# ============================================
# URL DU SITE (OBLIGATOIRE)
# ============================================
NEXT_PUBLIC_BASE_URL=https://ton-domaine.com

# ============================================
# ADMIN (Optionnel - pour création compte)
# ============================================
ADMIN_EMAIL=admin@ton-domaine.com
ADMIN_PASSWORD=TonMotDePasseSecurise123!

# ============================================
# ENVIRONNEMENT
# ============================================
NODE_ENV=production
```

## 🎯 Prochaines Étapes Après Déploiement

1. **Tester toutes les fonctionnalités**
2. **Configurer les backups** de la base de données
3. **Configurer le monitoring** (Vercel Analytics, Sentry, etc.)
4. **Créer le compte admin**
5. **Valider quelques profils professionnels** pour tester
6. **Tester les emails** en conditions réelles
7. **Vérifier les performances** (PageSpeed Insights)

## 📞 Support

Si tu rencontres des problèmes :
1. Vérifie les logs Vercel
2. Vérifie les logs de la base de données
3. Vérifie que toutes les variables d'environnement sont définies
4. Vérifie la documentation Vercel : https://vercel.com/docs













