#!/bin/bash
# Script de déploiement complet et robuste
# Usage: bash deploy-complete.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement complet AniReserve"
echo "=================================="

cd /var/www/anireserve/apps/web

# 1. Récupérer les changements
echo ""
echo "📥 Étape 1/7: Récupération des changements Git..."
cd /var/www/anireserve
git pull || {
    echo "❌ Erreur lors du git pull"
    exit 1
}

# 2. Vérifier les variables d'environnement
echo ""
echo "🔍 Étape 2/7: Vérification des variables d'environnement..."
cd /var/www/anireserve/apps/web
if npm run check-env 2>&1 | grep -q "❌"; then
    echo "⚠️  Des variables d'environnement sont manquantes"
    echo "📋 Exécutez: npm run check-env pour voir les détails"
    echo "❓ Continuer quand même? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Variables d'environnement OK"
fi

# 3. Installer les dépendances
echo ""
echo "📦 Étape 3/7: Installation des dépendances..."
npm install || {
    echo "❌ Erreur lors de npm install"
    exit 1
}

# 4. Générer Prisma Client
echo ""
echo "🗄️  Étape 4/7: Génération Prisma Client..."
npx prisma generate || {
    echo "⚠️  Erreur Prisma generate (peut être normal si DATABASE_URL manque)"
}

# 5. Build
echo ""
echo "🔨 Étape 5/7: Build de l'application..."
rm -rf .next
npm run build || {
    echo "❌ Erreur lors du build"
    echo "📋 Dernières lignes du build:"
    tail -50 /tmp/build.log 2>/dev/null || echo "Pas de log disponible"
    exit 1
}

# 6. Vérifier que le serveur standalone existe
echo ""
echo "✅ Étape 6/7: Vérification du serveur standalone..."
if [ ! -f ".next/standalone/server.js" ]; then
    echo "❌ Le serveur standalone n'existe pas!"
    echo "⚠️  Le build a peut-être échoué silencieusement"
    exit 1
fi
echo "✅ Serveur standalone trouvé"

# 7. Redémarrer PM2
echo ""
echo "🔄 Étape 7/7: Redémarrage PM2..."
mkdir -p logs

# Arrêter l'ancien processus
pm2 delete anireserve 2>/dev/null || true

# Démarrer avec la nouvelle config
cd /var/www/anireserve
pm2 start ecosystem.config.js || {
    echo "❌ Erreur lors du démarrage PM2"
    echo "📋 Logs PM2:"
    pm2 logs anireserve --lines 50 --nostream 2>/dev/null || true
    exit 1
}

pm2 save

# Attendre que le serveur démarre
echo "⏳ Attente du démarrage du serveur (10 secondes)..."
sleep 10

# Vérifier le statut
echo ""
echo "📊 Statut PM2:"
pm2 status

# Vérifier que le port écoute
echo ""
echo "🔌 Vérification du port 3000:"
if netstat -tulpn 2>/dev/null | grep -q ":3000"; then
    echo "✅ Le port 3000 écoute"
else
    echo "⚠️  Le port 3000 n'écoute pas encore (peut prendre quelques secondes)"
fi

# Afficher les logs
echo ""
echo "📋 Dernières lignes des logs PM2:"
pm2 logs anireserve --lines 30 --nostream

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "🔍 Vérifications finales:"
echo "  - PM2 status: pm2 status"
echo "  - Logs: pm2 logs anireserve"
echo "  - Port 3000: netstat -tulpn | grep :3000"
echo "  - Site: curl -I http://localhost:3000"
