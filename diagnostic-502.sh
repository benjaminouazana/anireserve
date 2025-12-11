#!/bin/bash
# Script de diagnostic pour l'erreur 502 AniReserve

echo "=== 🔍 DIAGNOSTIC ERREUR 502 - ANIRESERVE ==="
echo ""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les erreurs
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Fonction pour afficher les succès
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Fonction pour afficher les avertissements
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "1. Vérification PM2..."
if command -v pm2 &> /dev/null; then
    success "PM2 est installé"
    echo ""
    pm2 status
    echo ""
    
    if pm2 list | grep -q "anireserve"; then
        success "Application 'anireserve' trouvée dans PM2"
        pm2 info anireserve | head -10
    else
        error "Application 'anireserve' NON trouvée dans PM2"
    fi
else
    error "PM2 n'est pas installé"
fi

echo ""
echo "2. Vérification du port 3000..."
if netstat -tulpn 2>/dev/null | grep -q ":3000"; then
    success "Quelque chose écoute sur le port 3000"
    netstat -tulpn | grep ":3000"
else
    error "Rien n'écoute sur le port 3000 - L'application Next.js n'est probablement pas démarrée"
fi

echo ""
echo "3. Vérification du chemin dans ecosystem.config.js..."
ECOSYSTEM_FILE="/var/www/anireserve/apps/web/ecosystem.config.js"
if [ -f "$ECOSYSTEM_FILE" ]; then
    success "Fichier ecosystem.config.js trouvé"
    CWD_PATH=$(grep "cwd:" "$ECOSYSTEM_FILE" | sed 's/.*cwd: *['\''"]\([^'\''"]*\)['\''"].*/\1/')
    echo "   Chemin configuré: $CWD_PATH"
    
    if [ "$CWD_PATH" = "/var/www/anireserve/apps/web" ]; then
        success "Le chemin est correct"
    elif [ "$CWD_PATH" = "/root/anireserve/apps/web" ]; then
        error "Le chemin est incorrect (utilise /root au lieu de /var/www)"
        warning "Correction nécessaire: sed -i \"s|/root/anireserve|/var/www/anireserve|g\" $ECOSYSTEM_FILE"
    else
        warning "Chemin inattendu: $CWD_PATH"
    fi
    
    if [ -d "$CWD_PATH" ]; then
        success "Le répertoire existe: $CWD_PATH"
    else
        error "Le répertoire n'existe pas: $CWD_PATH"
    fi
else
    error "Fichier ecosystem.config.js introuvable à $ECOSYSTEM_FILE"
fi

echo ""
echo "4. Vérification du build Next.js..."
NEXT_DIR="/var/www/anireserve/apps/web/.next"
if [ -d "$NEXT_DIR" ]; then
    success "Dossier .next existe"
    echo "   Taille: $(du -sh $NEXT_DIR 2>/dev/null | cut -f1)"
    
    # Vérifier si c'est un build standalone
    if [ -d "$NEXT_DIR/standalone" ]; then
        success "Build standalone détecté"
    else
        warning "Build standalone non trouvé (peut être normal si output: 'standalone' n'est pas activé)"
    fi
else
    error "Dossier .next n'existe pas - BUILD REQUIS"
    warning "Exécuter: cd /var/www/anireserve/apps/web && npm run build"
fi

echo ""
echo "5. Vérification des variables d'environnement..."
ENV_FILE="/var/www/anireserve/apps/web/.env"
if [ -f "$ENV_FILE" ]; then
    success "Fichier .env existe"
    
    if grep -q "DATABASE_URL" "$ENV_FILE"; then
        success "DATABASE_URL est définie"
        DB_URL=$(grep "DATABASE_URL" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
        if [ -n "$DB_URL" ] && [ "$DB_URL" != "" ]; then
            success "DATABASE_URL a une valeur"
        else
            error "DATABASE_URL est vide"
        fi
    else
        error "DATABASE_URL manquante dans .env"
    fi
    
    if grep -q "NEXT_PUBLIC_BASE_URL" "$ENV_FILE"; then
        success "NEXT_PUBLIC_BASE_URL est définie"
    else
        warning "NEXT_PUBLIC_BASE_URL manquante (optionnel mais recommandé)"
    fi
    
    if grep -q "NEXTAUTH_SECRET" "$ENV_FILE"; then
        success "NEXTAUTH_SECRET est définie"
    else
        warning "NEXTAUTH_SECRET manquante (peut causer des problèmes d'authentification)"
    fi
else
    error "Fichier .env n'existe pas"
    warning "Créer le fichier .env avec les variables nécessaires"
fi

echo ""
echo "6. Vérification Nginx..."
if systemctl is-active --quiet nginx; then
    success "Nginx est actif"
    
    if nginx -t 2>&1 | grep -q "successful"; then
        success "Configuration Nginx valide"
    else
        error "Configuration Nginx invalide"
        nginx -t
    fi
    
    # Vérifier les logs d'erreur récents
    if [ -f "/var/log/nginx/error.log" ]; then
        ERROR_COUNT=$(tail -100 /var/log/nginx/error.log | grep -c "502\|Bad Gateway" || echo "0")
        if [ "$ERROR_COUNT" -gt 0 ]; then
            warning "Erreurs 502 récentes dans les logs Nginx: $ERROR_COUNT"
            echo "   Dernières erreurs:"
            tail -5 /var/log/nginx/error.log | grep -i "502\|bad gateway" | head -3
        fi
    fi
else
    error "Nginx n'est pas actif"
fi

echo ""
echo "7. Vérification des logs PM2..."
if pm2 list | grep -q "anireserve"; then
    echo "   Derniers logs (10 lignes):"
    pm2 logs anireserve --lines 10 --nostream 2>/dev/null | tail -10 || error "Impossible de lire les logs"
    
    # Vérifier les erreurs dans les logs
    ERROR_LOG="/root/.pm2/logs/anireserve-error.log"
    if [ -f "$ERROR_LOG" ]; then
        ERROR_COUNT=$(tail -50 "$ERROR_LOG" | grep -ci "error\|failed\|crash" || echo "0")
        if [ "$ERROR_COUNT" -gt 0 ]; then
            warning "Erreurs récentes dans les logs PM2: $ERROR_COUNT"
            echo "   Dernières erreurs:"
            tail -20 "$ERROR_LOG" | grep -i "error\|failed\|crash" | head -5
        fi
    fi
else
    warning "Aucun log disponible (application non démarrée)"
fi

echo ""
echo "8. Vérification de la structure du projet..."
PROJECT_ROOT="/var/www/anireserve"
if [ -d "$PROJECT_ROOT" ]; then
    success "Répertoire du projet existe: $PROJECT_ROOT"
    
    if [ -d "$PROJECT_ROOT/apps/web" ]; then
        success "Répertoire apps/web existe"
        
        if [ -f "$PROJECT_ROOT/apps/web/package.json" ]; then
            success "package.json trouvé"
        else
            error "package.json introuvable"
        fi
        
        if [ -d "$PROJECT_ROOT/apps/web/node_modules" ]; then
            success "node_modules existe"
        else
            error "node_modules n'existe pas - npm install requis"
        fi
    else
        error "Répertoire apps/web n'existe pas"
    fi
else
    error "Répertoire du projet n'existe pas: $PROJECT_ROOT"
fi

echo ""
echo "=== 📋 RÉSUMÉ ==="
echo ""
echo "Pour résoudre l'erreur 502, vérifiez:"
echo "1. ✅ PM2 est démarré avec l'application 'anireserve'"
echo "2. ✅ Le port 3000 est utilisé par l'application"
echo "3. ✅ Le chemin dans ecosystem.config.js est correct"
echo "4. ✅ Le build Next.js existe (.next/)"
echo "5. ✅ Le fichier .env existe avec DATABASE_URL"
echo "6. ✅ Nginx est actif et configuré correctement"
echo ""
echo "Commandes de réparation rapide:"
echo "  cd /var/www/anireserve/apps/web"
echo "  sed -i \"s|/root/anireserve|/var/www/anireserve|g\" ecosystem.config.js"
echo "  npm run build"
echo "  pm2 delete anireserve"
echo "  pm2 start ecosystem.config.js"
echo "  pm2 save"
echo "  systemctl reload nginx"
echo ""
echo "=== FIN DU DIAGNOSTIC ==="


