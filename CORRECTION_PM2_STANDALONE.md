# 🔧 Correction PM2 pour Next.js Standalone

**Problème:** PM2 utilise `next start` mais Next.js est configuré en mode `standalone`.

## ❌ Erreur Actuelle

```
⚠ "next start" does not work with "output: standalone" configuration. 
Use "node .next/standalone/server.js" instead.
```

## ✅ Solution

Modifier `ecosystem.config.js` pour utiliser la commande standalone.

## 📋 Commande à Exécuter sur le Serveur

```bash
cd /var/www/anireserve/apps/web

# Sauvegarder l'ancienne config
cp ecosystem.config.js ecosystem.config.js.backup

# Modifier ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    script: 'node',
    args: '.next/standalone/server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Vérifier la nouvelle configuration
cat ecosystem.config.js

# Redémarrer PM2 avec la nouvelle config
pm2 delete anireserve
pm2 start ecosystem.config.js
pm2 save

# Attendre 10 secondes
sleep 10

# Vérifier
pm2 status
pm2 logs anireserve --lines 10 --nostream
netstat -tulpn | grep :3000
```

## 🔍 Vérification

Après la correction, les logs ne devraient plus montrer l'avertissement.

**Avant:**
```
⚠ "next start" does not work with "output: standalone"
```

**Après:**
```
✓ Ready in X.Xs
```

## 📝 Explication

- **Mode normal:** `next start` → Utilise `.next/server.js`
- **Mode standalone:** `node .next/standalone/server.js` → Application autonome optimisée

Le mode standalone est meilleur pour la production car il inclut toutes les dépendances nécessaires.

---

**Action:** Exécutez les commandes ci-dessus sur le serveur pour corriger la configuration PM2.
