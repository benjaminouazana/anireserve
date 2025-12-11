# Finaliser la configuration de la base de données

## Étapes à suivre

### 1. Vérifier que la DATABASE_URL est bien dans .env

Assure-toi que ton fichier `.env` à la racine de `AniReserve` contient :
```env
DATABASE_URL="postgresql://postgres:TON_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres"
```

### 2. Créer les tables dans PostgreSQL

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
npx prisma migrate dev --name init_postgres
```

Cette commande va :
- Créer les tables `Professional`, `Client`, et `Booking` dans ta base Supabase
- Créer un dossier `prisma/migrations` avec l'historique

### 3. Générer le client Prisma

```bash
npx prisma generate
```

### 4. Vérifier que ça marche

```bash
npx prisma studio
```

Ça va ouvrir une interface web où tu peux voir tes tables (vides pour l'instant).

### 5. Redémarrer le serveur Next.js

Arrête ton serveur actuel (Ctrl + C) puis relance :
```bash
npm run dev --workspace web
```

### 6. Tester

- Va sur `http://localhost:3001` (ou 3000)
- Crée un professionnel via l'API ou Prisma Studio
- Connecte-toi sur `/pro/login`
- Vérifie que tout fonctionne !

---

## Si tu as une erreur

**Erreur de connexion** : Vérifie que ta `DATABASE_URL` est correcte et que le mot de passe est bien remplacé.

**Erreur "relation does not exist"** : Lance `npx prisma migrate dev` pour créer les tables.

**Erreur Prisma client** : Lance `npx prisma generate`.













