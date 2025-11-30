#!/bin/bash

# Script pour configurer le logo et le favicon
# Usage: ./setup-logo.sh [chemin-vers-logo.png]

echo "🎨 Configuration du logo AniReserve"
echo ""

# Chemins
PUBLIC_DIR="apps/web/public"
LOGO_PATH="$PUBLIC_DIR/logo.png"
FAVICON_PATH="$PUBLIC_DIR/favicon.ico"
APP_FAVICON="apps/web/src/app/favicon.ico"

# Si un chemin est fourni en argument
if [ -n "$1" ]; then
    SOURCE_LOGO="$1"
    
    if [ ! -f "$SOURCE_LOGO" ]; then
        echo "❌ Erreur: Le fichier $SOURCE_LOGO n'existe pas"
        exit 1
    fi
    
    echo "📋 Copie du logo depuis: $SOURCE_LOGO"
    cp "$SOURCE_LOGO" "$LOGO_PATH"
    echo "✅ Logo copié vers: $LOGO_PATH"
    
    # Créer aussi le favicon (copie du logo)
    cp "$SOURCE_LOGO" "$FAVICON_PATH"
    echo "✅ Favicon copié vers: $FAVICON_PATH"
    
    # Copier aussi dans app/favicon.ico pour Next.js
    cp "$SOURCE_LOGO" "$APP_FAVICON"
    echo "✅ Favicon copié vers: $APP_FAVICON"
    
    echo ""
    echo "✅ Configuration terminée !"
    echo ""
    echo "📝 Note: Si vous voulez un vrai fichier .ico pour le favicon,"
    echo "   utilisez un convertisseur en ligne comme https://convertio.co/png-ico/"
    echo "   puis remplacez $FAVICON_PATH"
    
else
    echo "📝 Instructions:"
    echo ""
    echo "1. Placez votre image de logo dans: $LOGO_PATH"
    echo "2. (Optionnel) Créez un favicon.ico et placez-le dans: $FAVICON_PATH"
    echo ""
    echo "Ou utilisez ce script avec le chemin de votre logo:"
    echo "   ./setup-logo.sh /chemin/vers/votre/logo.png"
    echo ""
    
    # Vérifier si le logo existe déjà
    if [ -f "$LOGO_PATH" ]; then
        echo "✅ Logo trouvé: $LOGO_PATH"
    else
        echo "⚠️  Logo non trouvé: $LOGO_PATH"
    fi
    
    if [ -f "$FAVICON_PATH" ]; then
        echo "✅ Favicon trouvé: $FAVICON_PATH"
    else
        echo "⚠️  Favicon non trouvé: $FAVICON_PATH"
    fi
fi

