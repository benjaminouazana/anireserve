#!/bin/bash

# 🚀 SCRIPT DE RÉPARATION AUTOMATIQUE
# À exécuter sur ton MAC
# Ce script va :
# 1. Vérifier le build local
# 2. L'envoyer au serveur
# 3. L'installer et redémarrer le site

SERVER="root@72.61.103.149"
LOCAL_DIR="/Users/macbookpro/Desktop/aniresa/AniReserve/apps/web"
REMOTE_DIR="/var/www/anireserve/apps/web"

echo "🔧 DÉBUT DE LA RÉPARATION..."
echo "=============================="

# 1. Vérification du build local
cd "$LOCAL_DIR" || { echo "❌ Dossier local introuvable"; exit 1; }

if [ ! -f "next-build.tar.gz" ]; then
    echo "📦 Création de l'archive du build..."
    # On suppose que le build a déjà été fait (npm run build), sinon on pourrait le lancer
    # npm run build
    tar -czf next-build.tar.gz .next public package.json next.config.js
else
    echo "✅ Archive locale trouvée"
fi

# 2. Envoi vers le serveur
echo ""
echo "📤 Envoi vers le serveur (cela peut prendre 1 minute)..."
scp next-build.tar.gz $SERVER:$REMOTE_DIR/

# 3. Installation sur le serveur
echo ""
echo "🏗️  Installation sur le serveur..."
ssh $SERVER << 'ENDSSH'
    cd /var/www/anireserve/apps/web
    
    echo "📦 Extraction..."
    tar -xzf next-build.tar.gz
    
    echo "🧹 Vérification dossier .next..."
    if [ ! -d ".next" ]; then
        echo "❌ ERREUR: Dossier .next manquant après extraction"
        exit 1
    fi

    echo "🔌 Configuration environnement..."
    # On s'assure que .env existe (si manquant)
    touch .env
    if ! grep -q "DATABASE_URL" .env; then
        echo 'DATABASE_URL="postgresql://postgres.dlvmfwixsijsamqvnzjq:Anireserve2024!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"' >> .env
        echo "✅ DATABASE_URL ajouté"
    fi

    echo "🔄 Redémarrage PM2..."
    cd /var/www/anireserve
    pm2 restart anireserve
    pm2 save
    
    echo "✅ Terminé !"
ENDSSH

echo ""
echo "🎉 RÉPARATION TERMINÉE !"
echo "🌐 Vérifie le site : https://anireserve.com"
