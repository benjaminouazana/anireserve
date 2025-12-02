# Configuration de la base de données PostgreSQL

## Option 1 : Supabase (Recommandé - Gratuit)

### Étape 1 : Créer un compte Supabase

1. Va sur [https://supabase.com](https://supabase.com)
2. Clique sur "Start your project" et crée un compte (gratuit)
3. Crée un nouveau projet :
   - Nom du projet : `anireserve` (ou ce que tu veux)
   - Mot de passe : choisis un mot de passe fort (note-le quelque part !)
   - Région : choisis la plus proche (Europe de l'Ouest si tu es en Israël)

### Étape 2 : Récupérer la connection string

1. Dans ton projet Supabase, va dans **Settings** → **Database**
2. Scroll jusqu'à **Connection string** → **URI**
3. Copie la chaîne qui ressemble à :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
4. Remplace `[YOUR-PASSWORD]` par le mot de passe que tu as choisi

### Étape 3 : Configurer dans ton projet

1. Crée ou modifie le fichier `.env` à la racine de `AniReserve` :
   ```env
   DATABASE_URL="postgresql://postgres:TON_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres"
   ```

2. Lance la migration :
   ```bash
   cd /Users/macbookpro/Desktop/aniresa/AniReserve
   npx prisma migrate dev --name init_postgres
   ```

3. Génère le client Prisma :
   ```bash
   npx prisma generate
   ```

4. Redémarre ton serveur Next.js

### ✅ C'est tout ! Ta base de données est maintenant dans le cloud.

---

## Option 2 : Neon (PostgreSQL Serverless - Gratuit aussi)

1. Va sur [https://neon.tech](https://neon.tech)
2. Crée un compte et un projet
3. Copie la connection string depuis le dashboard
4. Mets-la dans ton `.env` comme ci-dessus

---

## Option 3 : PostgreSQL local (si tu as PostgreSQL installé)

Si tu as PostgreSQL installé sur ta machine :

```env
DATABASE_URL="postgresql://username:password@localhost:5432/anireserve"
```

Puis crée la base :
```bash
createdb anireserve
```

---

## Migration des données existantes (si tu as déjà des données en SQLite)

Si tu as déjà créé des professionnels/rendez-vous dans SQLite et que tu veux les garder :

1. Exporte les données de SQLite :
   ```bash
   npx prisma db pull  # pour voir la structure
   ```

2. Une fois PostgreSQL configuré, tu peux réimporter manuellement via Prisma Studio :
   ```bash
   npx prisma studio
   ```

Ou utilise un outil de migration SQL.

---

## Vérifier que ça marche

Après avoir configuré PostgreSQL, teste :

```bash
npx prisma studio
```

Tu devrais voir ta base PostgreSQL avec tes tables vides (ou avec tes données si tu as migré).






