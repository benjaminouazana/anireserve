# Guide de Configuration Supabase

Ce guide explique comment configurer Supabase pour que les uploads de documents (Teoudate Zeoute) fonctionnent en production.

## 📋 Prérequis

1. Un compte Supabase (gratuit) : https://supabase.com
2. Un projet Supabase créé

## 🔧 Étapes de Configuration

### 1. Créer un projet Supabase

1. Va sur https://supabase.com
2. Crée un compte ou connecte-toi
3. Clique sur "New Project"
4. Remplis les informations :
   - **Name** : `anireserve` (ou le nom de ton choix)
   - **Database Password** : choisis un mot de passe fort
   - **Region** : choisis la région la plus proche (Europe pour la France)
5. Clique sur "Create new project"
6. Attends 2-3 minutes que le projet soit créé

### 2. Créer un bucket Storage

1. Dans ton projet Supabase, va dans **Storage** (menu de gauche)
2. Clique sur **"New bucket"**
3. Configure le bucket :
   - **Name** : `images`
   - **Public bucket** : ✅ **Cocher** (important pour que les images soient accessibles)
4. Clique sur **"Create bucket"**

### 3. Configurer les politiques de sécurité (Policies)

1. Dans le bucket `images`, clique sur **"Policies"**
2. Clique sur **"New Policy"**
3. Sélectionne **"For full customization"**
4. Configure la politique pour permettre les uploads :
   - **Policy name** : `Allow public uploads`
   - **Allowed operation** : `INSERT`
   - **Policy definition** : 
     ```sql
     true
     ```
   - Clique sur **"Review"** puis **"Save policy"**

5. Crée une deuxième politique pour permettre la lecture :
   - **Policy name** : `Allow public reads`
   - **Allowed operation** : `SELECT`
   - **Policy definition** :
     ```sql
     true
     ```
   - Clique sur **"Review"** puis **"Save policy"**

### 4. Récupérer les clés API

1. Dans ton projet Supabase, va dans **Settings** (⚙️ en bas à gauche)
2. Clique sur **"API"**
3. Tu verras deux informations importantes :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 5. Configurer les variables d'environnement

1. Dans ton projet, crée ou modifie le fichier `.env.local` à la racine du projet (`/Users/macbookpro/Desktop/aniresa/AniReserve/.env.local`)

2. Ajoute ces variables :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Remplace les valeurs par celles de ton projet Supabase
```

3. **Important** : 
   - Remplace `https://xxxxx.supabase.co` par ton **Project URL**
   - Remplace `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` par ton **anon public key**

### 6. Vérifier la configuration

1. Redémarre ton serveur de développement :
   ```bash
   # Arrête le serveur (Ctrl+C)
   # Puis relance :
   npm run dev
   ```

2. Teste l'upload d'un document :
   - Va sur la page d'inscription professionnel
   - Essaie d'uploader un fichier
   - Si ça fonctionne, tu verras une vraie URL Supabase au lieu d'une URL placeholder

## 🚀 Déploiement en Production

Si tu déploies sur Vercel, Netlify, ou un autre service :

1. Va dans les **Settings** de ton projet de déploiement
2. Trouve la section **"Environment Variables"** ou **"Variables d'environnement"**
3. Ajoute les deux variables :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redéploie ton application

## ✅ Vérification

Une fois configuré, les URLs des documents devraient ressembler à :
```
https://xxxxx.supabase.co/storage/v1/object/public/images/teoudat-zeout/1234567890-abc123.jpg
```

Au lieu de :
```
https://via.placeholder.com/400?text=...
```

## 🆘 Problèmes courants

### Les images ne s'affichent pas
- Vérifie que le bucket est **public**
- Vérifie que les politiques de sécurité sont bien configurées
- Vérifie que les variables d'environnement sont correctement définies

### Erreur "Bucket not found"
- Vérifie que le bucket s'appelle exactement `images`
- Vérifie que tu es dans le bon projet Supabase

### Erreur "Invalid API key"
- Vérifie que tu utilises la clé **anon public** et non la clé **service_role**
- Vérifie qu'il n'y a pas d'espaces dans les variables d'environnement

## 📚 Documentation Supabase

- Documentation Storage : https://supabase.com/docs/guides/storage
- Guide d'authentification : https://supabase.com/docs/guides/auth




