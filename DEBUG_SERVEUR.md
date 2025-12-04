# 🔍 Debug - Serveur Déconnecté

## Problèmes Possibles

### 1. Base de données non accessible
- La variable `DATABASE_URL` n'est pas définie
- La base de données est hors ligne
- Les identifiants sont incorrects

### 2. Serveur Next.js crashé
- Erreur au démarrage
- Port 3000 déjà utilisé
- Problème de mémoire

### 3. Variables d'environnement manquantes
- Fichier `.env` manquant
- Variables non chargées

## Solutions

### Vérifier la connexion à la base de données
```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
npx prisma db pull
```

### Vérifier les variables d'environnement
```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
cat .env | grep DATABASE_URL
```

### Redémarrer le serveur
```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
# Arrêter tous les processus Next.js
pkill -f "next dev"

# Redémarrer
cd apps/web
npm run dev
```

### Vérifier les logs
Regarde la console où le serveur tourne pour voir les erreurs.








