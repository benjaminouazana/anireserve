#!/bin/bash

# Script d'installation et configuration de Capacitor

echo "🚀 Installation de Capacitor pour AniReserve"
echo ""

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur : package.json introuvable. Exécutez ce script depuis la racine du projet."
    exit 1
fi

echo "📦 Installation des dépendances Capacitor..."
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
npm install @capacitor/app @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard

echo ""
echo "🔧 Initialisation de Capacitor..."
echo "⚠️  Répondez aux questions suivantes :"
echo "   - App name: AniReserve"
echo "   - App ID: com.anireserve.app"
echo "   - Web dir: apps/web/.next"
echo ""

npx cap init

echo ""
echo "📱 Ajout des plateformes..."
npx cap add ios
npx cap add android

echo ""
echo "✅ Capacitor installé et configuré !"
echo ""
echo "📋 Prochaines étapes :"
echo "  1. Créer les icônes (voir scripts/generate-icons.sh)"
echo "  2. Build Next.js : cd apps/web && npm run build"
echo "  3. Synchroniser : npx cap sync"
echo "  4. Ouvrir dans Xcode : npx cap open ios"
echo "  5. Ouvrir dans Android Studio : npx cap open android"

