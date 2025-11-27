# Installation de l'adapter PostgreSQL pour Prisma 7

## Installer les packages nécessaires

Dans le terminal, à la racine de `AniReserve`, lance :

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
npm install pg @prisma/adapter-pg
npm install -D @types/pg
```

## Redémarrer le serveur

Après l'installation :

```bash
npm run dev --workspace web
```

## Vérifier que ça marche

Ouvre `http://localhost:3001/api/test-db` dans ton navigateur. Tu devrais voir un JSON avec `"success": true`.

