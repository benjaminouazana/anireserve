# 🚀 Guide de Déploiement Rapide

## Solution pour éviter les rebuilds répétés

### ✅ Build une seule fois, redémarre plusieurs fois

Au lieu de rebuilder à chaque fois, vous pouvez :

1. **Faire le build UNE FOIS** quand tout est prêt
2. **Redémarrer PM2** pour appliquer les changements de code (si pas de changement de structure)

### 📋 Commandes sur le serveur

#### Option 1 : Build complet (quand nécessaire)
```bash
cd /var/www/anireserve/apps/web
git pull
npm run build
pm2 restart anireserve
sleep 15
pm2 status
```

#### Option 2 : Redémarrage rapide (si pas de changement de build)
```bash
cd /var/www/anireserve/apps/web
git pull
pm2 restart anireserve
sleep 10
pm2 status
```

#### Option 3 : Script automatique (recommandé)
```bash
cd /var/www/anireserve/apps/web

# Script tout-en-un
git pull && \
(npm run build 2>&1 | tee /tmp/build.log && pm2 restart anireserve && sleep 15 && pm2 status) || \
(pm2 restart anireserve && sleep 10 && pm2 status)
```

### 🔍 Quand rebuilder vs redémarrer ?

**Rebuild nécessaire si :**
- Changement dans `next.config.js`
- Nouvelle dépendance npm
- Changement de structure de pages
- Erreur "Build error occurred"

**Redémarrage suffisant si :**
- Changement de code dans les composants
- Changement dans les API routes
- Correction de bugs simples
- Changement de styles

### ⚡ Astuce : Build en arrière-plan

```bash
# Build en arrière-plan pendant que l'app tourne
cd /var/www/anireserve/apps/web
git pull
npm run build > /tmp/build.log 2>&1 &
BUILD_PID=$!

# Attendre la fin du build
wait $BUILD_PID

# Si succès, redémarrer
if [ $? -eq 0 ]; then
  pm2 restart anireserve
  sleep 15
  pm2 status
fi
```

### 🛠️ Script de déploiement automatique

Créez `/var/www/anireserve/deploy.sh` :

```bash
#!/bin/bash
cd /var/www/anireserve/apps/web

echo "📥 Récupération des changements..."
git pull

echo "🔨 Build..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build réussi, redémarrage..."
  pm2 restart anireserve
  sleep 15
  pm2 status
  echo "✅ Déploiement terminé"
else
  echo "❌ Build échoué, redémarrage avec ancien build..."
  pm2 restart anireserve
  sleep 10
  pm2 status
fi
```

Puis utilisez simplement : `bash /var/www/anireserve/deploy.sh`
