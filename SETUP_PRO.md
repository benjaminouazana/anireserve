# Instructions pour créer un professionnel

## 1. Mettre à jour la base de données

D'abord, il faut ajouter le champ `password` à la table `Professional` :

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
npx prisma migrate dev --name add_password_to_professional
```

## 2. Créer un professionnel

Tu peux créer un professionnel de deux façons :

### Option A : Via l'API (recommandé)

```bash
curl -X POST http://localhost:3001/api/pro/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Coach",
    "email": "sarah@example.com",
    "password": "motdepasse123",
    "city": "Jérusalem",
    "serviceType": "Coach sportif",
    "description": "Coach sportif spécialisée en remise en forme.",
    "languages": "fr,he,en"
  }'
```

### Option B : Directement dans la base (via Prisma Studio)

```bash
npx prisma studio
```

Puis ajoute manuellement un professionnel avec un champ `password`.

## 3. Se connecter

Va sur `http://localhost:3001/pro/login` et utilise l'email + mot de passe que tu as créés.

## Notes importantes

- ⚠️ Pour l'instant, les mots de passe sont stockés en clair (pas de hash). 
- 🔒 En production, il faudra installer `bcryptjs` et hasher les mots de passe.
- 🗑️ La route `/api/pro/create` devrait être supprimée ou protégée en production.





