#!/bin/bash

# 🚨 RESTAURATION D'URGENCE - AniReserve
# Remet le site en ligne avec config stable

set -e

SERVER="root@72.61.103.149"

echo "🚨 RESTAURATION URGENTE DU SITE"
echo "================================"
echo ""

ssh $SERVER << 'ENDSSH'

echo "📊 État actuel du serveur..."
free -h
echo ""

cd /var/www/anireserve

echo "🧹 Nettoyage PM2..."
pm2 kill
sleep 2

echo "📝 Configuration PM2 SIMPLE..."
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
    max_memory_restart: '400M',
    min_uptime: '10s',
    max_restarts: 10,
    autorestart: true,
    watch: false
  }]
}
EOF

echo "✅ Config PM2 créée"
echo ""

echo "📦 Vérification dépendances..."
cd apps/web
if [ ! -d "node_modules/next" ]; then
    echo "Installation Next.js..."
    npm install next react react-dom
fi
cd ../..

echo "🏗️  Vérification build..."
if [ ! -d "apps/web/.next" ]; then
    echo "⚠️  Build manquant, reconstruction..."
    cd apps/web
    
    # Build avec limite mémoire
    NODE_OPTIONS="--max-old-space-size=768" npm run build || {
        echo "❌ Build échoué avec limite mémoire"
        echo "Essai sans limite..."
        npm run build
    }
    
    cd ../..
else
    echo "✅ Build existe"
fi

echo ""
echo "🚀 Démarrage PM2..."
cd /var/www/anireserve
pm2 start ecosystem.config.js
sleep 3

echo ""
echo "💾 Sauvegarde config PM2..."
pm2 save
pm2 startup | tail -1 > /tmp/pm2-startup.sh
bash /tmp/pm2-startup.sh 2>/dev/null || true

echo ""
echo "🌐 Redémarrage Nginx..."
nginx -t && systemctl restart nginx

echo ""
echo "📊 ÉTAT FINAL"
echo "============="
pm2 status
echo ""
netstat -tulpn | grep :3000
echo ""
free -h

echo ""
echo "✅ RESTAURATION TERMINÉE !"
echo ""
echo "🌐 Teste: https://anireserve.com"

ENDSSH

echo ""
echo "🎉 Script terminé"
echo ""
echo "Vérifie https://anireserve.com dans 10 secondes..."
sleep 10
curl -I https://anireserve.com 2>/dev/null | head -5 || echo "❌ Site non accessible"
