# 🚀 Instructions de Démarrage - Services AniReserve

**Date:** 11 décembre 2025

## ⚠️ Important

Le serveur a été redémarré, mais il faut maintenant démarrer les services (PM2 et Nginx).

## 📋 Étapes à Suivre

### 1. Se connecter au serveur

```bash
ssh root@72.61.103.149
```

### 2. Exécuter le script de démarrage

Une fois connecté, copiez-collez cette commande :

```bash
cd /var/www/anireserve/apps/web && \
if [ ! -d .next ]; then echo "Build manquant, construction..." && npm run build; fi && \
pm2 delete anireserve 2>/dev/null; \
pm2 start ecosystem.config.js && \
pm2 save && \
systemctl restart nginx && \
sleep 10 && \
pm2 status && \
netstat -tulpn | grep :3000
```

### 3. Ou utiliser le script complet

Si vous préférez, vous pouvez copier le contenu de `START_SERVICES.sh` sur le serveur :

```bash
# Sur le serveur
cd /var/www/anireserve/apps/web
nano start-services.sh
# Collez le contenu du fichier START_SERVICES.sh
# Sauvegardez (Ctrl+X, puis Y, puis Enter)
chmod +x start-services.sh
./start-services.sh
```

## 🔍 Vérification Rapide

Après avoir exécuté les commandes, vérifiez :

```bash
# Vérifier PM2
pm2 status
# Devrait montrer "anireserve" avec statut "online"

# Vérifier le port
netstat -tulpn | grep :3000
# Devrait montrer que quelque chose écoute

# Vérifier Nginx
systemctl status nginx
# Devrait montrer "active (running)"

# Test local
curl -I http://localhost:3000
# Devrait retourner HTTP 200 ou 301/302
```

## ⚡ Commande Rapide (Tout-en-un)

```bash
ssh root@72.61.103.149 'cd /var/www/anireserve/apps/web && [ ! -d .next ] && npm run build || true && pm2 delete anireserve 2>/dev/null; pm2 start ecosystem.config.js && pm2 save && systemctl restart nginx && sleep 10 && echo "=== PM2 Status ===" && pm2 status && echo "" && echo "=== Port 3000 ===" && netstat -tulpn | grep :3000 && echo "" && echo "=== Nginx ===" && systemctl status nginx --no-pager | head -3'
```

## 🐛 Si ça ne fonctionne pas

### Vérifier les logs PM2

```bash
pm2 logs anireserve --lines 50
```

### Vérifier les logs Nginx

```bash
tail -50 /var/log/nginx/error.log
```

### Vérifier que le build existe

```bash
cd /var/www/anireserve/apps/web
ls -la .next
```

Si le dossier `.next` n'existe pas :

```bash
npm run build
pm2 restart anireserve
```

## ✅ Une fois que tout fonctionne

Testez le site dans votre navigateur :
- https://anireserve.com
- http://72.61.103.149

---

**Note:** Il peut falloir 1-2 minutes après le démarrage des services pour que le site soit complètement accessible.
