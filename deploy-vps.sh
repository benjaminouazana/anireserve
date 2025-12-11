#!/bin/bash

# 🚀 Script de Déploiement VPS AniReserve
# Serveur: root@72.61.103.149

set -e

SERVER="root@72.61.103.149"
APP_DIR="/var/www/anireserve"
REPO_URL="https://github.com/benjaminouazana/anireserve.git"

echo "🚀 Déploiement AniReserve sur VPS"
echo "=================================="
echo "Serveur: $SERVER"
echo ""

# ============================================
# ÉTAPE 1: CONNEXION & SETUP INITIAL
# ============================================
echo "📡 Connexion au serveur..."

ssh $SERVER << 'ENDSSH'
set -e

echo "✅ Connecté au serveur"
echo ""

# Installer Node.js si nécessaire
if ! command -v node &> /dev/null; then
    echo "📦 Installation Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo "✅ Node.js installé"
else
    echo "✅ Node.js déjà installé: $(node -v)"
fi

# Installer PM2 si nécessaire
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installation PM2..."
    npm install -g pm2
    echo "✅ PM2 installé"
else
    echo "✅ PM2 déjà installé"
fi

# Installer PostgreSQL si nécessaire (optionnel si tu uses Supabase)
# if ! command -v psql &> /dev/null; then
#     echo "📦 Installation PostgreSQL..."
#     apt-get install -y postgresql postgresql-contrib
#     echo "✅ PostgreSQL installé"
# fi

ENDSSH

echo ""
echo "✅ Étape 1 terminée"
echo ""

# ============================================
# ÉTAPE 2: CLONE OU PULL DU CODE
# ============================================
echo "📥 Téléchargement du code..."

ssh $SERVER << ENDSSH
set -e

APP_DIR="$APP_DIR"
REPO_URL="$REPO_URL"

if [ -d "\$APP_DIR" ]; then
    echo "📂 Projet existe, mise à jour..."
    cd \$APP_DIR
    git pull origin main
else
    echo "📂 Clone du repository..."
    mkdir -p \$APP_DIR
    git clone \$REPO_URL \$APP_DIR
    cd \$APP_DIR
fi

echo "✅ Code à jour"

ENDSSH

echo ""
echo "✅ Étape 2 terminée"
echo ""

# ============================================
# ÉTAPE 3: INSTALLATION DÉPENDANCES
# ============================================
echo "📦 Installation des dépendances..."

ssh $SERVER << ENDSSH
set -e

cd $APP_DIR
npm install

cd apps/web
npm install

echo "✅ Dépendances installées"

ENDSSH

echo ""
echo "✅ Étape 3 terminée"
echo ""

# ============================================
# ÉTAPE 4: CONFIGURATION ENVIRONNEMENT
# ============================================
echo "⚙️  Configuration .env..."

# Copier .env depuis local vers serveur
echo "⚠️  IMPORTANT: Configure manuellement .env sur le serveur avec:"
echo ""
echo "ssh $SERVER"
echo "cd $APP_DIR"
echo "nano .env"
echo ""
echo "Ajoute:"
echo "DATABASE_URL=\"postgresql://...\""
echo "NEXT_PUBLIC_BASE_URL=\"https://ton-domaine.com\""
echo "RESEND_API_KEY=\"re_...\""
echo ""

# ============================================
# ÉTAPE 5: BUILD PRODUCTION
# ============================================
echo "🏗️  Build production..."

ssh $SERVER << ENDSSH
set -e

cd $APP_DIR

# Générer Prisma Client
npx prisma generate

# Build Next.js
cd apps/web
npm run build

echo "✅ Build terminé"

ENDSSH

echo ""
echo "✅ Étape 5 terminée"
echo ""

# ============================================
# ÉTAPE 6: CONFIGURATION PM2
# ============================================
echo "🔧 Configuration PM2..."

ssh $SERVER << 'ENDSSH'
set -e

cd /var/www/anireserve

# Créer fichier ecosystem PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

echo "✅ ecosystem.config.js créé"

# Démarrer avec PM2
pm2 delete anireserve 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ PM2 configuré et démarré"

ENDSSH

echo ""
echo "✅ Étape 6 terminée"
echo ""

# ============================================
# ÉTAPE 7: CONFIGURATION NGINX (Optionnel)
# ============================================
echo "🌐 Configuration Nginx..."

ssh $SERVER << 'ENDSSH'
set -e

# Installer Nginx si nécessaire
if ! command -v nginx &> /dev/null; then
    echo "📦 Installation Nginx..."
    apt-get install -y nginx
fi

# Créer config Nginx
cat > /etc/nginx/sites-available/anireserve << 'EOF'
server {
    listen 80;
    server_name _;  # Remplace par ton domaine

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Activer le site
ln -sf /etc/nginx/sites-available/anireserve /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Tester et recharger Nginx
nginx -t
systemctl reload nginx

echo "✅ Nginx configuré"

ENDSSH

echo ""
echo "✅ Étape 7 terminée"
echo ""

# ============================================
# RÉSUMÉ
# ============================================
echo "============================================"
echo "🎉 DÉPLOIEMENT TERMINÉ !"
echo "============================================"
echo ""
echo "✅ Code déployé sur $SERVER"
echo "✅ PM2 en cours d'exécution"
echo "✅ Nginx configuré"
echo ""
echo "🌐 Ton app est accessible sur:"
echo "   http://72.61.103.149"
echo ""
echo "📝 PROCHAINES ÉTAPES:"
echo "   1. Configure .env sur le serveur"
echo "   2. Configure ton domaine (DNS)"
echo "   3. Installe SSL (certbot)"
echo ""
echo "🔧 COMMANDES UTILES:"
echo "   ssh $SERVER"
echo "   pm2 logs anireserve    # Voir les logs"
echo "   pm2 restart anireserve # Redémarrer"
echo "   pm2 status             # Status"
echo ""
