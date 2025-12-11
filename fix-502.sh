#!/bin/bash

# 🚨 Fix Erreur 502 - Diagnostic et Réparation Automatique
# Serveur: root@72.61.103.149

set -e

SERVER="root@72.61.103.149"

echo "🔍 DIAGNOSTIC ERREUR 502"
echo "========================"
echo ""

ssh $SERVER << 'ENDSSH'
set -e

echo "📊 1. Vérification PM2..."
pm2 list

echo ""
echo "🔍 2. Status anireserve..."
pm2 status anireserve || echo "❌ App non trouvée dans PM2"

echo ""
echo "📝 3. Logs PM2 (dernières lignes)..."
pm2 logs anireserve --lines 20 --nostream || echo "Pas de logs disponibles"

echo ""
echo "🌐 4. Vérification Nginx..."
systemctl status nginx | head -20

echo ""
echo "🔌 5. Vérification port 3000..."
netstat -tulpn | grep :3000 || echo "❌ Rien n'écoute sur port 3000"

echo ""
echo "📂 6. Vérification fichiers app..."
ls -la /var/www/anireserve/apps/web/.next/ | head -10 || echo "❌ Build .next manquant"

echo ""
echo "🔧 TENTATIVE DE FIX AUTOMATIQUE..."
echo ""

# Fix 1: Redémarrer PM2
echo "🔄 Redémarrage PM2..."
cd /var/www/anireserve
pm2 delete anireserve 2>/dev/null || true

# Vérifier si ecosystem.config.js existe
if [ ! -f "ecosystem.config.js" ]; then
    echo "📝 Création ecosystem.config.js..."
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/anireserve-error.log',
    out_file: '/var/log/pm2/anireserve-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
}
EOF
fi

# Vérifier que le build existe
if [ ! -d "apps/web/.next" ]; then
    echo "🏗️  Build manquant, reconstruction..."
    cd apps/web
    npm run build
    cd ../..
fi

# Démarrer PM2
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✅ PM2 redémarré"

# Fix 2: Vérifier Nginx
echo ""
echo "🔍 Test configuration Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Config Nginx OK"
    systemctl reload nginx
    echo "✅ Nginx rechargé"
else
    echo "❌ Erreur config Nginx"
    echo "📝 Recréation config Nginx..."
    
    cat > /etc/nginx/sites-available/anireserve << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name anireserve.com www.anireserve.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name anireserve.com www.anireserve.com;

    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/anireserve.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/anireserve.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Logs
    access_log /var/log/nginx/anireserve-access.log;
    error_log /var/log/nginx/anireserve-error.log;

    # Next.js app
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files
    location /_next/static {
        proxy_cache STATIC;
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /static {
        proxy_cache STATIC;
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF

    nginx -t && systemctl reload nginx
    echo "✅ Nginx reconfiguré"
fi

echo ""
echo "🔍 ÉTAT FINAL"
echo "============="
echo ""
echo "PM2:"
pm2 status anireserve

echo ""
echo "Port 3000:"
netstat -tulpn | grep :3000

echo ""
echo "Nginx:"
systemctl status nginx | grep Active

echo ""
echo "✅ FIX TERMINÉ !"
echo ""
echo "🌐 Teste le site: https://anireserve.com"
echo ""
echo "📝 Si encore 502, voir logs:"
echo "   pm2 logs anireserve"
echo "   tail -f /var/log/nginx/anireserve-error.log"

ENDSSH

echo ""
echo "🎉 RÉPARATION COMPLÉTÉE !"
echo ""
echo "🔍 Teste maintenant: https://anireserve.com"
echo ""
echo "Si encore problème, envoie-moi les logs avec:"
echo "ssh root@72.61.103.149 'pm2 logs anireserve --lines 50'"
