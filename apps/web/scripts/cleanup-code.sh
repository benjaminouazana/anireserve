#!/bin/bash
# Script de nettoyage du code

echo "🧹 Nettoyage du code AniReserve..."

# Aller dans le répertoire du projet
cd "$(dirname "$0")/../.." || exit 1

# 1. Supprimer le dossier anireserve obsolète
if [ -d "anireserve" ]; then
    echo "📁 Suppression du dossier anireserve obsolète..."
    rm -rf anireserve
    echo "✅ Dossier anireserve supprimé"
fi

# 2. Supprimer next.config.ts si next.config.js existe
if [ -f "apps/web/next.config.js" ] && [ -f "apps/web/next.config.ts" ]; then
    echo "📄 Suppression de next.config.ts (dupliqué)..."
    rm -f apps/web/next.config.ts
    echo "✅ next.config.ts supprimé"
fi

# 3. Nettoyer les fichiers de build
echo "🗑️  Nettoyage des fichiers de build..."
find . -type d -name ".next" -exec rm -rf {} + 2>/dev/null
find . -type d -name "node_modules/.cache" -exec rm -rf {} + 2>/dev/null
find . -type f -name "*.tsbuildinfo" -delete 2>/dev/null
echo "✅ Fichiers de build nettoyés"

# 4. Nettoyer les logs
echo "📋 Nettoyage des logs..."
find . -type f -name "*.log" -delete 2>/dev/null
find . -type f -name "npm-debug.log*" -delete 2>/dev/null
find . -type f -name "yarn-debug.log*" -delete 2>/dev/null
echo "✅ Logs nettoyés"

# 5. Nettoyer les fichiers temporaires
echo "🗂️  Nettoyage des fichiers temporaires..."
find . -type f -name ".DS_Store" -delete 2>/dev/null
find . -type f -name "Thumbs.db" -delete 2>/dev/null
echo "✅ Fichiers temporaires nettoyés"

echo ""
echo "✅ Nettoyage terminé!"

