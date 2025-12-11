# 🔧 Fix Erreur 504 Gateway Timeout

## 🐛 Problème

**Erreur 504 Gateway Timeout** - Nginx n'a pas reçu de réponse de l'application Next.js dans le délai imparti.

## 🔍 Causes Possibles

1. **Application Next.js trop lente** - Requêtes DB longues, code bloquant
2. **Timeout Nginx trop court** - Configuration Nginx
3. **Application bloquée/crashée** - Processus PM2 mort
4. **Problème de mémoire** - Application qui swap
5. **Connexion DB lente** - Timeout de connexion

---

## 🚀 Solutions Immédiates

### Solution 1: Vérifier PM2 et Redémarrer

```bash
ssh root@VOTRE_IP

# Vérifier le statut
pm2 status

# Si l'app est arrêtée ou en erreur
pm2 restart anireserve

# Vérifier les logs
pm2 logs anireserve --lines 50
```

### Solution 2: Augmenter le Timeout Nginx

```bash
# Éditer la config Nginx
nano /etc/nginx/sites-available/anireserve

# Ajouter ou modifier ces lignes dans le bloc location /:
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;
send_timeout 300s;

# Tester la config
nginx -t

# Recharger Nginx
systemctl reload nginx
```

### Solution 3: Vérifier les Requêtes DB Lentes

```bash
# Se connecter à PostgreSQL
psql $DATABASE_URL

# Vérifier les requêtes actives
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 seconds'
ORDER BY duration DESC;
```

### Solution 4: Vérifier la Mémoire

```bash
# Vérifier la mémoire disponible
free -h

# Vérifier l'utilisation par PM2
pm2 monit
```

---

## 🔧 Configuration Nginx Complète

Voici une configuration Nginx optimisée pour éviter les timeouts:

```nginx
server {
    listen 80;
    server_name anireserve.com www.anireserve.com;
    
    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name anireserve.com www.anireserve.com;

    # SSL configuration (votre config existante)
    # ...

    # Timeouts augmentés
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
    send_timeout 300s;
    
    # Buffer sizes
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;
    
    # Headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📋 Checklist de Diagnostic

Exécutez ces commandes sur le serveur:

```bash
# 1. Vérifier PM2
pm2 status
pm2 logs anireserve --lines 50

# 2. Vérifier le port 3000
netstat -tulpn | grep :3000

# 3. Tester l'application directement
curl -v http://localhost:3000

# 4. Vérifier Nginx
systemctl status nginx
nginx -t
tail -50 /var/log/nginx/error.log

# 5. Vérifier la mémoire
free -h
pm2 monit

# 6. Vérifier les processus
ps aux | grep node
```

---

## 🆘 Si l'Application Ne Répond Pas

### Redémarrer complètement

```bash
cd /var/www/anireserve/apps/web

# Arrêter PM2
pm2 delete anireserve

# Vérifier qu'aucun processus n'utilise le port 3000
lsof -i :3000
# Si oui, tuer le processus: kill -9 PID

# Redémarrer
pm2 start ecosystem.config.js
pm2 save

# Vérifier
pm2 status
curl http://localhost:3000
```

---

## ⚡ Optimisations pour Éviter les Timeouts

1. **Optimiser les requêtes DB** - Déjà fait avec les index ✅
2. **Ajouter du cache** - Déjà fait ✅
3. **Limiter les requêtes longues** - Timeout dans Prisma
4. **Augmenter les timeouts Nginx** - Voir ci-dessus

---

**Date:** 7 décembre 2025  
**Action:** Vérifier PM2 et augmenter les timeouts Nginx

