# 🔧 Correction Problème Standalone

**Erreur:** `Cannot find module '/var/www/anireserve/apps/web/.next/standalone/server.js'`

## 🔍 Diagnostic

Le mode `standalone` de Next.js crée un dossier `.next/standalone/` lors du build, mais il semble manquant.

## ✅ Solutions

### Solution 1: Vérifier si standalone existe

```bash
cd /var/www/anireserve/apps/web

# Vérifier si le dossier standalone existe
ls -la .next/standalone 2>/dev/null || echo "Dossier standalone n'existe pas"

# Vérifier la structure de .next
ls -la .next/ | head -20
```

### Solution 2: Rebuild avec standalone

Si le dossier standalone n'existe pas, il faut rebuilder :

```bash
cd /var/www/anireserve/apps/web

# Supprimer l'ancien build
rm -rf .next

# Rebuild (cela créera le dossier standalone)
npm run build

# Vérifier que standalone existe maintenant
ls -la .next/standalone/server.js

# Si le fichier existe, redémarrer PM2
pm2 delete anireserve
pm2 start ecosystem.config.js
pm2 save
```

### Solution 3: Revenir à next start (si standalone ne fonctionne pas)

Si le mode standalone pose problème, on peut revenir à `next start` (le warning n'est pas bloquant) :

```bash
cd /var/www/anireserve/apps/web

# Restaurer l'ancienne config
cp ecosystem.config.js.backup ecosystem.config.js

# Ou modifier manuellement
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
    }
  }]
}
EOF

# Redémarrer
pm2 delete anireserve
pm2 start ecosystem.config.js
pm2 save
```

## 🎯 Solution Recommandée

**Option A: Utiliser standalone (meilleur pour production)**

```bash
cd /var/www/anireserve/apps/web

# Vérifier d'abord
ls -la .next/standalone/server.js

# Si le fichier n'existe pas, rebuilder
if [ ! -f .next/standalone/server.js ]; then
    echo "Rebuild nécessaire pour créer standalone..."
    rm -rf .next
    npm run build
fi

# Vérifier à nouveau
ls -la .next/standalone/server.js

# Si maintenant il existe, redémarrer PM2
pm2 delete anireserve
pm2 start ecosystem.config.js
pm2 save
```

**Option B: Revenir à next start (plus simple, fonctionne)**

```bash
cd /var/www/anireserve/apps/web

# Restaurer la config qui fonctionnait
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
    }
  }]
}
EOF

pm2 delete anireserve
pm2 start ecosystem.config.js
pm2 save
```

## 📝 Note

Le warning "next start does not work with standalone" n'est pas bloquant - l'application fonctionne quand même. Le mode standalone est une optimisation, mais `next start` fonctionne aussi.

---

**Action immédiate:** Vérifiez d'abord si `.next/standalone/server.js` existe, puis choisissez la solution appropriée.
