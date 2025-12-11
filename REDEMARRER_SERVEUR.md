# 🚀 Redémarrer le Serveur

## État Actuel

✅ **Base de données** : Connectée (Supabase)
✅ **Variables d'environnement** : Configurées
❌ **Serveur Next.js** : Arrêté

## Pour Redémarrer le Serveur

### Option 1 : Depuis le terminal (Recommandé)

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve/apps/web
npm run dev
```

Le serveur sera accessible sur : **http://localhost:3000**

### Option 2 : Depuis la racine du projet

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
npm run dev:web
```

## Vérifier que ça fonctionne

Une fois le serveur démarré, tu devrais voir :
```
✓ Ready in Xs
○ Compiling / ...
✓ Compiled / in Xs
```

Puis ouvre ton navigateur sur : **http://localhost:3000**

## Si le serveur ne démarre pas

1. **Vérifier les erreurs** dans le terminal
2. **Vérifier le port 3000** n'est pas déjà utilisé :
   ```bash
   lsof -ti:3000
   ```
3. **Nettoyer le cache** :
   ```bash
   rm -rf apps/web/.next
   npm run dev
   ```

## Problèmes Courants

- **Port déjà utilisé** : Tuer le processus avec `pkill -f "next dev"`
- **Erreur de compilation** : Vérifier les erreurs TypeScript
- **Base de données** : Vérifier que `DATABASE_URL` est correcte dans `.env`













