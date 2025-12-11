#!/bin/bash
# Script complet de correction de l'erreur 502

echo "🔧 Correction complète de l'erreur 502..."
echo ""

# Vérifier qu'on est sur le serveur
if [ ! -d "/var/www/anireserve" ]; then
    echo "❌ Ce script doit être exécuté sur le serveur"
    exit 1
fi

cd /var/www/anireserve/apps/web || exit 1

echo "1. Arrêt de l'application..."
pm2 delete anireserve 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

echo ""
echo "2. Vérification du build..."
if [ ! -d .next ]; then
    echo "   ⚠️  Build manquant, construction en cours..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "   ❌ Erreur lors du build"
        exit 1
    fi
    echo "   ✅ Build créé"
else
    echo "   ✅ Build existe"
fi

echo ""
echo "3. Vérification des variables d'environnement..."
if [ ! -f .env ]; then
    echo "   ❌ Fichier .env manquant!"
    echo "   Créez-le avec au minimum DATABASE_URL"
    exit 1
fi

if ! grep -q "DATABASE_URL" .env; then
    echo "   ⚠️  DATABASE_URL manquante dans .env"
fi
echo "   ✅ Fichier .env existe"

echo ""
echo "4. Vérification de la connexion DB..."
if npx prisma db pull > /dev/null 2>&1; then
    echo "   ✅ Connexion DB OK"
else
    echo "   ⚠️  Problème de connexion DB (peut être normal si migrations nécessaires)"
fi

echo ""
echo "5. Démarrage de l'application..."
pm2 start ecosystem.config.js
if [ $? -ne 0 ]; then
    echo "   ❌ Erreur lors du démarrage PM2"
    exit 1
fi
pm2 save

echo ""
echo "6. Attente du démarrage (15 secondes)..."
sleep 15

echo ""
echo "7. Vérification du statut..."
pm2 status

echo ""
echo "8. Vérification du port 3000..."
if netstat -tulpn 2>/dev/null | grep -q ":3000"; then
    echo "   ✅ Port 3000 utilisé"
    netstat -tulpn | grep :3000
else
    echo "   ❌ Rien n'écoute sur le port 3000"
    echo "   Vérifiez les logs:"
    pm2 logs anireserve --lines 30 --nostream
    exit 1
fi

echo ""
echo "9. Test de l'application..."
if curl -s --max-time 5 http://localhost:3000 > /dev/null; then
    echo "   ✅ Application répond sur localhost:3000"
else
    echo "   ❌ Application ne répond pas"
    echo "   Logs:"
    pm2 logs anireserve --lines 30 --nostream
    exit 1
fi

echo ""
echo "10. Vérification Nginx..."
if systemctl is-active --quiet nginx; then
    echo "   ✅ Nginx est actif"
    nginx -t 2>&1 | grep -q "successful" && echo "   ✅ Config Nginx valide" || echo "   ⚠️  Config Nginx invalide"
    systemctl reload nginx
else
    echo "   ❌ Nginx n'est pas actif"
    systemctl start nginx
fi

echo ""
echo "=========================================="
echo "✅ Correction terminée!"
echo ""
echo "Vérifiez maintenant:"
echo "  - PM2 status: pm2 status"
echo "  - Logs: pm2 logs anireserve --lines 20"
echo "  - Test: curl http://localhost:3000"
echo "=========================================="

