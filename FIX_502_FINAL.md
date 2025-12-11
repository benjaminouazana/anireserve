# 🔧 Correction Erreur 502 Bad Gateway

**Problème:** Nginx répond mais ne peut pas se connecter à Next.js sur le port 3000.

## 🔍 Diagnostic Immédiat

Sur le serveur, exécutez ces commandes pour diagnostiquer :

```bash
# 1. Vérifier que le port 3000 écoute
netstat -tulpn | grep :3000

# 2. Vérifier les logs PM2 (erreurs)
pm2 logs anireserve --lines 50 --nostream

# 3. Test local
curl -I http://localhost:3000

# 4. Vérifier que le build existe
ls -la .next
```

## 🔧 Solutions

### Solution 1: Vérifier que le build existe

Si le dossier `.next` n'existe pas ou est corrompu :

```bash
cd /var/www/anireserve/apps/web

# Rebuild
npm run build

# Redémarrer PM2
pm2 restart anireserve

# Attendre 10 secondes
sleep 10

# Vérifier
pm2 status
netstat -tulpn | grep :3000
```

### Solution 2: Vérifier les logs PM2

```bash
pm2 logs anireserve --lines 100
```

**Cherchez des erreurs comme :**
- `Error: Cannot find module`
- `EADDRINUSE` (port déjà utilisé)
- `Database connection error`
- Erreurs de build

### Solution 3: Vérifier les variables d'environnement

```bash
cd /var/www/anireserve/apps/web

# Vérifier que .env existe
ls -la .env

# Vérifier les variables importantes
cat .env | grep DATABASE_URL
cat .env | grep NODE_ENV
```

### Solution 4: Redémarrer complètement

```bash
cd /var/www/anireserve/apps/web

# Arrêter PM2
pm2 delete anireserve

# Vérifier que le port est libre
netstat -tulpn | grep :3000

# Si quelque chose utilise le port 3000, le tuer
# (remplacez PID par le numéro du processus)
# kill -9 PID

# Redémarrer
pm2 start ecosystem.config.js
pm2 save

# Attendre
sleep 15

# Vérifier
pm2 status
pm2 logs anireserve --lines 20 --nostream
netstat -tulpn | grep :3000
```

### Solution 5: Vérifier la configuration Nginx

```bash
# Vérifier la configuration
nginx -t

# Vérifier que Nginx pointe vers le bon port
grep -r "3000" /etc/nginx/sites-enabled/

# Redémarrer Nginx
systemctl restart nginx
```

## 🚀 Script de Réparation Complet

Copiez-collez ce script sur le serveur :

```bash
cd /var/www/anireserve/apps/web

echo "🔧 Réparation erreur 502..."
echo ""

# 1. Vérifier le build
echo "1. Vérification du build..."
if [ ! -d .next ]; then
    echo "⚠️ Build manquant, construction..."
    npm run build
else
    echo "✅ Build existe"
fi
echo ""

# 2. Vérifier .env
echo "2. Vérification .env..."
if [ ! -f .env ]; then
    echo "❌ .env manquant!"
else
    echo "✅ .env existe"
fi
echo ""

# 3. Arrêter PM2
echo "3. Arrêt de PM2..."
pm2 delete anireserve 2>/dev/null || true
sleep 2

# 4. Vérifier que le port est libre
echo "4. Vérification du port 3000..."
if netstat -tulpn 2>/dev/null | grep :3000 > /dev/null; then
    echo "⚠️ Port 3000 déjà utilisé, recherche du processus..."
    PID=$(netstat -tulpn 2>/dev/null | grep :3000 | awk '{print $7}' | cut -d'/' -f1)
    if [ ! -z "$PID" ]; then
        echo "   Arrêt du processus $PID..."
        kill -9 $PID 2>/dev/null || true
        sleep 2
    fi
fi
echo ""

# 5. Redémarrer PM2
echo "5. Démarrage de PM2..."
pm2 start ecosystem.config.js
pm2 save
echo ""

# 6. Attendre le démarrage
echo "6. Attente du démarrage (20 secondes)..."
sleep 20
echo ""

# 7. Vérifications
echo "7. Vérifications..."
echo ""
echo "=== PM2 Status ==="
pm2 status
echo ""
echo "=== Port 3000 ==="
netstat -tulpn | grep :3000 || echo "❌ Rien n'écoute sur le port 3000"
echo ""
echo "=== Test local ==="
curl -I http://localhost:3000 2>&1 | head -3
echo ""
echo "=== Logs PM2 (20 dernières lignes) ==="
pm2 logs anireserve --lines 20 --nostream
echo ""

echo "✅ Réparation terminée!"
```

## 🔍 Vérifications Détaillées

### Vérifier que Next.js démarre correctement

```bash
# Tester manuellement Next.js
cd /var/www/anireserve/apps/web
NODE_ENV=production npm start
# (Dans un autre terminal, tester: curl http://localhost:3000)
# (Appuyez sur Ctrl+C pour arrêter)
```

### Vérifier les permissions

```bash
cd /var/www/anireserve/apps/web

# Vérifier les permissions
ls -la

# Si nécessaire, corriger
chown -R root:root .
chmod -R 755 .
```

### Vérifier les ressources système

```bash
# Vérifier la mémoire disponible
free -h

# Vérifier l'espace disque
df -h

# Vérifier les processus
ps aux | grep node
```

## ⚠️ Erreurs Communes

### "Cannot find module"
```bash
cd /var/www/anireserve/apps/web
npm install
npm run build
pm2 restart anireserve
```

### "EADDRINUSE" (port déjà utilisé)
```bash
# Trouver le processus
lsof -i :3000
# Ou
netstat -tulpn | grep :3000

# Tuer le processus (remplacez PID)
kill -9 PID

# Redémarrer PM2
pm2 restart anireserve
```

### "Database connection error"
```bash
# Vérifier DATABASE_URL dans .env
cat .env | grep DATABASE_URL

# Tester la connexion
cd /var/www/anireserve/apps/web
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

## ✅ Après Correction

Une fois que le port 3000 écoute et que l'application répond localement :

```bash
# Redémarrer Nginx
systemctl restart nginx

# Tester
curl -I https://anireserve.com
```

Le site devrait maintenant fonctionner !

---

**Action immédiate :** Exécutez le script de réparation complet ci-dessus sur le serveur.
