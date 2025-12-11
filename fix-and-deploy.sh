#!/bin/bash

# 🔧 Fix Prisma + Deploy Final
# Corrige la génération Prisma et déploie

set -e

SERVER="root@72.61.103.149"

echo "🔧 Fix Prisma & Deploy"
echo "======================"
echo ""

ssh $SERVER << 'ENDSSH'
set -e

cd /var/www/anireserve

echo "📂 Recherche du schema Prisma..."
find . -name "schema.prisma" -type f

echo ""
echo "🔧 Génération Prisma Client (avec chemin explicite)..."

# Générer depuis le schema à la racine du monorepo
if [ -f "prisma/schema.prisma" ]; then
    echo "✅ Schema trouvé dans prisma/"
    npx prisma generate --schema=./prisma/schema.prisma
elif [ -f "apps/web/prisma/schema.prisma" ]; then
    echo "✅ Schema trouvé dans apps/web/prisma/"
    npx prisma generate --schema=./apps/web/prisma/schema.prisma
else
    echo "⚠️  Schema Prisma non trouvé, création du .env..."
fi

echo ""
echo "⚙️  Configuration .env..."

# Créer .env s'il n'existe pas
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# Database (REMPLACE avec ta vraie URL Supabase)
DATABASE_URL="postgresql://user:password@localhost:5432/anireserve"

# App
NEXT_PUBLIC_BASE_URL="http://72.61.103.149"
NODE_ENV="production"

# Email Resend (REMPLACE avec ta vraie clé)
RESEND_API_KEY="re_YOUR_KEY_HERE"

# Optional
STRIPE_SECRET_KEY=""
EOF
    echo "✅ .env créé - CONFIGURE-LE MANUELLEMENT"
else
    echo "✅ .env existe déjà"
fi

# Créer .env dans apps/web aussi
cd apps/web
if [ ! -f ".env" ]; then
    ln -s ../../.env .env 2>/dev/null || cp ../../.env .env
fi

cd /var/www/anireserve

echo ""
echo "🏗️  Build production..."
cd apps/web
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi!"
else
    echo "❌ Build échoué"
    echo ""
    echo "⚠️  CONFIGURE TON .env:"
    echo "   ssh root@72.61.103.149"
    echo "   cd /var/www/anireserve"
    echo "   nano .env"
    echo ""
    echo "Ajoute ta vraie DATABASE_URL Supabase et RESEND_API_KEY"
    exit 1
fi

echo ""
echo "🔄 Redémarrage PM2..."
pm2 restart anireserve 2>/dev/null || pm2 start ecosystem.config.js 2>/dev/null

echo ""
echo "📊 Status:"
pm2 status

echo ""
echo "✅ DÉPLOIEMENT TERMINÉ !"

ENDSSH

echo ""
echo "🎉 PRESQUE FINI !"
echo ""
echo "⚠️  DERNIÈRE ÉTAPE: Configure ton .env"
echo ""
echo "ssh root@72.61.103.149"
echo "nano /var/www/anireserve/.env"
echo ""
echo "Remplace:"
echo "  DATABASE_URL avec ton URL Supabase"
echo "  RESEND_API_KEY avec ta clé Resend"
echo ""
echo "Puis redémarre:"
echo "  pm2 restart anireserve"
