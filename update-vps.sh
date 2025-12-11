#!/bin/bash

# 🚀 Script de MISE À JOUR VPS (serveur déjà configuré)
# Serveur: root@72.61.103.149

set -e

SERVER="root@72.61.103.149"
APP_DIR="/var/www/anireserve"
REPO_URL="https://github.com/benjaminouazana/anireserve.git"

echo "🔄 Mise à jour AniReserve sur VPS"
echo "=================================="
echo ""

ssh $SERVER << ENDSSH
set -e

echo "📂 Navigation vers le projet..."
cd $APP_DIR || {
    echo "❌ Projet non trouvé, clone initial..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
}

echo ""
echo "📥 Pull du code depuis GitHub..."
git pull origin main || git pull origin master

echo ""
echo "📦 Installation/Mise à jour dépendances..."
npm install
cd apps/web
npm install

echo ""
echo "🔧 Génération Prisma Client..."
cd $APP_DIR
npx prisma generate

echo ""
echo "🏗️  Build production..."
cd apps/web
npm run build

echo ""
echo "🔄 Redémarrage PM2..."
pm2 restart anireserve || pm2 start ecosystem.config.js

echo ""
echo "✅ Mise à jour terminée!"
echo ""
echo "🌐 App accessible sur: http://72.61.103.149"
echo ""
echo "📊 Status:"
pm2 status anireserve

ENDSSH

echo ""
echo "🎉 MISE À JOUR COMPLÉTÉE !"
echo ""
echo "🔍 Commandes utiles:"
echo "  ssh $SERVER pm2 logs anireserve    # Voir les logs"
echo "  ssh $SERVER pm2 restart anireserve # Redémarrer"
