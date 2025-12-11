# ✅ Checklist de Déploiement - AniReserve

Utilise cette checklist pour t'assurer que tout est prêt avant de mettre le site en ligne.

## 📋 Pré-Déploiement

### Base de Données
- [ ] Base de données PostgreSQL créée (Supabase, Railway, etc.)
- [ ] `DATABASE_URL` récupérée et testée
- [ ] Migrations Prisma appliquées (`npx prisma migrate deploy`)
- [ ] Prisma Client généré (`npx prisma generate`)
- [ ] Test de connexion à la base de données réussi

### Supabase (Fichiers)
- [ ] Compte Supabase créé
- [ ] Projet Supabase créé
- [ ] Bucket `documents` créé dans Storage
- [ ] Politiques de sécurité configurées
- [ ] `NEXT_PUBLIC_SUPABASE_URL` récupérée
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` récupérée
- [ ] `SUPABASE_SERVICE_ROLE_KEY` récupérée (⚠️ SECRET)

### Resend (Emails)
- [ ] Compte Resend créé
- [ ] Clé API Resend créée
- [ ] `RESEND_API_KEY` récupérée
- [ ] Domaine vérifié dans Resend (optionnel mais recommandé)

### Code
- [ ] Tous les fichiers commités sur GitHub
- [ ] Pas d'erreurs de linting
- [ ] Build local réussi (`npm run build`)
- [ ] Tests locaux effectués

## 🚀 Déploiement Vercel

### Configuration Projet
- [ ] Projet Vercel créé
- [ ] Repository GitHub connecté
- [ ] Root Directory : vide (ou `apps/web` si nécessaire)
- [ ] Build Command : `cd apps/web && npx prisma generate && npm run build`
- [ ] Output Directory : `apps/web/.next`
- [ ] Install Command : `npm install`
- [ ] Framework : Next.js (détecté automatiquement)

### Variables d'Environnement
- [ ] `DATABASE_URL` ajoutée
- [ ] `NEXT_PUBLIC_SUPABASE_URL` ajoutée
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` ajoutée
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ajoutée (⚠️ SECRET)
- [ ] `RESEND_API_KEY` ajoutée
- [ ] `NEXT_PUBLIC_BASE_URL` ajoutée (URL de production)
- [ ] `ADMIN_EMAIL` ajoutée (optionnel)
- [ ] `ADMIN_PASSWORD` ajoutée (optionnel)

### Déploiement
- [ ] Premier déploiement lancé
- [ ] Build réussi (vérifier les logs)
- [ ] Site accessible sur l'URL Vercel temporaire
- [ ] Pas d'erreurs dans les logs

## 🌐 Nom de Domaine

### Configuration DNS
- [ ] Nom de domaine ajouté dans Vercel
- [ ] Instructions DNS récupérées
- [ ] Enregistrements DNS configurés chez le registrar
- [ ] Propagation DNS vérifiée (peut prendre jusqu'à 48h)
- [ ] SSL/HTTPS activé automatiquement par Vercel

## 👤 Compte Admin

- [ ] Compte admin créé (via API ou directement en DB)
- [ ] Connexion admin testée
- [ ] Accès au dashboard admin vérifié

## 🧪 Tests Post-Déploiement

### Fonctionnalités Principales
- [ ] Page d'accueil s'affiche
- [ ] Professionnels s'affichent (suggestions par défaut)
- [ ] Recherche fonctionne
- [ ] Filtres fonctionnent (ville, service, etc.)

### Authentification
- [ ] Inscription client fonctionne
- [ ] Connexion client fonctionne
- [ ] Inscription pro fonctionne
- [ ] Connexion pro fonctionne
- [ ] Mot de passe oublié fonctionne (client)
- [ ] Mot de passe oublié fonctionne (pro)
- [ ] Connexion admin fonctionne

### Réservations
- [ ] Sélection d'un professionnel fonctionne
- [ ] Créneaux s'affichent pour une date
- [ ] Création de réservation fonctionne
- [ ] Email de confirmation reçu (client)
- [ ] Email de notification reçu (pro)

### Professionnels
- [ ] Upload Teoudate Zeoute fonctionne
- [ ] Validation admin fonctionne
- [ ] Profil professionnel s'affiche
- [ ] Dashboard pro fonctionne
- [ ] Confirmation/annulation de réservation fonctionne

### Autres Fonctionnalités
- [ ] Chat fonctionne
- [ ] Favoris fonctionnent
- [ ] Analytics fonctionnent
- [ ] Footer et liens fonctionnent
- [ ] Pages statiques accessibles (FAQ, CGV, etc.)

## 🔒 Sécurité

- [ ] HTTPS activé (vérifier le cadenas dans le navigateur)
- [ ] Variables d'environnement secrètes non exposées
- [ ] Mots de passe admin forts
- [ ] Base de données accessible uniquement depuis Vercel

## 📊 Monitoring

- [ ] Vercel Analytics activé (optionnel)
- [ ] Logs Vercel accessibles
- [ ] Monitoring des erreurs configuré (optionnel : Sentry)

## ✅ Finalisation

- [ ] Tous les tests passés
- [ ] Site fonctionnel en production
- [ ] Documentation à jour
- [ ] Backup de la base de données configuré
- [ ] Plan de maintenance établi

## 🎉 Félicitations !

Ton site est maintenant en ligne ! 🚀













