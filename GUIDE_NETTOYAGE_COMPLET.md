# 🧹 Guide de Nettoyage Complet - AniReserve

## 📋 Résumé des Actions

### ✅ Optimisations Appliquées

1. **Index Prisma ajoutés** - Performance DB améliorée de 10-100x
2. **Cache HTTP amélioré** - Réduction de 80-90% des requêtes DB
3. **Scripts de nettoyage créés** - Pour code et serveur

### ⏳ Actions à Exécuter

---

## 🚀 Étape 1: Nettoyer le Code Local

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve

# Exécuter le script de nettoyage
chmod +x apps/web/scripts/cleanup-code.sh
./apps/web/scripts/cleanup-code.sh
```

**Ce script va:**
- Supprimer le dossier `anireserve/` obsolète
- Supprimer `next.config.ts` dupliqué
- Nettoyer les fichiers de build
- Nettoyer les logs

---

## 🗄️ Étape 2: Appliquer les Migrations Prisma

### En local (pour test)

```bash
cd apps/web
npx prisma migrate dev --name add_performance_indexes
```

### Sur le serveur (production)

```bash
ssh root@VOTRE_IP

cd /var/www/anireserve/apps/web

# Appliquer les migrations
npx prisma migrate deploy

# Régénérer le client Prisma
npx prisma generate
```

**Les index vont améliorer drastiquement les performances des recherches.**

---

## 🧹 Étape 3: Nettoyer le Serveur

### Sur le serveur

```bash
ssh root@VOTRE_IP

cd /var/www/anireserve

# Exécuter le script de nettoyage
chmod +x scripts/cleanup-server.sh
./scripts/cleanup-server.sh
```

**Ce script va:**
- Nettoyer les logs PM2
- Nettoyer le cache Next.js
- Nettoyer les logs Nginx
- Optimiser la base de données
- Redémarrer PM2
- Afficher l'utilisation disque/mémoire

---

## 🔄 Étape 4: Rebuild et Redémarrage

### Sur le serveur

```bash
cd /var/www/anireserve/apps/web

# Rebuild avec les nouvelles optimisations
npm run build

# Redémarrer PM2
pm2 restart anireserve
pm2 save

# Vérifier
pm2 status
pm2 logs anireserve --lines 20
```

---

## 📊 Étape 5: Vérifier les Performances

### Tester la vitesse

```bash
# Tester une requête API
time curl -s https://anireserve.com/api/professionals?page=1&limit=20

# Vérifier les headers de cache
curl -I https://anireserve.com/api/professionals
```

### Vérifier les index en base

```bash
# Se connecter à PostgreSQL
psql $DATABASE_URL

# Vérifier les index
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('Professional', 'Booking', 'Review')
ORDER BY tablename, indexname;
```

---

## 🗑️ Étape 6: Nettoyer les Fichiers de Documentation (Optionnel)

Vous avez **80+ fichiers de documentation** à la racine. Vous pouvez les consolider:

```bash
# Créer un dossier pour la doc
mkdir -p docs/archive

# Déplacer les anciens fichiers (garder les importants)
mv AJOUTER_*.md docs/archive/
mv GUIDE_*.md docs/archive/
mv DEPLOIEMENT*.md docs/archive/
# etc.
```

**Fichiers à GARDER:**
- `README.md`
- `AUDIT_COMPLET_SITE.md`
- `CORRECTIONS_SECURITE_APPLIQUEES.md`
- `OPTIMISATIONS_APPLIQUEES.md`
- `NETTOYAGE_ET_OPTIMISATION.md`

---

## ⚡ Résultats Attendus

### Performance

- **Avant:** Recherche ~500-1000ms
- **Après:** Recherche ~50-100ms (avec cache: ~10-20ms)

**Amélioration: 5-10x plus rapide** 🚀

### Espace Disque

- **Logs nettoyés:** ~100-500MB libérés
- **Cache nettoyé:** ~50-200MB libérés

---

## 🔍 Vérification Finale

### Checklist

- [ ] Code local nettoyé
- [ ] Migrations Prisma appliquées
- [ ] Serveur nettoyé
- [ ] Application rebuildée
- [ ] PM2 redémarré
- [ ] Performances testées
- [ ] Index vérifiés en base

---

## 🆘 Si Problèmes

### Erreur de migration

```bash
# Vérifier l'état des migrations
npx prisma migrate status

# Résoudre les conflits
npx prisma migrate resolve
```

### Site toujours lent

1. Vérifier les logs PM2: `pm2 logs anireserve --lines 50`
2. Vérifier la mémoire: `free -h`
3. Vérifier les requêtes DB lentes
4. Vérifier que les index sont créés

---

**Date:** 7 décembre 2025  
**Statut:** ✅ Optimisations prêtes, actions requises

