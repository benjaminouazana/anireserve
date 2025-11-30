# 🚀 Guide de Déploiement Vercel + Hostinger

## 📋 Vue d'Ensemble

Ce guide vous permet de :
- ✅ Déployer votre site Next.js sur Vercel
- ✅ Connecter votre domaine Hostinger (anireserve.com) à Vercel
- ✅ Garder vos emails chez Hostinger

---

## Étape 1 : Préparer le Projet

### 1.1 Vérifier que tout est sur GitHub

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
git status
git push origin main  # Si nécessaire
```

✅ Votre code doit être sur GitHub : `https://github.com/benjaminouazana/anireserve`

---

## Étape 2 : Créer un Compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à votre compte GitHub

---

## Étape 3 : Déployer le Projet sur Vercel

### 3.1 Importer le Projet

1. Dans Vercel, cliquez sur **"Add New..."** → **"Project"**
2. Sélectionnez votre repository : `benjaminouazana/anireserve`
3. Vercel détectera automatiquement que c'est un projet Next.js

### 3.2 Configuration du Projet

**Root Directory** : 
- Cliquez sur **"Edit"** à côté de "Root Directory"
- Sélectionnez : `apps/web`

**Framework Preset** : 
- Next.js (détecté automatiquement)

**Build Command** : 
- Laisser par défaut : `npm run build` ou `next build`

**Output Directory** : 
- Laisser par défaut : `.next`

**Install Command** : 
- Laisser par défaut : `npm install`

### 3.3 Variables d'Environnement

Cliquez sur **"Environment Variables"** et ajoutez :

```env
# Base de données
DATABASE_URL=votre_url_postgresql

# Next.js
NEXT_PUBLIC_APP_URL=https://anireserve.com
NODE_ENV=production

# Supabase (si utilisé)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service

# Email (Resend)
RESEND_API_KEY=votre-clé-resend
FROM_EMAIL=noreply@anireserve.com

# Stripe (si utilisé)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
```

⚠️ **Important** : Remplacez toutes les valeurs par vos vraies clés !

### 3.4 Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes
3. Votre site sera disponible sur : `https://votre-projet.vercel.app`

---

## Étape 4 : Ajouter le Domaine Personnalisé

### 4.1 Dans Vercel

1. Allez dans votre projet → **"Settings"** → **"Domains"**
2. Cliquez sur **"Add Domain"**
3. Entrez : `anireserve.com`
4. Cliquez sur **"Add"**

### 4.2 Récupérer les Enregistrements DNS

Vercel va vous afficher quelque chose comme :

```
Pour anireserve.com :
Type: A
Nom: @
Valeur: 76.76.21.21

Pour www.anireserve.com :
Type: CNAME
Nom: www
Valeur: cname.vercel-dns.com
```

📝 **Notez ces valeurs exactement** (elles seront différentes pour vous)

---

## Étape 5 : Configurer les DNS sur Hostinger

### 5.1 Accéder à la Zone DNS

1. Connectez-vous à [hPanel Hostinger](https://hpanel.hostinger.com)
2. Allez dans **"Domaines"** → **"anireserve.com"** → **"DNS Zone"**

### 5.2 Modifier les Enregistrements

#### Pour le domaine principal (anireserve.com)

1. Cherchez l'enregistrement **A** avec le nom `@` ou vide
2. **Modifiez-le** avec la valeur fournie par Vercel (ex: `76.76.21.21`)
   - Si il n'existe pas, **ajoutez-le** :
     - Type : `A`
     - Nom : `@` (ou laisser vide)
     - Valeur : `[IP fournie par Vercel]`
     - TTL : `3600` (ou par défaut)

#### Pour www.anireserve.com

1. Cherchez l'enregistrement **CNAME** avec le nom `www`
2. **Modifiez-le** avec la valeur fournie par Vercel (ex: `cname.vercel-dns.com`)
   - Si il n'existe pas, **ajoutez-le** :
     - Type : `CNAME`
     - Nom : `www`
     - Valeur : `[valeur fournie par Vercel]`
     - TTL : `3600` (ou par défaut)

### 5.3 ⚠️ IMPORTANT : Ne PAS Toucher aux Emails

**Laissez intacts** ces enregistrements :
- ✅ **MX** (pour les emails)
- ✅ **SPF** (Type: TXT, pour les emails)
- ✅ **DKIM** (Type: TXT, pour les emails)

**Exemple d'enregistrements MX à garder** :
```
Type: MX
Nom: @
Valeur: mx1.hostinger.com
Priorité: 10

Type: MX
Nom: @
Valeur: mx2.hostinger.com
Priorité: 20
```

### 5.4 Sauvegarder

1. Cliquez sur **"Sauvegarder"** ou **"Save"**
2. Les modifications sont immédiates, mais la propagation peut prendre jusqu'à 24h

---

## Étape 6 : Vérifier la Configuration

### 6.1 Dans Vercel

1. Retournez dans Vercel → **"Settings"** → **"Domains"**
2. Vérifiez que `anireserve.com` est marqué comme **"Valid Configuration"**
3. Si c'est marqué **"Pending"**, attendez quelques minutes

### 6.2 Tester le Site

1. Attendez 5-10 minutes (propagation DNS)
2. Visitez : `https://anireserve.com`
3. Vérifiez que le site s'affiche correctement

### 6.3 Vérifier les Emails

1. Envoyez un email de test à une de vos adresses Hostinger
2. Vérifiez que vous recevez bien l'email
3. Si oui, les emails fonctionnent toujours ✅

---

## ⚠️ Dépannage

### Le domaine ne se connecte pas

1. Vérifiez que les DNS sont bien sauvegardés sur Hostinger
2. Attendez 24h maximum (propagation DNS)
3. Vérifiez les valeurs DNS avec : `dig anireserve.com` ou [whatsmydns.net](https://www.whatsmydns.net)

### Les emails ne fonctionnent plus

1. Vérifiez que les enregistrements MX sont toujours présents
2. Vérifiez que vous n'avez pas supprimé les TXT (SPF, DKIM)
3. Contactez le support Hostinger si nécessaire

### Le site ne s'affiche pas

1. Vérifiez que le déploiement Vercel est réussi
2. Vérifiez les variables d'environnement
3. Consultez les logs Vercel : **"Deployments"** → Cliquez sur le dernier déploiement

---

## 📝 Checklist Finale

- [ ] Code déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Domaine ajouté dans Vercel
- [ ] Enregistrements DNS modifiés sur Hostinger
- [ ] Enregistrements MX conservés (emails)
- [ ] Site accessible sur anireserve.com
- [ ] Emails fonctionnent toujours
- [ ] SSL/HTTPS activé automatiquement

---

## 🎉 Félicitations !

Votre site est maintenant en ligne sur **anireserve.com** avec :
- ✅ Site hébergé sur Vercel (rapide, optimisé)
- ✅ Emails chez Hostinger (inchangés)
- ✅ SSL/HTTPS automatique
- ✅ Déploiement automatique depuis GitHub

---

**Besoin d'aide ?** 
- Documentation Vercel : https://vercel.com/docs
- Support Hostinger : https://www.hostinger.com/contact

---

**Dernière mise à jour** : $(date)

