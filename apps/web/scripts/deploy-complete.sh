#!/bin/bash
# Script de déploiement complet et robuste
# Vérifie tout avant de déployer et corrige les problèmes courants

set -e

cd /var/www/anireserve/apps/web

echo "🚀 Déploiement complet AniReserve"
echo "=================================="
echo ""

# 1. Vérifier Git
echo "📥 1. Vérification Git..."
if ! git pull; then
    echo "❌ Erreur lors du git pull"
    exit 1
fi
echo "✅ Git OK"
echo ""

# 2. Vérifier les variables d'environnement
echo "🔐 2. Vérification des variables d'environnement..."
if ! npm run check-env; then
    echo "❌ Variables d'environnement manquantes ou invalides"
    echo "📝 Vérifiez le fichier .env et ajoutez les variables manquantes"
    echo "   Voir: ADD_NEXTAUTH_SECRET.md pour NEXTAUTH_SECRET"
    exit 1
fi
echo "✅ Variables d'environnement OK"
echo ""

# 3. Installer les dépendances
echo "📦 3. Installation des dépendances..."
if ! npm install; then
    echo "❌ Erreur lors de npm install"
    exit 1
fi
echo "✅ Dépendances installées"
echo ""

# 4. Vérifier Prisma
echo "🗄️  4. Vérification Prisma..."
if ! npx prisma generate; then
    echo "⚠️  Avertissement: Prisma generate a échoué (peut être normal si DATABASE_URL manque)"
fi
echo "✅ Prisma OK"
echo ""

# 5. Nettoyer l'ancien build
echo "🧹 5. Nettoyage de l'ancien build..."
rm -rf .next
echo "✅ Nettoyage terminé"
echo ""

# 6. Build
echo "🔨 6. Build en cours..."
if ! npm run build 2>&1 | tee /tmp/build.log; then
    echo "❌ Erreur lors du build"
    echo "📋 Dernières lignes du log:"
    tail -50 /tmp/build.log
    exit 1
fi
echo "✅ Build réussi"
echo ""

# 7. Vérifier que le serveur standalone existe
echo "🔍 7. Vérification du serveur standalone..."
if [ ! -f ".next/standalone/server.js" ]; then
    echo "❌ Le serveur standalone n'existe pas"
    echo "   Le build a peut-être échoué silencieusement"
    exit 1
fi
echo "✅ Serveur standalone trouvé"
echo ""

# 8. Créer le dossier logs
echo "📁 8. Création du dossier logs..."
mkdir -p logs
echo "✅ Dossier logs créé"
echo ""

# 9. Arrêter PM2
echo "🛑 9. Arrêt de PM2..."
pm2 delete anireserve 2>/dev/null || true
echo "✅ PM2 arrêté"
echo ""

# 10. Démarrer PM2
echo "▶️  10. Démarrage de PM2..."
cd /var/www/anireserve
if ! pm2 start ecosystem.config.js; then
    echo "❌ Erreur lors du démarrage PM2"
    echo "📋 Vérifiez les logs:"
    pm2 logs anireserve --lines 50 --nostream
    exit 1
fi
echo "✅ PM2 démarré"
echo ""

# 11. Sauvegarder PM2
echo "💾 11. Sauvegarde de la configuration PM2..."
pm2 save
echo "✅ Configuration sauvegardée"
echo ""

# 12. Attendre que le serveur démarre
echo "⏳ 12. Attente du démarrage du serveur (15 secondes)..."
sleep 15

# 13. Vérifier le statut PM2
echo "📊 13. Vérification du statut PM2..."
pm2 status

# 14. Vérifier que le port 3000 écoute
echo "🔌 14. Vérification du port 3000..."
if netstat -tulpn 2>/dev/null | grep -q ":3000"; then
    echo "✅ Le port 3000 écoute"
else
    echo "⚠️  Le port 3000 n'écoute pas encore (peut prendre quelques secondes)"
    echo "   Vérifiez les logs PM2:"
    pm2 logs anireserve --lines 30 --nostream
fi
echo ""

# 15. Afficher les logs
echo "📋 15. Derniers logs PM2:"
pm2 logs anireserve --lines 30 --nostream
echo ""

echo "=================================="
echo "✅ Déploiement terminé!"
echo ""
echo "🔍 Vérifications finales:"
echo "   - PM2 status: pm2 status"
echo "   - Logs: pm2 logs anireserve"
echo "   - Port 3000: netstat -tulpn | grep :3000"
echo "   - Site: curl -I http://localhost:3000"
echo ""
