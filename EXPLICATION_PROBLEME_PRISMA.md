# 🔍 Explication du Problème Prisma

## 📁 Structure du Projet (Monorepo)

```
/var/www/anireserve/
├── prisma/
│   └── schema.prisma          ← Schema Prisma ICI
├── apps/
│   └── web/
│       ├── .env               ← Variables d'environnement ICI (avec DATABASE_URL)
│       ├── package.json
│       └── src/
└── package.json
```

## ❌ Le Problème

1. **Le schema Prisma** est à la racine : `/var/www/anireserve/prisma/schema.prisma`
2. **L'application Next.js** est dans : `/var/www/anireserve/apps/web`
3. **Le fichier `.env`** avec `DATABASE_URL` est dans : `/var/www/anireserve/apps/web/.env`

### Quand on essaie de générer Prisma :

**Depuis la racine** (`/var/www/anireserve`):
- ✅ Trouve le schema : `prisma/schema.prisma`
- ❌ Ne trouve PAS le `.env` : cherche `/var/www/anireserve/.env` (n'existe pas)
- ❌ Erreur : `Missing required environment variable: DATABASE_URL`

**Depuis apps/web** (`/var/www/anireserve/apps/web`):
- ✅ Trouve le `.env` : `apps/web/.env`
- ❌ Ne trouve PAS le schema : cherche `apps/web/prisma/schema.prisma` (n'existe pas)
- ❌ Erreur : `Could not find Prisma Schema`

## ✅ Solutions

### Solution 1 : Copier le schema dans apps/web (RECOMMANDÉ)

```bash
cd /var/www/anireserve/apps/web
mkdir -p prisma
cp ../../prisma/schema.prisma prisma/
npx prisma generate --schema=./prisma/schema.prisma
npm run build
```

**Avantages :**
- Tout est au même endroit (apps/web)
- Le `.env` est au bon endroit
- Simple et clair

### Solution 2 : Copier .env à la racine

```bash
cp /var/www/anireserve/apps/web/.env /var/www/anireserve/.env
cd /var/www/anireserve
npx prisma generate
cd apps/web
npm run build
```

**Avantages :**
- Le schema reste à la racine
- Prisma peut le trouver

**Inconvénients :**
- Deux fichiers `.env` à maintenir

### Solution 3 : Lien symbolique

```bash
cd /var/www/anireserve/apps/web
mkdir -p prisma
ln -s ../../prisma/schema.prisma prisma/schema.prisma
npx prisma generate --schema=./prisma/schema.prisma
npm run build
```

**Avantages :**
- Pas de duplication
- Le schema reste à la racine

## 🎯 Solution Recommandée

**Copier le schema dans apps/web** car :
1. C'est la solution la plus simple
2. Chaque app peut avoir son propre schema si besoin
3. Pas de problème de chemins relatifs
4. Le build fonctionne directement

## 📋 Commandes Complètes

```bash
cd /var/www/anireserve/apps/web

# 1. Créer le dossier prisma
mkdir -p prisma

# 2. Copier le schema
cp ../../prisma/schema.prisma prisma/

# 3. Générer Prisma Client
npx prisma generate --schema=./prisma/schema.prisma

# 4. Vérifier que c'est généré
ls -la node_modules/.prisma/client

# 5. Build
npm run build

# 6. Démarrer PM2
pm2 start ecosystem.config.js
pm2 save
```

## 🔍 Pourquoi ce Problème ?

C'est un problème classique avec les **monorepos** :
- Le schema Prisma est souvent partagé à la racine
- Mais chaque app a son propre `.env`
- Prisma a besoin des deux au même endroit

## ✅ Après Correction

Une fois le schema copié et Prisma généré :
- ✅ `npm run build` fonctionnera
- ✅ L'application démarrera correctement
- ✅ Plus d'erreur "Prisma Client did not initialize"

---

**En résumé :** Prisma ne trouve pas le schema ET le .env au même endroit. La solution est de copier le schema dans `apps/web/prisma/` pour que tout soit au même endroit.
