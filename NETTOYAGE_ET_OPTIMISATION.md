# 🧹 Nettoyage et Optimisation - AniReserve

## 🎯 Objectifs

1. Nettoyer le code (fichiers obsolètes, duplications)
2. Optimiser les performances (DB, cache, requêtes)
3. Nettoyer le serveur (logs, cache, processus)
4. Améliorer la vitesse du site

---

## 📋 Plan d'Action

### Phase 1: Nettoyage du Code

#### Fichiers à supprimer/consolider

1. **Dossier `anireserve/` obsolète** - Ancien projet
2. **Fichiers de documentation dupliqués** - Consolider en un seul README
3. **`next.config.ts`** - Dupliqué avec `next.config.js`
4. **Scripts obsolètes** - Nettoyer les scripts non utilisés

#### Fichiers de documentation à consolider

- Garder: `README.md`, `AUDIT_COMPLET_SITE.md`, `CORRECTIONS_SECURITE_APPLIQUEES.md`
- Supprimer: Les 80+ fichiers de documentation obsolètes

---

### Phase 2: Optimisation Base de Données

#### Problèmes identifiés

1. **Requêtes N+1 potentielles** dans `/api/professionals`
2. **Pas d'index** sur certains champs fréquemment recherchés
3. **Pas de cache** pour les requêtes statiques
4. **Pagination** déjà implémentée ✅

#### Optimisations à appliquer

1. Ajouter des index Prisma
2. Optimiser les requêtes avec `select` (déjà fait partiellement)
3. Ajouter du cache HTTP pour les routes API
4. Utiliser `Promise.all` pour les requêtes parallèles

---

### Phase 3: Optimisation Frontend

1. **Lazy loading** des composants lourds
2. **Optimisation des images** (déjà configuré ✅)
3. **Code splitting** automatique Next.js
4. **Cache des assets statiques**

---

### Phase 4: Nettoyage Serveur

1. **Nettoyer les logs** PM2
2. **Nettoyer le cache** Next.js
3. **Optimiser Nginx** (compression, cache)
4. **Vérifier les processus** inutiles

---

## 🚀 Scripts de Nettoyage

Voir les scripts créés dans ce document.

