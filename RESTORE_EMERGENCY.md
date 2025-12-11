# 🚨 RESTAURATION URGENTE - Commandes Manuelles

## ⚡ SOLUTION RAPIDE (Copy-Paste TOUT)

```bash
ssh root@72.61.103.149
```

**Puis copie-colle TOUT ça d'un coup :**

```bash
cd /var/www/anireserve

# Arrête tout PM2
pm2 kill

# Config simple
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    script: './node_modules/next/dist/bin/next',
    args: 'start -p 3000',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    max_memory_restart: '400M'
  }]
}
EOF

# Démarre
pm2 start ecosystem.config.js
pm2 save

# Redémarre Nginx
systemctl restart nginx

# Vérifie
pm2 status
netstat -tulpn | grep :3000
```

---

## ✅ VÉRIFICATION

**Le site devrait être accessible:**
https://anireserve.com

**Si PM2 status montre "online"** → ✅ C'EST BON

**Si "errored" ou "stopped":**

```bash
# Voir l'erreur
pm2 logs anireserve --lines 20

# Si erreur "module not found"
cd apps/web
npm install
cd ../..
pm2 restart anireserve
```

---

## 🔧 SI BUILD MANQUANT

```bash
cd /var/www/anireserve/apps/web

# Build avec limite mémoire
NODE_OPTIONS="--max-old-space-size=512" npm run build

cd ../..
pm2 restart anireserve
```

---

## 🆘 SI ENCORE PROBLÈME

**Vérifie RAM:**
```bash
free -h
```

**Si <500MB disponible:**

Le serveur manque de RAM. Options:
1. Upgrader le VPS (recommandé)
2. Ajouter swap (temporaire)

**Ajouter swap:**
```bash
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## 📞 ENVOIE-MOI

Si ça ne marche pas, envoie:

```bash
pm2 logs anireserve --lines 30
free -h
pm2 status
```

Je vais t'aider à corriger !
