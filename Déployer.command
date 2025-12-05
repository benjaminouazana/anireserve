#!/bin/bash

# 🚀 Script de Déploiement AniReserve - Version macOS
# Double-clique sur ce fichier pour déployer !

cd "$(dirname "$0")"

echo "🚀 Déploiement AniReserve sur le serveur..."
echo ""
echo "📡 Connexion au serveur..."
echo ""

# Configuration
SERVER="root@72.61.103.149"

# Commandes à exécuter sur le serveur
ssh $SERVER << 'ENDSSH'
cd /root/anireserve
echo "📥 Récupération des changements depuis GitHub..."
git pull origin main

echo ""
echo "📦 Installation des dépendances..."
cd apps/web
npm install

echo ""
echo "🔨 Build de l'application (cela peut prendre 2-5 minutes)..."
npm run build

echo ""
echo "🔄 Redémarrage de l'application..."
pm2 restart anireserve

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "📋 Statut de l'application :"
pm2 status

echo ""
echo "📝 Derniers logs :"
pm2 logs anireserve --lines 15 --nostream
ENDSSH

echo ""
echo "✅ Déploiement terminé avec succès !"
echo "🌐 Vérifie ton site sur https://anireserve.com"
echo ""
echo "Appuyez sur Entrée pour fermer..."
read

