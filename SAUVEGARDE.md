# 📦 Guide de Sauvegarde - AniReserve

## 📍 Où sont stockés vos fichiers ?

### 1. **Code source (local)**
- **Emplacement** : `/Users/macbookpro/Desktop/aniresa/AniReserve/`
- **Contenu** : Tous vos fichiers de code (Next.js, Prisma, etc.)
- **Sauvegarde** : ✅ Maintenant versionné avec Git (commit initial créé)

### 2. **Base de données (Supabase - Cloud)**
- **Emplacement** : Supabase (serveur cloud PostgreSQL)
- **Contenu** : Toutes vos données (professionnels, clients, réservations, avis)
- **Sauvegarde** : ✅ Automatique par Supabase (backups quotidiens)
- **Accès** : Via votre compte Supabase

### 3. **Fichiers uploadés (Supabase Storage)**
- **Emplacement** : Supabase Storage (cloud)
- **Contenu** : Images de profil, galeries, etc.
- **Sauvegarde** : ✅ Inclus dans les backups Supabase

## 🔄 Comment sauvegarder ?

### Option 1 : Git + GitHub/GitLab (Recommandé)

1. **Créer un dépôt sur GitHub** :
   - Allez sur https://github.com
   - Créez un nouveau dépôt (privé ou public)
   - Copiez l'URL du dépôt

2. **Connecter votre projet** :
   ```bash
   cd /Users/macbookpro/Desktop/aniresa/AniReserve
   git remote add origin https://github.com/VOTRE-USERNAME/anireserve.git
   git push -u origin main
   ```

3. **Sauvegarder régulièrement** :
   ```bash
   git add .
   git commit -m "Description des changements"
   git push
   ```

### Option 2 : Backup local

```bash
# Créer une archive complète
cd /Users/macbookpro/Desktop/aniresa
tar -czf anireserve-backup-$(date +%Y%m%d).tar.gz AniReserve/
```

### Option 3 : Backup base de données Supabase

1. **Via l'interface Supabase** :
   - Allez sur votre projet Supabase
   - Settings → Database → Backups
   - Téléchargez un backup manuel si besoin

2. **Via Prisma** :
   ```bash
   # Exporter les données (nécessite pg_dump)
   pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
   ```

## ⚠️ Fichiers à NE PAS sauvegarder

Ces fichiers sont dans `.gitignore` et ne doivent pas être versionnés :
- `.env` (contient vos clés secrètes)
- `node_modules/` (dépendances, peuvent être réinstallées)
- `.next/` (fichiers de build temporaires)

## 📝 Checklist de sauvegarde

- [x] Git initialisé
- [ ] Dépôt distant créé (GitHub/GitLab)
- [ ] Premier push effectué
- [ ] Base de données Supabase configurée
- [ ] Backup Supabase vérifié

## 🚨 En cas de perte de données

1. **Code** : Récupérer depuis Git/GitHub
2. **Base de données** : Restaurer depuis les backups Supabase
3. **Fichiers uploadés** : Restaurer depuis Supabase Storage

## 📞 Support

- Documentation Supabase : https://supabase.com/docs
- Documentation Git : https://git-scm.com/doc
- Documentation Next.js : https://nextjs.org/docs













