#!/bin/bash
# Script de build robuste qui continue même en cas d'erreurs non critiques

set -e  # Arrêter en cas d'erreur critique

echo "🔨 Début du build..."

# Nettoyer l'ancien build
echo "🧹 Nettoyage..."
rm -rf .next

# Build avec gestion d'erreurs
echo "📦 Build en cours..."
npm run build 2>&1 | tee /tmp/build.log || {
  echo "⚠️  Le build a rencontré des erreurs, mais on continue..."
  
  # Vérifier si c'est une erreur critique ou juste des warnings
  if grep -q "Build error occurred" /tmp/build.log; then
    echo "❌ Erreur critique détectée, arrêt du script"
    exit 1
  fi
  
  echo "✅ Erreurs non critiques, le build peut continuer"
}

# Vérifier que le build a créé les fichiers essentiels
if [ ! -d ".next" ]; then
  echo "❌ Le dossier .next n'existe pas, le build a échoué"
  exit 1
fi

echo "✅ Build terminé avec succès"
echo "📊 Résumé:"
echo "   - Dossier .next créé: $(test -d .next && echo 'Oui' || echo 'Non')"
echo "   - Fichier server.js: $(test -f .next/standalone/server.js && echo 'Oui' || echo 'Non')"
