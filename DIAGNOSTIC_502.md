# 🔍 Diagnostic Erreur 502 - AniReserve

## Problèmes identifiés dans le code

### 1. ⚠️ Chemin incorrect dans ecosystem.config.js
**Fichier:** `apps/web/ecosystem.config.js`
- **Ligne 7:** `cwd: '/root/anireserve/apps/web'`
- **Problème:** Le chemin devrait être `/var/www/anireserve/apps/web` selon les documents de déploiement

### 2. ⚠️ Configuration Next.js
**Fichier:** `apps/web/next.config.js`
- **Ligne 25:** `output: 'standalone'` - Cette option nécessite un build spécifique
- Si le build n'a pas été fait avec cette option, l'application ne démarrera pas correctement

### 3. ⚠️ Base de données
- Le schema Prisma utilise PostgreSQL
- Le code `lib/prisma.ts` attend une `DATABASE_URL` valide
- Si `DATABASE_URL` est manquante ou incorrecte, l'application ne peut pas démarrer

## 🔧 Solutions à appliquer

### Solution 1: Corriger le chemin dans ecosystem.config.js

```bash
# Sur le serveur
cd /var/www/anireserve/apps/web
nano ecosystem.config.js
```

Changer la ligne 7:
```javascript
cwd: '/var/www/anireserve/apps/web',  // Au lieu de '/root/anireserve/apps/web'
```

### Solution 2: Vérifier et corriger le build Next.js

```bash
# Sur le serveur
cd /var/www/anireserve/apps/web

# Vérifier si le dossier .next existe
ls -la .next

# Si .next n'existe pas ou est incomplet, rebuilder
npm run build

# Vérifier que le build s'est bien passé
ls -la .next/standalone  # Si output: 'standalone' est activé
```

### Solution 3: Vérifier les variables d'environnement

```bash
# Sur le serveur
cd /var/www/anireserve/apps/web

# Vérifier que .env existe
ls -la .env

# Vérifier DATABASE_URL
grep DATABASE_URL .env

# Si DATABASE_URL est manquante, l'ajouter
echo 'DATABASE_URL="postgresql://user:password@host:5432/database"' >> .env
```

### Solution 4: Redémarrer PM2 avec la bonne configuration

```bash
# Sur le serveur
cd /var/www/anireserve

# Arrêter PM2
pm2 delete anireserve 2>/dev/null || true

# Vérifier le chemin dans ecosystem.config.js
cat apps/web/ecosystem.config.js | grep cwd

# Si le chemin est incorrect, le corriger
sed -i "s|/root/anireserve|/var/www/anireserve|g" apps/web/ecosystem.config.js

# Redémarrer PM2
cd apps/web
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Vérifier le statut
pm2 status
pm2 logs anireserve --lines 20
```

### Solution 5: Vérifier Nginx

```bash
# Vérifier la configuration Nginx
nginx -t

# Vérifier que Nginx pointe vers le bon port
grep -r "proxy_pass" /etc/nginx/sites-enabled/ | grep 3000

# Recharger Nginx
systemctl reload nginx

# Vérifier les logs d'erreur
tail -f /var/log/nginx/error.log
```

## 🚀 Script de diagnostic complet

Exécute ce script sur le serveur pour identifier tous les problèmes:

```bash
#!/bin/bash
echo "=== DIAGNOSTIC ANIRESERVE 502 ==="

echo ""
echo "1. Vérification PM2..."
pm2 status
pm2 list | grep anireserve

echo ""
echo "2. Vérification du port 3000..."
netstat -tulpn | grep :3000 || echo "❌ Rien n'écoute sur le port 3000"

echo ""
echo "3. Vérification du chemin dans ecosystem.config.js..."
if [ -f /var/www/anireserve/apps/web/ecosystem.config.js ]; then
    grep "cwd:" /var/www/anireserve/apps/web/ecosystem.config.js
else
    echo "❌ Fichier ecosystem.config.js introuvable"
fi

echo ""
echo "4. Vérification du build Next.js..."
if [ -d /var/www/anireserve/apps/web/.next ]; then
    echo "✅ Dossier .next existe"
    ls -la /var/www/anireserve/apps/web/.next | head -5
else
    echo "❌ Dossier .next n'existe pas - BUILD REQUIS"
fi

echo ""
echo "5. Vérification des variables d'environnement..."
if [ -f /var/www/anireserve/apps/web/.env ]; then
    echo "✅ Fichier .env existe"
    if grep -q "DATABASE_URL" /var/www/anireserve/apps/web/.env; then
        echo "✅ DATABASE_URL est définie"
    else
        echo "❌ DATABASE_URL manquante"
    fi
else
    echo "❌ Fichier .env n'existe pas"
fi

echo ""
echo "6. Vérification Nginx..."
systemctl status nginx --no-pager | head -5

echo ""
echo "7. Logs PM2 récents..."
pm2 logs anireserve --lines 10 --nostream 2>/dev/null || echo "❌ Aucun log disponible"

echo ""
echo "=== FIN DU DIAGNOSTIC ==="
```

## 📋 Checklist de résolution rapide

- [ ] Vérifier que le chemin dans `ecosystem.config.js` est `/var/www/anireserve/apps/web`
- [ ] Vérifier que le build Next.js existe (`ls -la apps/web/.next`)
- [ ] Vérifier que `.env` existe et contient `DATABASE_URL`
- [ ] Vérifier que PM2 est démarré (`pm2 status`)
- [ ] Vérifier que le port 3000 est utilisé (`netstat -tulpn | grep :3000`)
- [ ] Vérifier que Nginx est actif (`systemctl status nginx`)
- [ ] Vérifier les logs PM2 pour les erreurs (`pm2 logs anireserve`)

## 🔗 Commandes de réparation rapide

```bash
# Tout en une fois (à exécuter sur le serveur)
ssh root@VOTRE_IP << 'EOF'
cd /var/www/anireserve/apps/web

# Corriger le chemin si nécessaire
sed -i "s|/root/anireserve|/var/www/anireserve|g" ecosystem.config.js

# Vérifier/créer le build
if [ ! -d .next ]; then
    echo "Build manquant, construction en cours..."
    npm run build
fi

# Vérifier .env
if [ ! -f .env ]; then
    echo "⚠️ Fichier .env manquant - À créer manuellement"
fi

# Redémarrer PM2
pm2 delete anireserve 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# Vérifier
pm2 status
netstat -tulpn | grep :3000
EOF
```


