#!/bin/bash
# Script de déploiement pour AniReserve
# Fichier : /root/anireserve/deploy.sh

set -e  # Arrête le script en cas d'erreur

echo "🚀 Début du déploiement d'AniReserve..."

# 1. Aller dans le dossier du projet
cd /root/anireserve

# 2. Sauvegarder l'ancien build (au cas où)
echo "📦 Sauvegarde de l'ancien build..."
if [ -d "apps/web/.next" ]; then
    cp -r apps/web/.next apps/web/.next.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
fi

# 3. Récupérer les dernières modifications depuis GitHub
echo "📥 Récupération des modifications depuis GitHub..."
git pull origin main

# 4. Installer les dépendances (si nécessaire)
echo "📦 Vérification des dépendances..."
cd apps/web
npm install

# 5. Générer Prisma Client
echo "🔧 Génération de Prisma Client..."
npx prisma generate --schema=../../prisma/schema.prisma

# 6. Builder l'application
echo "🏗️  Build de l'application..."
npm run build

# 7. Vérifier que le build a réussi
if [ ! -f ".next/BUILD_ID" ]; then
    echo "❌ Erreur : Le build a échoué (BUILD_ID manquant)"
    exit 1
fi

echo "✅ Build réussi !"

# 8. Redémarrer l'application avec PM2
echo "🔄 Redémarrage de l'application..."
pm2 restart anireserve

# 9. Attendre quelques secondes pour vérifier que ça démarre
sleep 5

# 10. Vérifier le statut
if pm2 list | grep -q "anireserve.*online"; then
    echo "✅ Application redémarrée avec succès !"
else
    echo "⚠️  Attention : L'application pourrait ne pas être démarrée correctement"
    echo "Vérifiez avec : pm2 logs anireserve"
fi

# 11. Nettoyer les anciens backups (garder seulement les 3 derniers)
echo "🧹 Nettoyage des anciens backups..."
cd /root/anireserve/apps/web
ls -dt .next.backup.* 2>/dev/null | tail -n +4 | xargs rm -rf 2>/dev/null || true

echo "✨ Déploiement terminé !"
echo ""
echo "📊 Statut de l'application :"
pm2 status anireserve

echo ""
echo "📝 Logs récents :"
pm2 logs anireserve --lines 5 --nostream


