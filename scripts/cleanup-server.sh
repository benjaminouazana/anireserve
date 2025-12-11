#!/bin/bash
# Script de nettoyage et optimisation du serveur

echo "🧹 Nettoyage et optimisation du serveur AniReserve..."

# Vérifier qu'on est sur le serveur
if [ ! -d "/var/www/anireserve" ]; then
    echo "❌ Ce script doit être exécuté sur le serveur"
    exit 1
fi

cd /var/www/anireserve/apps/web || exit 1

# 1. Nettoyer les logs PM2
echo "📋 Nettoyage des logs PM2..."
pm2 flush 2>/dev/null || echo "⚠️  PM2 flush échoué (normal si PM2 n'est pas installé)"
echo "✅ Logs PM2 nettoyés"

# 2. Nettoyer le cache Next.js
echo "🗑️  Nettoyage du cache Next.js..."
if [ -d ".next" ]; then
    rm -rf .next/cache
    echo "✅ Cache Next.js nettoyé"
fi

# 3. Nettoyer les logs Nginx
echo "📋 Nettoyage des logs Nginx..."
if [ -f "/var/log/nginx/access.log" ]; then
    > /var/log/nginx/access.log
    echo "✅ Log access Nginx nettoyé"
fi
if [ -f "/var/log/nginx/error.log" ]; then
    > /var/log/nginx/error.log
    echo "✅ Log error Nginx nettoyé"
fi

# 4. Optimiser la base de données (vacuum pour SQLite, ANALYZE pour PostgreSQL)
echo "🗄️  Optimisation de la base de données..."
# Note: À adapter selon votre type de DB
# Pour PostgreSQL:
# psql $DATABASE_URL -c "ANALYZE;" 2>/dev/null || echo "⚠️  Optimisation DB échouée"

# 5. Redémarrer PM2 pour libérer la mémoire
echo "🔄 Redémarrage de PM2..."
pm2 restart anireserve 2>/dev/null || echo "⚠️  PM2 restart échoué"
sleep 3
pm2 status

# 6. Vérifier l'espace disque
echo ""
echo "💾 Espace disque:"
df -h / | tail -1

# 7. Vérifier la mémoire
echo ""
echo "🧠 Mémoire:"
free -h

echo ""
echo "✅ Nettoyage serveur terminé!"

