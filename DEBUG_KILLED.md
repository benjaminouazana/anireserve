# 🔍 Debug - Processus "Killed"

## Problème identifié

Les processus PM2 sont tués ("Killed") immédiatement après le démarrage. Cela peut être dû à :

1. **Manque de mémoire (OOM - Out Of Memory)**
2. **Erreur au démarrage de l'application**
3. **Problème avec les variables d'environnement**
4. **Build corrompu ou incomplet**

## 🔧 Commandes de diagnostic

Exécutez ces commandes sur le serveur pour identifier le problème :

### 1. Vérifier les logs PM2

```bash
pm2 logs anireserve --lines 50
```

Cela vous montrera les dernières erreurs.

### 2. Vérifier la mémoire disponible

```bash
free -h
```

### 3. Vérifier les logs système pour les OOM

```bash
dmesg | tail -20 | grep -i "killed\|oom\|memory"
```

### 4. Vérifier que le build existe et est complet

```bash
cd /var/www/anireserve/apps/web
ls -la .next/standalone 2>/dev/null || echo "Standalone build n'existe pas"
ls -la .next/static 2>/dev/null || echo "Static files n'existent pas"
```

### 5. Vérifier les variables d'environnement

```bash
cd /var/www/anireserve/apps/web
ls -la .env
cat .env | grep DATABASE_URL
```

### 6. Tester manuellement Next.js

```bash
cd /var/www/anireserve/apps/web
NODE_ENV=production node_modules/.bin/next start
```

Si ça crash, vous verrez l'erreur exacte.

## 🚀 Solutions possibles

### Solution 1 : Rebuild complet

```bash
cd /var/www/anireserve/apps/web
rm -rf .next
npm run build
pm2 delete anireserve
pm2 start ecosystem.config.js
pm2 save
```

### Solution 2 : Vérifier la mémoire et ajuster PM2

Si vous avez peu de mémoire, modifiez `ecosystem.config.js` :

```bash
cd /var/www/anireserve/apps/web
nano ecosystem.config.js
```

Changez `max_memory_restart: '1G'` en `max_memory_restart: '512M'` ou `'256M'`

### Solution 3 : Utiliser le mode standard au lieu de standalone

Si le problème vient du mode standalone, modifiez `next.config.js` temporairement :

```bash
cd /var/www/anireserve/apps/web
# Commenter la ligne output: 'standalone'
sed -i "s|output: 'standalone',|// output: 'standalone',|g" next.config.js
npm run build
pm2 restart anireserve
```

### Solution 4 : Vérifier les permissions

```bash
cd /var/www/anireserve/apps/web
ls -la
# Les fichiers doivent être accessibles
chown -R root:root /var/www/anireserve
```

## 📋 Checklist de vérification

Exécutez ces commandes et notez les résultats :

```bash
# 1. Logs PM2
pm2 logs anireserve --lines 30

# 2. Mémoire
free -h

# 3. Build
ls -la /var/www/anireserve/apps/web/.next

# 4. Variables d'environnement
ls -la /var/www/anireserve/apps/web/.env

# 5. Test manuel
cd /var/www/anireserve/apps/web
timeout 10 node_modules/.bin/next start || echo "Processus arrêté ou crashé"
```

