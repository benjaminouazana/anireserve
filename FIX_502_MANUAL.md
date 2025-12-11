# 🚨 Fix Rapide Erreur 502 - Commandes Manuelles

## EXÉCUTE CES COMMANDES

### 1. Connecte-toi au serveur
```bash
ssh root@72.61.103.149
```

### 2. Vérifie PM2
```bash
pm2 status
pm2 logs anireserve --lines 20
```

### 3. FIX RAPIDE (copie-colle tout)
```bash
cd /var/www/anireserve

# Arrête l'app
pm2 delete anireserve 2>/dev/null || true

# Redémarre
pm2 start ecosystem.config.js

# Sauvegarde
pm2 save

# Vérifie
pm2 status
pm2 logs anireserve --lines 10
```

### 4. Si toujours 502 - Rebuild
```bash
cd /var/www/anireserve/apps/web
npm run build
cd ../..
pm2 restart anireserve
```

### 5. Vérifie Nginx
```bash
systemctl status nginx
nginx -t
systemctl reload nginx
```

### 6. Vérifie port 3000
```bash
netstat -tulpn | grep :3000
```

**Si rien n'écoute sur 3000 → PM2 n'a pas démarré l'app**

---

## COMMANDES QUICK FIX

**Copy-paste direct (tout en une fois) :**

```bash
ssh root@72.61.103.149 << 'EOF'
cd /var/www/anireserve
pm2 delete anireserve 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 status
systemctl reload nginx
netstat -tulpn | grep :3000
EOF
```

---

## DIAGNOSTIC ERREURS COMMUNES

**Erreur: "ecosystem.config.js not found"**
```bash
cd /var/www/anireserve
cat > ecosystem.config.js << 'EOFCONFIG'
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOFCONFIG

pm2 start ecosystem.config.js
```

**Erreur: "Build .next manquant"**
```bash
cd /var/www/anireserve/apps/web
npm run build
cd ../..
pm2 restart anireserve
```

**Erreur: "EADDRINUSE port 3000"**
```bash
# Trouve ce qui utilise le port
lsof -i :3000
# Tue le processus (remplace PID)
kill -9 PID
# Redémarre
pm2 restart anireserve
```

---

## APRÈS LE FIX

**Teste le site:**
https://anireserve.com

**Si ça marche:** ✅ C'est bon !

**Si encore 502:**
Envoie-moi les logs:
```bash
pm2 logs anireserve --lines 50
tail -20 /var/log/nginx/anireserve-error.log
```
