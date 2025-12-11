# 🔧 Correction Chemin Next.js dans PM2

**Erreur:** `Script not found: /var/www/anireserve/apps/web/node_modules/next/dist/bin/next`

## 🔍 Diagnostic

Le chemin vers Next.js n'est pas correct. Il faut trouver où se trouve réellement Next.js.

## ✅ Solutions

### Solution 1: Utiliser npx (RECOMMANDÉ)

```bash
cd /var/www/anireserve/apps/web

cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    script: 'npx',
    args: 'next start',
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

### Solution 2: Trouver le bon chemin

```bash
cd /var/www/anireserve/apps/web

# Chercher où se trouve Next.js
find . -name "next" -type f 2>/dev/null | head -5
find node_modules -name "next" -type f 2>/dev/null | head -5

# Ou vérifier si node_modules existe
ls -la node_modules/.bin/next 2>/dev/null || echo "Pas dans .bin"
ls -la node_modules/next/dist/bin/next 2>/dev/null || echo "Pas dans next/dist/bin"

# Vérifier à la racine du monorepo
ls -la ../../node_modules/.bin/next 2>/dev/null || echo "Pas à la racine"
```

### Solution 3: Utiliser npm start directement

```bash
cd /var/www/anireserve/apps/web

cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    script: 'npm',
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

## 🎯 Solution Recommandée (npx)

```bash
cd /var/www/anireserve/apps/web

# Configuration avec npx (trouve automatiquement Next.js)
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    script: 'npx',
    args: 'next start',
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

# Attendre 10 secondes
sleep 10

# Vérifier
pm2 status
netstat -tulpn | grep :3000
pm2 logs anireserve --lines 10 --nostream
```

---

**Action:** Utilisez la solution avec `npx` qui trouve automatiquement Next.js.
