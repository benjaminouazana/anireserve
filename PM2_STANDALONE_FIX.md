# ✅ Correction PM2 pour output: standalone

## Problème résolu

Next.js avec `output: 'standalone'` ne peut pas utiliser `next start`. Il faut utiliser le serveur standalone généré.

## Solution appliquée

Le fichier `ecosystem.config.js` a été corrigé pour utiliser :

```javascript
script: 'node',
args: '.next/standalone/server.js',
```

## Commandes sur le serveur

```bash
# 1. Récupérer la correction
cd /var/www/anireserve
git pull

# 2. Vérifier que le build standalone existe
cd apps/web
ls -la .next/standalone/server.js

# Si le fichier n'existe pas, rebuilder :
npm run build

# 3. Vérifier que le fichier existe maintenant
ls -la .next/standalone/server.js

# 4. Créer le dossier logs
mkdir -p logs

# 5. Redémarrer PM2
pm2 delete anireserve
pm2 start ../../ecosystem.config.js
pm2 save
pm2 status

# 6. Vérifier les logs
pm2 logs anireserve --lines 30 --nostream
```

## Vérification

PM2 devrait maintenant démarrer correctement. Vous devriez voir :

```
┌────┬───────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┐
│ id │ name      │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │
├────┼───────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┤
│ 0  │ anireserve│ default     │ N/A     │ cluster │ 12345    │ 0s     │ 0    │ online    │
└────┴───────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┘
```

Et dans les logs :
```
✓ Ready in Xs
```

## Note importante

Avec `output: 'standalone'`, Next.js génère un serveur autonome dans `.next/standalone/`. Ce serveur contient toutes les dépendances nécessaires et peut être exécuté directement avec Node.js sans avoir besoin de `node_modules` dans le répertoire parent.

C'est pourquoi on utilise `node .next/standalone/server.js` au lieu de `next start`.
