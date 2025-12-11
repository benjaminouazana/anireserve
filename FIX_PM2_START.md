# 🔧 Correction PM2 - Script Next.js non trouvé

## Problème

```
[PM2][ERROR] Error: Script not found: /var/www/anireserve/apps/web/node_modules/next/dist/bin/next
```

## Solutions

### Solution 1: Vérifier l'installation (RECOMMANDÉ)

```bash
cd /var/www/anireserve/apps/web

# 1. Vérifier que node_modules existe
ls -la node_modules/.bin/next

# 2. Si absent, réinstaller
rm -rf node_modules package-lock.json
npm install

# 3. Vérifier que Next.js est installé
npm list next

# 4. Rebuilder
npm run build

# 5. Vérifier que le build existe
ls -la .next/standalone/server.js

# 6. Redémarrer PM2
pm2 delete anireserve
pm2 start ../../ecosystem.config.js
pm2 save
pm2 status
```

### Solution 2: Utiliser npm start directement

Si `node_modules/.bin/next` n'existe pas, utiliser npm :

```bash
cd /var/www/anireserve
nano ecosystem.config.js
```

Modifier pour utiliser npm directement :

```javascript
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    script: 'npm',
    args: 'start',
    // ... reste de la config
  }]
};
```

### Solution 3: Utiliser le serveur standalone

Si `output: 'standalone'` est activé dans `next.config.js`, utiliser le serveur standalone :

```javascript
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    script: '.next/standalone/server.js',
    // ... reste de la config
  }]
};
```

**Mais d'abord, vérifier que le fichier existe :**
```bash
ls -la .next/standalone/server.js
```

### Solution 4: Script de démarrage personnalisé

Créer un script de démarrage :

```bash
cd /var/www/anireserve/apps/web
cat > start.sh << 'EOF'
#!/bin/bash
cd /var/www/anireserve/apps/web
npm start
EOF
chmod +x start.sh
```

Puis dans `ecosystem.config.js` :

```javascript
script: '/var/www/anireserve/apps/web/start.sh',
```

## Diagnostic complet

Exécuter ces commandes pour diagnostiquer :

```bash
cd /var/www/anireserve/apps/web

# 1. Vérifier Node.js
node --version
npm --version

# 2. Vérifier l'installation
ls -la node_modules/.bin/ | grep next
npm list next

# 3. Vérifier le build
ls -la .next/
ls -la .next/standalone/ 2>/dev/null || echo "Standalone non trouvé"

# 4. Tester manuellement
npm start
# (Appuyer sur Ctrl+C après vérification)

# 5. Vérifier les permissions
ls -la node_modules/.bin/next
```

## Solution recommandée (étape par étape)

```bash
# 1. Nettoyer et réinstaller
cd /var/www/anireserve/apps/web
rm -rf node_modules package-lock.json .next
npm install

# 2. Vérifier l'installation
npm list next
which next || echo "Next.js non trouvé dans PATH"

# 3. Builder
npm run build

# 4. Vérifier le build
ls -la .next/standalone/server.js || ls -la node_modules/.bin/next

# 5. Mettre à jour ecosystem.config.js
cd /var/www/anireserve
git pull  # Pour récupérer la correction

# 6. Redémarrer PM2
cd /var/www/anireserve/apps/web
pm2 delete anireserve
pm2 start ../../ecosystem.config.js
pm2 save
pm2 status
pm2 logs anireserve --lines 30 --nostream
```

## Vérification finale

PM2 devrait maintenant démarrer. Vérifier :

```bash
pm2 status
pm2 logs anireserve --lines 50
```

Vous devriez voir :
```
┌────┬───────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┐
│ id │ name      │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │
├────┼───────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┤
│ 0  │ anireserve│ default     │ N/A     │ cluster │ 12345    │ 0s     │ 0    │ online    │
└────┴───────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┘
```
