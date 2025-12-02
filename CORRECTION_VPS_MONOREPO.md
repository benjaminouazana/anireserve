# 🔧 Correction Installation Monorepo sur VPS

## ❌ Problème

Le projet est un **monorepo** (Turbo). Prisma est installé à la **racine**, mais l'installation a été faite seulement dans `apps/web`.

## ✅ Solution

Il faut installer les dépendances à la **racine** du projet, puis dans `apps/web`.

### Commandes à exécuter sur le VPS :

```bash
# 1. Aller à la racine du projet
cd /root/anireserve

# 2. Installer les dépendances à la racine (Prisma est ici)
npm install

# 3. Aller dans apps/web
cd apps/web

# 4. Installer les dépendances de l'app
npm install

# 5. Générer Prisma Client (depuis la racine ou apps/web)
npx prisma generate

# 6. Builder
npm run build
```

---

## 📝 Explication

Dans un monorepo :
- **Prisma** est à la racine (`/root/anireserve/`)
- **Next.js** est dans `apps/web`
- Il faut installer les deux

---

## 🚀 Commandes Complètes (Copier-Coller)

```bash
cd /root/anireserve
npm install
cd apps/web
npm install
npx prisma generate
npm run build
npm start
```

---

**Dernière mise à jour** : $(date)



