#!/bin/bash
# Script de diagnostic VPS pour AniReserve
# À exécuter sur le VPS : bash diagnostic-vps.sh

echo "🔍 DIAGNOSTIC COMPLET DU VPS ANIRESERVE"
echo "========================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Vérifier que Nginx est installé
echo "1️⃣  Vérification de Nginx..."
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}✓ Nginx est installé${NC}"
    nginx -v
else
    echo -e "${RED}✗ Nginx n'est pas installé${NC}"
    echo "   Installez-le avec : sudo apt install nginx -y"
    exit 1
fi
echo ""

# 2. Vérifier le statut de Nginx
echo "2️⃣  Statut du service Nginx..."
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx est actif${NC}"
else
    echo -e "${RED}✗ Nginx n'est pas actif${NC}"
    echo "   Démarrez-le avec : sudo systemctl start nginx"
fi
echo ""

# 3. Vérifier que le fichier de configuration existe
echo "3️⃣  Configuration Nginx pour anireserve.com..."
if [ -f "/etc/nginx/sites-available/anireserve.com" ]; then
    echo -e "${GREEN}✓ Fichier de configuration existe${NC}"
    echo "   Fichier : /etc/nginx/sites-available/anireserve.com"
    
    # Afficher le contenu
    echo ""
    echo "   Contenu du fichier :"
    echo "   --------------------"
    cat /etc/nginx/sites-available/anireserve.com | head -20
    echo "   ..."
else
    echo -e "${RED}✗ Fichier de configuration n'existe pas${NC}"
    echo "   Créez-le avec la configuration appropriée"
fi
echo ""

# 4. Vérifier que le site est activé (symlink)
echo "4️⃣  Vérification du symlink sites-enabled..."
if [ -L "/etc/nginx/sites-enabled/anireserve.com" ]; then
    echo -e "${GREEN}✓ Site activé (symlink présent)${NC}"
    ls -la /etc/nginx/sites-enabled/anireserve.com
else
    echo -e "${RED}✗ Site non activé${NC}"
    echo "   Activez-le avec : sudo ln -s /etc/nginx/sites-available/anireserve.com /etc/nginx/sites-enabled/anireserve.com"
fi
echo ""

# 5. Vérifier la syntaxe de la configuration
echo "5️⃣  Test de la syntaxe Nginx..."
if sudo nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✓ Syntaxe Nginx correcte${NC}"
    sudo nginx -t
else
    echo -e "${RED}✗ Erreur de syntaxe Nginx${NC}"
    sudo nginx -t
fi
echo ""

# 6. Vérifier que Nginx écoute sur les bons ports
echo "6️⃣  Ports écoutés par Nginx..."
if netstat -tlnp 2>/dev/null | grep nginx | grep -q ":80"; then
    echo -e "${GREEN}✓ Nginx écoute sur le port 80${NC}"
    netstat -tlnp 2>/dev/null | grep nginx | grep ":80"
else
    echo -e "${YELLOW}⚠ Nginx n'écoute pas sur le port 80${NC}"
fi

if netstat -tlnp 2>/dev/null | grep nginx | grep -q ":443"; then
    echo -e "${GREEN}✓ Nginx écoute sur le port 443 (SSL)${NC}"
    netstat -tlnp 2>/dev/null | grep nginx | grep ":443"
else
    echo -e "${YELLOW}⚠ Nginx n'écoute pas sur le port 443 (SSL non configuré)${NC}"
fi
echo ""

# 7. Vérifier le firewall
echo "7️⃣  Configuration du firewall..."
if command -v ufw &> /dev/null; then
    UFW_STATUS=$(sudo ufw status | head -1)
    echo "   Statut : $UFW_STATUS"
    
    if sudo ufw status | grep -q "80/tcp"; then
        echo -e "${GREEN}✓ Port 80 autorisé${NC}"
    else
        echo -e "${YELLOW}⚠ Port 80 peut-être bloqué${NC}"
        echo "   Autorisez-le avec : sudo ufw allow 80/tcp"
    fi
    
    if sudo ufw status | grep -q "443/tcp"; then
        echo -e "${GREEN}✓ Port 443 autorisé${NC}"
    else
        echo -e "${YELLOW}⚠ Port 443 peut-être bloqué${NC}"
        echo "   Autorisez-le avec : sudo ufw allow 443/tcp"
    fi
else
    echo -e "${YELLOW}⚠ UFW non installé ou autre firewall actif${NC}"
fi
echo ""

# 8. Vérifier que Next.js tourne
echo "8️⃣  Statut de l'application Next.js..."
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "anireserve"; then
        echo -e "${GREEN}✓ Application PM2 trouvée${NC}"
        pm2 list | grep anireserve
        
        # Vérifier le statut
        if pm2 list | grep anireserve | grep -q "online"; then
            echo -e "${GREEN}✓ Application en ligne${NC}"
        else
            echo -e "${RED}✗ Application non en ligne${NC}"
            echo "   Vérifiez avec : pm2 logs anireserve"
        fi
    else
        echo -e "${RED}✗ Application PM2 'anireserve' non trouvée${NC}"
        echo "   Démarrez-la avec : cd /root/anireserve/apps/web && pm2 start ecosystem.config.js"
    fi
else
    echo -e "${RED}✗ PM2 n'est pas installé${NC}"
    echo "   Installez-le avec : npm install -g pm2"
fi
echo ""

# 9. Vérifier que Next.js écoute sur le port 3000
echo "9️⃣  Port 3000 (Next.js)..."
if netstat -tlnp 2>/dev/null | grep -q ":3000"; then
    echo -e "${GREEN}✓ Port 3000 est utilisé${NC}"
    netstat -tlnp 2>/dev/null | grep ":3000"
    
    # Tester la connexion
    if curl -s http://localhost:3000 > /dev/null; then
        echo -e "${GREEN}✓ Next.js répond sur localhost:3000${NC}"
    else
        echo -e "${RED}✗ Next.js ne répond pas sur localhost:3000${NC}"
    fi
else
    echo -e "${RED}✗ Rien n'écoute sur le port 3000${NC}"
    echo "   Next.js n'est probablement pas démarré"
fi
echo ""

# 10. Vérifier la configuration du serveur_name
echo "🔟 Configuration server_name dans Nginx..."
if grep -q "server_name anireserve.com" /etc/nginx/sites-available/anireserve.com 2>/dev/null; then
    echo -e "${GREEN}✓ server_name anireserve.com configuré${NC}"
    grep "server_name" /etc/nginx/sites-available/anireserve.com
else
    echo -e "${RED}✗ server_name anireserve.com non trouvé${NC}"
fi
echo ""

# 11. Tester la connexion locale
echo "1️⃣1️⃣  Test de connexion locale..."
if curl -s -I http://localhost 2>&1 | head -1 | grep -q "HTTP"; then
    echo -e "${GREEN}✓ Nginx répond sur localhost${NC}"
    curl -s -I http://localhost | head -5
else
    echo -e "${RED}✗ Nginx ne répond pas sur localhost${NC}"
fi
echo ""

# 12. Tester avec le Host header
echo "1️⃣2️⃣  Test avec Host: anireserve.com..."
if curl -s -I -H "Host: anireserve.com" http://localhost 2>&1 | head -1 | grep -q "HTTP"; then
    echo -e "${GREEN}✓ Nginx répond avec Host: anireserve.com${NC}"
    curl -s -I -H "Host: anireserve.com" http://localhost | head -5
else
    echo -e "${RED}✗ Nginx ne répond pas avec Host: anireserve.com${NC}"
fi
echo ""

# 13. Vérifier l'IP publique du serveur
echo "1️⃣3️⃣  IP publique du serveur..."
SERVER_IP=$(curl -s ifconfig.me || curl -s icanhazip.com || hostname -I | awk '{print $1}')
echo "   IP publique : $SERVER_IP"
echo "   IP attendue : 72.61.103.149"

if [ "$SERVER_IP" = "72.61.103.149" ]; then
    echo -e "${GREEN}✓ IP correspond${NC}"
else
    echo -e "${YELLOW}⚠ IP différente - vérifiez le DNS${NC}"
fi
echo ""

# 14. Vérifier les logs Nginx pour erreurs récentes
echo "1️⃣4️⃣  Dernières erreurs Nginx (10 lignes)..."
if [ -f "/var/log/nginx/error.log" ]; then
    echo "   Dernières erreurs :"
    sudo tail -10 /var/log/nginx/error.log | sed 's/^/   /'
else
    echo -e "${YELLOW}⚠ Fichier de log non trouvé${NC}"
fi
echo ""

# 15. Résumé et recommandations
echo "========================================"
echo "📋 RÉSUMÉ ET RECOMMANDATIONS"
echo "========================================"
echo ""

# Compter les problèmes
ISSUES=0

if ! systemctl is-active --quiet nginx; then
    echo -e "${RED}❌ Nginx n'est pas actif${NC}"
    echo "   → sudo systemctl start nginx"
    ISSUES=$((ISSUES+1))
fi

if [ ! -f "/etc/nginx/sites-available/anireserve.com" ]; then
    echo -e "${RED}❌ Configuration Nginx manquante${NC}"
    echo "   → Créez /etc/nginx/sites-available/anireserve.com"
    ISSUES=$((ISSUES+1))
fi

if [ ! -L "/etc/nginx/sites-enabled/anireserve.com" ]; then
    echo -e "${RED}❌ Site non activé${NC}"
    echo "   → sudo ln -s /etc/nginx/sites-available/anireserve.com /etc/nginx/sites-enabled/anireserve.com"
    ISSUES=$((ISSUES+1))
fi

if ! netstat -tlnp 2>/dev/null | grep -q ":3000"; then
    echo -e "${RED}❌ Next.js ne tourne pas${NC}"
    echo "   → cd /root/anireserve/apps/web && pm2 start ecosystem.config.js"
    ISSUES=$((ISSUES+1))
fi

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ Configuration VPS semble correcte !${NC}"
    echo ""
    echo "Si le site n'est toujours pas accessible, le problème vient probablement du DNS."
    echo "Vérifiez que anireserve.com pointe vers 72.61.103.149 dans Hostinger."
else
    echo -e "${YELLOW}⚠️  $ISSUES problème(s) détecté(s) - corrigez-les ci-dessus${NC}"
fi

echo ""
echo "========================================"
echo "🔍 Diagnostic terminé"
echo "========================================"

