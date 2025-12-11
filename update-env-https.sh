#!/bin/bash

# 🔄 Mise à jour .env sur le serveur avec HTTPS

set -e

SERVER="root@72.61.103.149"
DOMAIN="https://anireserve.com"

echo "⚙️  Mise à jour .env production"
echo "=============================="
echo ""

ssh $SERVER << ENDSSH
set -e

cd /var/www/anireserve

echo "📝 Mise à jour NEXT_PUBLIC_BASE_URL..."
sed -i "s|NEXT_PUBLIC_BASE_URL=.*|NEXT_PUBLIC_BASE_URL=\"$DOMAIN\"|g" .env

echo "✅ .env mis à jour"
cat .env | grep NEXT_PUBLIC_BASE_URL

echo ""
echo "🔄 Redémarrage PM2..."
pm2 restart anireserve

echo ""
echo "✅ Configuration terminée!"
echo "🌐 App: $DOMAIN"

ENDSSH

echo ""
echo "🎉 SERVEUR CONFIGURÉ AVEC HTTPS !"
