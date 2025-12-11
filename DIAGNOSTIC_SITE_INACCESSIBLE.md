# 🔴 Diagnostic - Site Inaccessible (ERR_CONNECTION_TIMED_OUT)

**Date:** 11 décembre 2025  
**Erreur:** `ERR_CONNECTION_TIMED_OUT` sur `anireserve.com`

## 🚨 Diagnostic Rapide

L'erreur `ERR_CONNECTION_TIMED_OUT` signifie que le serveur ne répond pas du tout. Cela peut être dû à plusieurs causes.

## 📋 Checklist de Diagnostic

### 1. Vérifier si le serveur est accessible

```bash
# Depuis votre Mac, tester la connexion au serveur
ping 72.61.103.149

# Tester le port HTTP/HTTPS
curl -I http://72.61.103.149
curl -I https://72.61.103.149
```

**Si le ping ne fonctionne pas :** Le serveur est peut-être down ou inaccessible.

### 2. Se connecter au serveur et vérifier l'état

```bash
# Se connecter au serveur
ssh root@72.61.103.149

# Une fois connecté, vérifier l'état de PM2
pm2 status

# Vérifier si Next.js écoute sur le port 3000
netstat -tulpn | grep :3000

# Vérifier les logs PM2
pm2 logs anireserve --lines 50
```

### 3. Vérifier Nginx

```bash
# Sur le serveur
# Vérifier si Nginx est actif
systemctl status nginx

# Vérifier les logs Nginx
tail -50 /var/log/nginx/error.log
tail -50 /var/log/nginx/access.log

# Vérifier la configuration Nginx
nginx -t
```

### 4. Vérifier le build Next.js

```bash
# Sur le serveur
cd /var/www/anireserve/apps/web

# Vérifier si le build existe
ls -la .next

# Si le build n'existe pas, le créer
npm run build
```

## 🔧 Solutions Rapides

### Solution 1: Redémarrer PM2

```bash
# Sur le serveur
cd /var/www/anireserve/apps/web

# Redémarrer PM2
pm2 restart anireserve

# Ou supprimer et recréer
pm2 delete anireserve
pm2 start ecosystem.config.js
pm2 save

# Vérifier le statut
pm2 status
```

### Solution 2: Rebuild et Redémarrer

```bash
# Sur le serveur
cd /var/www/anireserve/apps/web

# Rebuild l'application
npm run build

# Redémarrer PM2
pm2 restart anireserve

# Vérifier les logs
pm2 logs anireserve --lines 20
```

### Solution 3: Vérifier et Corriger la Configuration

```bash
# Sur le serveur
cd /var/www/anireserve/apps/web

# Vérifier ecosystem.config.js
cat ecosystem.config.js

# Vérifier que le chemin est correct
grep "cwd:" ecosystem.config.js
# Devrait afficher: cwd: '/var/www/anireserve/apps/web'

# Vérifier que le script est correct
grep "script:" ecosystem.config.js
# Devrait afficher: script: './node_modules/next/dist/bin/next' ou similaire
```

### Solution 4: Redémarrer Nginx

```bash
# Sur le serveur
# Redémarrer Nginx
systemctl restart nginx

# Vérifier le statut
systemctl status nginx
```

### Solution 5: Vérifier les Variables d'Environnement

```bash
# Sur le serveur
cd /var/www/anireserve/apps/web

# Vérifier que .env existe
ls -la .env

# Vérifier les variables importantes
cat .env | grep DATABASE_URL
cat .env | grep RESEND_API_KEY
cat .env | grep NODE_ENV
```

## 🚀 Script de Réparation Automatique

Copiez-collez ce script complet sur le serveur :

```bash
#!/bin/bash
echo "🔧 Réparation du site AniReserve..."
echo ""

cd /var/www/anireserve/apps/web

echo "1. Vérification du répertoire..."
pwd

echo ""
echo "2. Vérification du build..."
if [ ! -d .next ]; then
    echo "⚠️ Build manquant, construction en cours..."
    npm run build
else
    echo "✅ Build existe"
fi

echo ""
echo "3. Vérification de ecosystem.config.js..."
if [ -f ecosystem.config.js ]; then
    echo "✅ Configuration existe"
    echo "Chemin configuré:"
    grep "cwd:" ecosystem.config.js
    echo "Script configuré:"
    grep "script:" ecosystem.config.js
else
    echo "❌ Configuration manquante!"
    exit 1
fi

echo ""
echo "4. Redémarrage PM2..."
pm2 delete anireserve 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "5. Attente du démarrage..."
sleep 5

echo ""
echo "6. Vérification du statut..."
pm2 status

echo ""
echo "7. Vérification du port 3000..."
if netstat -tulpn | grep :3000 > /dev/null; then
    echo "✅ Quelque chose écoute sur le port 3000"
    netstat -tulpn | grep :3000
else
    echo "❌ Rien n'écoute sur le port 3000"
    echo "Vérifiez les logs:"
    pm2 logs anireserve --lines 20 --nostream
fi

echo ""
echo "8. Vérification de Nginx..."
systemctl status nginx --no-pager | head -5

echo ""
echo "9. Test local..."
curl -I http://localhost:3000 2>&1 | head -5

echo ""
echo "✅ Réparation terminée!"
echo ""
echo "Vérifiez maintenant:"
echo "  - pm2 logs anireserve"
echo "  - tail -50 /var/log/nginx/error.log"
```

## 🔍 Diagnostic Avancé

### Vérifier les Ports Ouverts

```bash
# Sur le serveur
# Vérifier tous les ports en écoute
netstat -tulpn

# Vérifier spécifiquement le port 3000
lsof -i :3000

# Vérifier le port 80 (HTTP)
lsof -i :80

# Vérifier le port 443 (HTTPS)
lsof -i :443
```

### Vérifier les Firewalls

```bash
# Sur le serveur
# Vérifier UFW (si installé)
ufw status

# Vérifier iptables
iptables -L -n
```

### Vérifier les Logs Système

```bash
# Sur le serveur
# Logs système récents
journalctl -xe --no-pager | tail -50

# Logs Nginx
tail -100 /var/log/nginx/error.log
tail -100 /var/log/nginx/access.log

# Logs PM2
pm2 logs anireserve --lines 100
```

## 🌐 Vérification DNS

```bash
# Depuis votre Mac
# Vérifier la résolution DNS
nslookup anireserve.com
dig anireserve.com

# Vérifier si le domaine pointe vers la bonne IP
host anireserve.com
```

## ⚠️ Causes Possibles

1. **Serveur down** - Le serveur VPS est peut-être arrêté
2. **PM2 arrêté** - L'application Next.js n'est pas démarrée
3. **Build manquant** - Le dossier `.next` n'existe pas
4. **Nginx down** - Le serveur web n'est pas actif
5. **Port bloqué** - Le firewall bloque les connexions
6. **DNS incorrect** - Le domaine ne pointe pas vers la bonne IP
7. **Erreur dans le code** - L'application crash au démarrage

## 🆘 Si Rien ne Fonctionne

1. **Contacter l'hébergeur** - Vérifier si le serveur VPS est actif
2. **Vérifier les ressources** - Le serveur peut être à court de mémoire/CPU
3. **Vérifier les backups** - Restaurer une version précédente si nécessaire
4. **Vérifier les certificats SSL** - Les certificats peuvent être expirés

## 📞 Commandes de Test Rapides

```bash
# Depuis votre Mac
# Test de connexion basique
curl -v https://anireserve.com

# Test avec timeout
curl --connect-timeout 10 https://anireserve.com

# Test du port 80
curl -I http://anireserve.com

# Test du port 443
curl -I https://anireserve.com
```

## ✅ Checklist de Vérification Finale

- [ ] Le serveur répond au ping
- [ ] PM2 montre "anireserve" avec statut "online"
- [ ] Le port 3000 est en écoute
- [ ] Nginx est actif
- [ ] Le build Next.js existe (dossier `.next`)
- [ ] Les logs PM2 ne montrent pas d'erreurs critiques
- [ ] Les logs Nginx ne montrent pas d'erreurs 502
- [ ] Le fichier `.env` existe et contient les bonnes variables
- [ ] Le DNS pointe vers la bonne IP

---

**Prochaine étape:** Exécuter le script de réparation automatique sur le serveur.
