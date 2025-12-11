# 🔍 Diagnostic - Site Inaccessible (ERR_CONNECTION_TIMED_OUT)

## Problème

Le site `anireserve.com` retourne `ERR_CONNECTION_TIMED_OUT`, ce qui signifie que le serveur ne répond pas.

## Checklist de Diagnostic

### 1. Vérifier que PM2 est démarré

```bash
pm2 status
```

**Si PM2 n'est pas démarré ou montre "errored" :**
```bash
cd /var/www/anireserve/apps/web
pm2 logs anireserve --lines 50
```

### 2. Vérifier que le serveur écoute sur le port 3000

```bash
netstat -tulpn | grep :3000
# ou
ss -tulpn | grep :3000
```

**Si rien n'écoute sur le port 3000 :**
- PM2 n'a pas démarré correctement
- Voir les logs PM2 pour l'erreur

### 3. Vérifier que le build standalone existe

```bash
cd /var/www/anireserve/apps/web
ls -la .next/standalone/server.js
```

**Si le fichier n'existe pas :**
```bash
npm run build
```

### 4. Vérifier Nginx

```bash
# Vérifier que Nginx tourne
systemctl status nginx

# Vérifier la config Nginx
nginx -t

# Vérifier les logs Nginx
tail -50 /var/log/nginx/anireserve-error.log
tail -50 /var/log/nginx/error.log
```

### 5. Vérifier le firewall

```bash
# Vérifier que le port 80 et 443 sont ouverts
ufw status
# ou
iptables -L -n | grep -E "(80|443)"
```

## Solutions par problème

### Problème 1: PM2 ne démarre pas

```bash
cd /var/www/anireserve
git pull  # Récupérer la dernière config

cd apps/web

# Vérifier que le build existe
ls -la .next/standalone/server.js

# Si absent, rebuilder
npm run build

# Vérifier les variables d'environnement
npm run check-env

# Créer le dossier logs
mkdir -p logs

# Démarrer PM2
pm2 delete anireserve
pm2 start ../../ecosystem.config.js
pm2 save
pm2 status
pm2 logs anireserve --lines 50
```

### Problème 2: Le serveur standalone n'existe pas

```bash
cd /var/www/anireserve/apps/web

# Nettoyer et rebuilder
rm -rf .next
npm run build

# Vérifier
ls -la .next/standalone/server.js

# Si le fichier existe, redémarrer PM2
pm2 restart anireserve
```

### Problème 3: Nginx ne proxy pas correctement

```bash
# Vérifier la config Nginx
cat /etc/nginx/sites-available/anireserve | grep proxy_pass

# Devrait contenir :
# proxy_pass http://localhost:3000;

# Si incorrect, utiliser le fichier exemple
cd /var/www/anireserve
sudo cp nginx.conf.example /etc/nginx/sites-available/anireserve
sudo nginx -t
sudo systemctl reload nginx
```

### Problème 4: Variables d'environnement manquantes

```bash
cd /var/www/anireserve/apps/web
npm run check-env

# Si erreurs, ajouter les variables manquantes dans .env
nano .env
# Ajouter NEXTAUTH_URL et NEXTAUTH_SECRET si manquants
```

## Commandes de diagnostic complètes

```bash
# 1. État PM2
echo "=== PM2 Status ==="
pm2 status

# 2. Port 3000
echo "=== Port 3000 ==="
netstat -tulpn | grep :3000

# 3. Build standalone
echo "=== Build Standalone ==="
ls -la /var/www/anireserve/apps/web/.next/standalone/server.js

# 4. Nginx
echo "=== Nginx Status ==="
systemctl status nginx | head -10

# 5. Logs PM2
echo "=== PM2 Logs (dernières 30 lignes) ==="
pm2 logs anireserve --lines 30 --nostream

# 6. Logs Nginx
echo "=== Nginx Error Logs ==="
tail -20 /var/log/nginx/error.log
```

## Solution rapide (si tout est en place)

```bash
cd /var/www/anireserve
git pull
cd apps/web
npm run build
mkdir -p logs
pm2 delete anireserve
pm2 start ../../ecosystem.config.js
pm2 save
pm2 status
sleep 5
pm2 logs anireserve --lines 20 --nostream
```

## Vérification finale

Après avoir appliqué les corrections, vérifier :

1. **PM2 est online :**
   ```bash
   pm2 status
   # Devrait montrer "online"
   ```

2. **Port 3000 écoute :**
   ```bash
   netstat -tulpn | grep :3000
   # Devrait montrer node en écoute
   ```

3. **Nginx fonctionne :**
   ```bash
   curl -I http://localhost:3000
   # Devrait retourner HTTP 200
   ```

4. **Site accessible :**
   ```bash
   curl -I https://anireserve.com
   # Devrait retourner HTTP 200
   ```
