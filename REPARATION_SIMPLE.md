# 🔧 RÉPARATION SITE - Procédure Simple

## ⚡ SOLUTION RAPIDE (10 minutes)

### Étape 1: Connecte-toi au serveur

```bash
ssh root@72.61.103.149
```

---

### Étape 2: Vérifie l'état actuel

```bash
pm2 status
free -h
```

**Si PM2 affiche une liste vide ou "Killed" → Continue**

---

### Étape 3: Extraie le build uploadé

```bash
cd /var/www/anireserve/apps/web

# Vérifie que l'archive existe
ls -lh next-build.tar.gz

# Extraie le build
tar -xzf next-build.tar.gz

# Vérifie que .next existe
ls -la .next/
```

---

### Étape 4: Configure PM2

```bash
cd /var/www/anireserve

# Crée la config PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    script: './node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    max_memory_restart: '800M',
    error_file: '/var/log/pm2/anireserve-error.log',
    out_file: '/var/log/pm2/anireserve-out.log'
  }]
}
EOF
```

---

### Étape 5: Démarre l'application

```bash
# Tue tout PM2 existant
pm2 kill

# Démarre l'app
pm2 start ecosystem.config.js

# Sauvegarde la config
pm2 save

# Configure auto-start au boot
pm2 startup
```

**Note:** PM2 va afficher une commande, copie-la et exécute-la

---

### Étape 6: Vérifie que ça marche

```bash
# Status PM2
pm2 status

# Vérifie le port 3000
netstat -tulpn | grep :3000

# Logs (si erreur)
pm2 logs anireserve --lines 20
```

**Tu dois voir:**
- PM2 status: `online` ✅
- Port 3000: `node ... LISTEN` ✅

---

### Étape 7: Redémarre Nginx

```bash
systemctl restart nginx
systemctl status nginx
```

---

### Étape 8: Teste le site

**Attends 30 secondes puis ouvre:**
https://anireserve.com

---

## 🆘 SI ÉCHEC

### Problème: "Killed" quand tu lances PM2

**Solution: Ajoute du SWAP**

```bash
# Crée 2GB swap
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Vérifie
free -h

# Puis relance PM2
pm2 start ecosystem.config.js
```

---

### Problème: "Build .next manquant"

**Solution: Le build est sur ton Mac, re-upload**

```bash
# Sur ton Mac (nouveau terminal)
cd /Users/macbookpro/Desktop/aniresa/AniReserve/apps/web
scp next-build.tar.gz root@72.61.103.149:/var/www/anireserve/apps/web/

# Sur le serveur SSH
cd /var/www/anireserve/apps/web
tar -xzf next-build.tar.gz
```

---

### Problème: "Port 3000 déjà utilisé"

**Solution: Trouve et tue le process**

```bash
# Trouve le PID
lsof -i :3000

# Tue-le (remplace PID par le numéro)
kill -9 PID

# Relance
pm2 restart anireserve
```

---

### Problème: Site montre "502 Bad Gateway"

**Causes possibles:**

1. **PM2 pas online**
```bash
pm2 status
# Si "stopped" ou "errored":
pm2 restart anireserve
pm2 logs anireserve
```

2. **Nginx mal configuré**
```bash
nginx -t
# Si erreur:
systemctl restart nginx
```

3. **Port 3000 pas écouté**
```bash
netstat -tulpn | grep :3000
# Si rien:
pm2 restart anireserve
```

---

## ✅ COMMANDE TOUT-EN-UN

**Si tu veux tout faire d'un coup (copy-paste) :**

```bash
ssh root@72.61.103.149 << 'ENDSCRIPT'
cd /var/www/anireserve/apps/web
tar -xzf next-build.tar.gz
cd ..
pm2 kill
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    script: './node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    env: { NODE_ENV: 'production', PORT: 3000 },
    max_memory_restart: '800M'
  }]
}
EOF
pm2 start ecosystem.config.js
pm2 save
systemctl restart nginx
pm2 status
netstat -tulpn | grep :3000
ENDSCRIPT
```

---

## 📞 ENVOIE-MOI

Si ça ne marche pas, envoie le résultat de:

```bash
pm2 status
pm2 logs anireserve --lines 30
free -h
netstat -tulpn | grep :3000
```

Et je t'aide à corriger ! 🔧
