# 📝 Commandes à Exécuter sur le VPS

## 1. Créer le fichier .env dans apps/web

```bash
cd /root/anireserve/apps/web
nano .env
```

Collez ce contenu :

```env
DATABASE_URL=postgresql://postgres:oe5OGBYSfDeU5aiX@db.atpzrfjxnzteqyrlrhgt.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=https://anireserve.com
NODE_ENV=production
```

Sauvegardez : `Ctrl+X`, puis `Y`, puis `Enter`

## 2. Générer Prisma Client

```bash
npx prisma generate
```

## 3. Appliquer les migrations

```bash
npx prisma migrate deploy
```

## 4. Builder l'application

```bash
npm run build
```

## 5. Lancer l'application

```bash
npm start
```

---

## Alternative : Tout en une fois

```bash
cd /root/anireserve/apps/web
nano .env
# Collez le contenu du .env, sauvegardez
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```










