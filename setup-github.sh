#!/bin/bash

echo "🚀 Configuration du dépôt GitHub pour AniReserve"
echo ""
echo "📋 Instructions :"
echo ""
echo "1. Allez sur https://github.com et connectez-vous (ou créez un compte)"
echo ""
echo "2. Cliquez sur le bouton '+' en haut à droite → 'New repository'"
echo ""
echo "3. Configurez le dépôt :"
echo "   - Nom : anireserve (ou un autre nom de votre choix)"
echo "   - Description : Plateforme de réservation entre professionnels et clients en Israël"
echo "   - Visibilité : Privé (recommandé) ou Public"
echo "   - NE COCHEZ PAS 'Initialize with README'"
echo ""
echo "4. Cliquez sur 'Create repository'"
echo ""
echo "5. Copiez l'URL du dépôt (ex: https://github.com/VOTRE-USERNAME/anireserve.git)"
echo ""
echo "6. Collez l'URL ci-dessous quand je vous le demanderai"
echo ""
echo "⏳ En attente de l'URL du dépôt..."
echo ""
read -p "Entrez l'URL de votre dépôt GitHub: " GITHUB_URL

if [ -z "$GITHUB_URL" ]; then
    echo "❌ URL non fournie. Arrêt."
    exit 1
fi

echo ""
echo "🔗 Connexion au dépôt GitHub..."
cd /Users/macbookpro/Desktop/aniresa/AniReserve

# Vérifier si un remote existe déjà
if git remote | grep -q origin; then
    echo "⚠️  Un remote 'origin' existe déjà. Voulez-vous le remplacer ? (o/n)"
    read -p "> " REPLACE
    if [ "$REPLACE" = "o" ] || [ "$REPLACE" = "O" ]; then
        git remote remove origin
    else
        echo "❌ Opération annulée."
        exit 1
    fi
fi

git remote add origin "$GITHUB_URL"

echo ""
echo "📤 Envoi du code vers GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Succès ! Votre code est maintenant sur GitHub !"
    echo "🌐 Votre dépôt : $GITHUB_URL"
    echo ""
    echo "💡 Pour les prochaines sauvegardes, utilisez :"
    echo "   git add ."
    echo "   git commit -m 'Description des changements'"
    echo "   git push"
else
    echo ""
    echo "❌ Erreur lors de l'envoi. Vérifiez :"
    echo "   1. Que vous êtes connecté à GitHub"
    echo "   2. Que l'URL du dépôt est correcte"
    echo "   3. Que vous avez les permissions d'écriture"
    echo ""
    echo "💡 Alternative : Créez le dépôt manuellement et utilisez :"
    echo "   git remote add origin $GITHUB_URL"
    echo "   git push -u origin main"
fi






