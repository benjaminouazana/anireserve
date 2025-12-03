#!/bin/bash

# Script pour générer toutes les icônes nécessaires pour PWA et stores
# Prérequis : Avoir une icône source de 1024x1024px nommée "icon-source.png"

SOURCE_ICON="icon-source.png"
ICONS_DIR="apps/web/public/icons"

# Vérifier que l'icône source existe
if [ ! -f "$SOURCE_ICON" ]; then
    echo "❌ Erreur : $SOURCE_ICON introuvable"
    echo "📝 Créez une icône de 1024x1024px et nommez-la 'icon-source.png'"
    exit 1
fi

# Créer le dossier des icônes
mkdir -p "$ICONS_DIR"

echo "🎨 Génération des icônes..."

# Générer les icônes PWA
sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
    echo "  📱 Génération icon-${size}x${size}.png"
    # Utiliser ImageMagick ou sips (macOS)
    if command -v sips &> /dev/null; then
        sips -z $size $size "$SOURCE_ICON" --out "$ICONS_DIR/icon-${size}x${size}.png"
    elif command -v convert &> /dev/null; then
        convert "$SOURCE_ICON" -resize ${size}x${size} "$ICONS_DIR/icon-${size}x${size}.png"
    else
        echo "⚠️  ImageMagick ou sips non installé. Installez ImageMagick : brew install imagemagick"
        exit 1
    fi
done

echo "✅ Icônes générées dans $ICONS_DIR"
echo ""
echo "📋 Prochaines étapes :"
echo "  1. Vérifiez les icônes générées"
echo "  2. Utilisez Capacitor Assets pour générer les icônes iOS/Android :"
echo "     npx @capacitor/assets generate"

