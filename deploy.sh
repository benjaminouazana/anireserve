#!/bin/bash
# Script de déploiement automatique
# Usage: bash deploy.sh [--no-build]

set -e

cd /var/www/anireserve/apps/web

echo "📥 Récupération des changements Git..."
git pull

# Vérifier si --no-build est passé
if [[ "$1" == "--no-build" ]]; then
  echo "⚡ Mode rapide: pas de build, redémarrage direct"
  pm2 restart anireserve
  sleep 10
  pm2 status
  echo "✅ Redémarrage terminé"
  exit 0
fi

echo "🔨 Build en cours..."
if npm run build 2>&1 | tee /tmp/build.log; then
  echo "✅ Build réussi"
  pm2 restart anireserve
  sleep 15
  pm2 status
  echo "✅ Déploiement terminé avec succès"
else
  echo "⚠️  Build avec erreurs, mais on continue..."
  
  # Vérifier si c'est une erreur critique
  if grep -q "Build error occurred" /tmp/build.log; then
    echo "❌ Erreur critique détectée"
    echo "📋 Dernières lignes du log:"
    tail -20 /tmp/build.log
    echo ""
    echo "🔄 Redémarrage avec l'ancien build..."
    pm2 restart anireserve
    sleep 10
    pm2 status
    exit 1
  else
    echo "✅ Erreurs non critiques, redémarrage..."
    pm2 restart anireserve
    sleep 15
    pm2 status
    echo "✅ Déploiement terminé (avec warnings)"
  fi
fi
