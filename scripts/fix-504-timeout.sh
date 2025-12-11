#!/bin/bash
# Script de correction de l'erreur 504 Gateway Timeout

echo "🔧 Correction de l'erreur 504 Gateway Timeout..."

# Vérifier qu'on est sur le serveur
if [ ! -d "/var/www/anireserve" ]; then
    echo "❌ Ce script doit être exécuté sur le serveur"
    exit 1
fi

echo ""
echo "1. Vérification PM2..."
pm2 status
pm2 list | grep anireserve

echo ""
echo "2. Vérification du port 3000..."
if netstat -tulpn 2>/dev/null | grep -q ":3000"; then
    echo "✅ Port 3000 utilisé"
    netstat -tulpn | grep :3000
else
    echo "❌ Rien n'écoute sur le port 3000"
    echo "   Redémarrage de l'application..."
    cd /var/www/anireserve/apps/web
    pm2 delete anireserve 2>/dev/null
    pm2 start ecosystem.config.js
    pm2 save
    sleep 5
fi

echo ""
echo "3. Test de l'application..."
if curl -s --max-time 10 http://localhost:3000 > /dev/null; then
    echo "✅ Application répond sur localhost:3000"
else
    echo "❌ Application ne répond pas"
    echo "   Redémarrage complet..."
    cd /var/www/anireserve/apps/web
    pm2 delete anireserve 2>/dev/null
    # Tuer tout processus sur le port 3000
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    pm2 start ecosystem.config.js
    pm2 save
    sleep 10
fi

echo ""
echo "4. Vérification Nginx..."
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx est actif"
    
    # Vérifier la config
    if nginx -t 2>&1 | grep -q "successful"; then
        echo "✅ Configuration Nginx valide"
    else
        echo "❌ Configuration Nginx invalide"
        nginx -t
    fi
else
    echo "❌ Nginx n'est pas actif"
    systemctl start nginx
fi

echo ""
echo "5. Vérification de la mémoire..."
free -h

echo ""
echo "6. Logs récents PM2..."
pm2 logs anireserve --lines 20 --nostream 2>/dev/null || echo "⚠️  Aucun log disponible"

echo ""
echo "7. Logs récents Nginx..."
tail -20 /var/log/nginx/error.log 2>/dev/null | grep -i "timeout\|504" || echo "   Aucune erreur timeout récente"

echo ""
echo "=== Recommandations ==="
echo ""
echo "Si l'erreur 504 persiste:"
echo "1. Augmenter les timeouts Nginx (voir FIX_504_TIMEOUT.md)"
echo "2. Vérifier les requêtes DB lentes"
echo "3. Augmenter la mémoire du serveur si nécessaire"
echo ""
echo "✅ Diagnostic terminé"

