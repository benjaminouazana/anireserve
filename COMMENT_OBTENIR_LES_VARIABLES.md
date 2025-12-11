# 🔑 Comment Obtenir Toutes les Variables d'Environnement

## 📋 Variables Essentielles (Minimum pour démarrer)

### 1. **DATABASE_URL** ⚠️ OBLIGATOIRE

C'est l'URL de votre base de données PostgreSQL.

#### Option A : Supabase (Recommandé - Gratuit)

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte (gratuit)
3. Créez un nouveau projet :
   - Nom : `anireserve`
   - Mot de passe : (notez-le bien !)
   - Région : choisissez la plus proche
4. Une fois créé, allez dans **"Settings"** → **"Database"**
5. Cherchez **"Connection string"** → **"URI"**
6. Copiez l'URL qui ressemble à :
   ```
   postgresql://postgres:[VOTRE-MOT-DE-PASSE]@db.xxxxx.supabase.co:5432/postgres
   ```
7. Remplacez `[VOTRE-MOT-DE-PASSE]` par votre vrai mot de passe
8. C'est votre **DATABASE_URL** !

#### Option B : Autre PostgreSQL

Si vous avez déjà une base de données PostgreSQL ailleurs, utilisez son URL.

---

### 2. **NEXT_PUBLIC_APP_URL** ✅ SIMPLE

C'est juste l'URL de votre site :

```
https://anireserve.com
```

Ou si vous testez d'abord sur Vercel :

```
https://votre-projet.vercel.app
```

---

### 3. **NODE_ENV** ✅ SIMPLE

Toujours la même valeur :

```
production
```

---

## 📧 Variables Optionnelles (Pour les emails)

### 4. **RESEND_API_KEY** (Optionnel - pour les emails)

Si vous voulez envoyer des emails (confirmations, etc.) :

1. Allez sur [resend.com](https://resend.com)
2. Créez un compte (gratuit jusqu'à 100 emails/jour)
3. Allez dans **"API Keys"**
4. Cliquez sur **"Create API Key"**
5. Donnez-lui un nom : `anireserve-production`
6. Copiez la clé (elle commence par `re_...`)
7. C'est votre **RESEND_API_KEY** !

**Note** : Vous pouvez déployer sans ça, mais les emails ne fonctionneront pas.

---

## 🖼️ Variables Supabase (Optionnel - pour les images)

### 5. **NEXT_PUBLIC_SUPABASE_URL**

Si vous utilisez Supabase pour stocker les images :

1. Dans votre projet Supabase
2. Allez dans **"Settings"** → **"API"**
3. Copiez **"Project URL"** (ressemble à `https://xxxxx.supabase.co`)
4. C'est votre **NEXT_PUBLIC_SUPABASE_URL** !

### 6. **NEXT_PUBLIC_SUPABASE_ANON_KEY**

1. Dans la même page **"Settings"** → **"API"**
2. Copiez **"anon public"** key
3. C'est votre **NEXT_PUBLIC_SUPABASE_ANON_KEY** !

### 7. **SUPABASE_SERVICE_ROLE_KEY**

1. Toujours dans **"Settings"** → **"API"**
2. Copiez **"service_role"** key (⚠️ gardez-la secrète !)
3. C'est votre **SUPABASE_SERVICE_ROLE_KEY** !

**Note** : Si vous stockez les images localement, vous n'avez pas besoin de ces variables.

---

## 💳 Variables Stripe (Optionnel - pour les paiements)

Si vous voulez activer les paiements plus tard :

1. Allez sur [stripe.com](https://stripe.com)
2. Créez un compte
3. Allez dans **"Developers"** → **"API keys"**
4. Copiez **"Publishable key"** → **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
5. Copiez **"Secret key"** → **STRIPE_SECRET_KEY**

**Note** : Vous pouvez déployer sans ça, les paiements ne fonctionneront juste pas.

---

## ✅ Configuration Minimale pour Déployer

Pour déployer **MAINTENANT** et tester, vous avez besoin de :

```env
DATABASE_URL=postgresql://postgres:VOTRE_MDP@db.xxxxx.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=https://anireserve.com
NODE_ENV=production
```

C'est tout ! Le reste peut être ajouté plus tard.

---

## 🚀 Étapes Rapides

1. **Créez un compte Supabase** (5 minutes)
2. **Créez un projet** (2 minutes)
3. **Récupérez la DATABASE_URL** (1 minute)
4. **Ajoutez les 3 variables dans Vercel**
5. **Déployez !**

---

## ⚠️ Important

- **DATABASE_URL** : Ne partagez JAMAIS cette URL publiquement
- **RESEND_API_KEY** : Gardez-la secrète
- **SUPABASE_SERVICE_ROLE_KEY** : Très sensible, gardez-la secrète

---

## 🆘 Besoin d'Aide ?

Si vous bloquez sur une étape, dites-moi laquelle et je vous guide !

---

**Dernière mise à jour** : $(date)








