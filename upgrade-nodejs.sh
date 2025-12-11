#!/bin/bash

# 🔄 Upgrade Node.js vers version 20 sur VPS

set -e

SERVER="root@72.61.103.149"

echo "🔄 Mise à jour Node.js vers v20"
echo "==============================="
echo ""

ssh $SERVER << 'ENDSSH'
set -e

echo "📦 Version actuelle:"
node -v
npm -v

echo ""
echo "🔄 Installation Node.js 20..."

# Télécharger et installer NodeSource pour Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Installer Node.js 20
apt-get install -y nodejs

echo ""
echo "✅ Installation terminée!"
echo ""
echo "📊 Nouvelle version:"
node -v
npm -v

echo ""
echo "🧹 Nettoyage npm..."
npm cache clean --force

ENDSSH

echo ""
echo "✅ Node.js 20 installé avec succès!"
echo ""
echo "🚀 Relance maintenant le script de déploiement:"
echo "   cd /Users/macbookpro/Desktop/aniresa/AniReserve"
echo "   ./fix-and-deploy.sh"
