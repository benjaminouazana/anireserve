#!/bin/bash
# Script pour démarrer tous les services nécessaires sur le serveur
# À exécuter sur le serveur via SSH

echo "🚀 Démarrage des services AniReserve"
echo "===================================="
echo ""

# Aller dans le répertoire de l'application
cd /var/www/anireserve/apps/web || {
    echo "❌ Erreur: Impossible d'accéder à /var/www/anireserve/apps/web"
    exit 1
}

echo "📁 Répertoire: $(pwd)"
echo ""

# 1. Vérifier et créer le build si nécessaire
echo "1. Vérification du build Next.js..."
if [ ! -d .next ]; then
    echo "⚠️ Build manquant, construction en cours..."
    echo "   (Cela peut prendre 2-5 minutes)"
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors du build"
        echo "   Vérifiez les logs ci-dessus"
        exit 1
    fi
    echo "✅ Build créé avec succès"
else
    echo "✅ Build existe déjà"
fi
echo ""

# 2. Vérifier ecosystem.config.js
echo "2. Vérification de la configuration PM2..."
if [ ! -f ecosystem.config.js ]; then
    echo "❌ ecosystem.config.js manquant!"
    exit 1
fi
echo "✅ Configuration PM2 trouvée"
echo ""

# 3. Vérifier .env
echo "3. Vérification des variables d'environnement..."
if [ ! -f .env ]; then
    echo "⚠️ ATTENTION: .env manquant!"
    echo "   L'application peut ne pas fonctionner correctement"
else
    echo "✅ .env existe"
fi
echo ""

# 4. Démarrer/Redémarrer PM2
echo "4. Démarrage de l'application avec PM2..."
pm2 delete anireserve 2>/dev/null || echo "   (Aucune instance existante à supprimer)"

pm2 start ecosystem.config.js
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du démarrage PM2"
    exit 1
fi

pm2 save
echo "✅ Application démarrée avec PM2"
echo ""

# 5. Attendre que l'application démarre
echo "5. Attente du démarrage complet (15 secondes)..."
sleep 15
echo ""

# 6. Vérifier le statut PM2
echo "6. Statut PM2:"
pm2 status
echo ""

# 7. Vérifier le port 3000
echo "7. Vérification du port 3000..."
if netstat -tulpn 2>/dev/null | grep :3000 > /dev/null; then
    echo "✅ Port 3000 en écoute"
    netstat -tulpn | grep :3000
else
    echo "❌ Rien n'écoute sur le port 3000"
    echo ""
    echo "📋 Logs PM2 (dernières 30 lignes):"
    pm2 logs anireserve --lines 30 --nostream
    echo ""
    echo "⚠️ Il y a peut-être une erreur dans l'application"
fi
echo ""

# 8. Vérifier et démarrer Nginx
echo "8. Vérification de Nginx..."
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx est déjà actif"
    systemctl restart nginx
    echo "✅ Nginx redémarré"
else
    echo "⚠️ Nginx n'est pas actif, démarrage..."
    systemctl start nginx
    if [ $? -eq 0 ]; then
        echo "✅ Nginx démarré"
    else
        echo "❌ Erreur lors du démarrage de Nginx"
        echo "   Vérifiez: systemctl status nginx"
    fi
fi
echo ""

# 9. Activer Nginx au démarrage (si pas déjà fait)
systemctl enable nginx 2>/dev/null
echo "✅ Nginx configuré pour démarrer automatiquement"
echo ""

# 10. Test local
echo "9. Test local de l'application..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    echo "✅ Application répond localement (HTTP $HTTP_CODE)"
else
    echo "⚠️ Application ne répond pas correctement (HTTP $HTTP_CODE)"
    echo "   Vérifiez les logs: pm2 logs anireserve"
fi
echo ""

# 11. Résumé
echo "===================================="
echo "✅ Démarrage terminé!"
echo ""
echo "📋 Vérifications:"
echo "   - PM2: pm2 status"
echo "   - Logs: pm2 logs anireserve"
echo "   - Nginx: systemctl status nginx"
echo "   - Port 3000: netstat -tulpn | grep :3000"
echo ""
echo "🌐 Testez maintenant:"
echo "   - https://anireserve.com"
echo "   - http://72.61.103.149"
echo ""
