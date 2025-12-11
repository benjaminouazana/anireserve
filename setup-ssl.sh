#!/bin/bash

# 🔐 Configuration SSL automatique avec Certbot
# Pour domaine custom

set -e

SERVER="root@72.61.103.149"

echo "🔐 Configuration SSL/HTTPS"
echo "=========================="
echo ""
read -p "📝 Quel est ton nom de domaine ? (ex: anireserve.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ Domaine requis"
    exit 1
fi

echo ""
read -p "📧 Ton email pour certificat SSL: " EMAIL

if [ -z "$EMAIL" ]; then
    echo "❌ Email requis"
    exit 1
fi

echo ""
echo "🚀 Configuration SSL pour $DOMAIN..."
echo ""

ssh $SERVER << ENDSSH
set -e

DOMAIN="$DOMAIN"
EMAIL="$EMAIL"

echo "📦 Installation Certbot..."
apt-get update
apt-get install -y certbot python3-certbot-nginx

echo ""
echo "🔧 Configuration Nginx pour \$DOMAIN..."

# Update Nginx config avec le domaine
cat > /etc/nginx/sites-available/anireserve << EOF
server {
    listen 80;
    server_name \$DOMAIN www.\$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Test config
nginx -t
systemctl reload nginx

echo ""
echo "🔐 Génération certificat SSL..."
certbot --nginx -d \$DOMAIN -d www.\$DOMAIN --non-interactive --agree-tos -m \$EMAIL

echo ""
echo "⏰ Configuration renouvellement auto..."
certbot renew --dry-run

echo ""
echo "⚙️  Mise à jour .env..."
cd /var/www/anireserve
sed -i "s|NEXT_PUBLIC_BASE_URL=.*|NEXT_PUBLIC_BASE_URL=\"https://\$DOMAIN\"|g" .env

echo ""
echo "🔄 Redémarrage PM2..."
pm2 restart anireserve

echo ""
echo "✅ SSL CONFIGURÉ !"
echo ""
echo "🌐 Ton app est maintenant sur:"
echo "   https://\$DOMAIN"

ENDSSH

echo ""
echo "🎉 HTTPS ACTIVÉ !"
echo ""
echo "📝 Prochaine étape:"
echo "   Update capacitor.config.ts avec:"
echo "   url: 'https://$DOMAIN'"
