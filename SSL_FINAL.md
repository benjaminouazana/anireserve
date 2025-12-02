# Configuration SSL finale - AniReserve

## 🎉 Le site est en ligne ! Maintenant configurons SSL

---

## 📋 Étape 1 : Obtenir les certificats SSL avec Certbot

Sur le VPS, exécutez :

```bash
# 1. S'assurer que le dossier webroot existe
sudo mkdir -p /var/www/html/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# 2. Obtenir les certificats SSL
sudo certbot certonly --webroot -w /var/www/html -d anireserve.com -d www.anireserve.com
```

**Questions Certbot** :
1. **Email** : Entrez votre email (pour les notifications d'expiration)
2. **Accepter les termes** : Tapez `Y` puis `Enter`
3. **Partager l'email avec EFF** : Tapez `N` (optionnel) puis `Enter`

**Résultat attendu** :
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/anireserve.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/anireserve.com/privkey.pem
```

✅ **Si vous voyez ce message, les certificats sont créés !**

---

## 🔍 Étape 2 : Vérifier que les certificats existent

```bash
sudo ls -la /etc/letsencrypt/live/anireserve.com/
```

Vous devriez voir :
- `fullchain.pem` ✅
- `privkey.pem` ✅
- `chain.pem` ✅

---

## 📝 Étape 3 : Appliquer la configuration Nginx avec SSL

```bash
# 1. Aller dans le dossier du projet
cd /root/anireserve

# 2. Mettre à jour le code (pour avoir nginx-ssl-final.conf)
git pull origin main

# 3. Faire un backup de l'ancienne config
sudo cp /etc/nginx/sites-available/anireserve.com /etc/nginx/sites-available/anireserve.com.backup

# 4. Copier la nouvelle configuration SSL
sudo cp nginx-ssl-final.conf /etc/nginx/sites-available/anireserve.com

# 5. Tester la configuration
sudo nginx -t
```

**Résultat attendu** :
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

✅ **Si vous voyez "syntax is ok" et "test is successful", c'est bon !**

```bash
# 6. Recharger Nginx
sudo systemctl reload nginx

# 7. Vérifier le statut
sudo systemctl status nginx
```

Nginx doit être `active (running)`.

---

## ✅ Étape 4 : Vérifier que SSL fonctionne

### Test 1 : Vérifier HTTPS

```bash
curl -I https://anireserve.com
```

Vous devriez voir :
```
HTTP/2 200
...
```

### Test 2 : Vérifier la redirection HTTP → HTTPS

```bash
curl -I http://anireserve.com
```

Vous devriez voir :
```
HTTP/1.1 301 Moved Permanently
Location: https://anireserve.com/
```

### Test 3 : Ouvrir dans le navigateur

1. Allez sur **https://anireserve.com**
2. Vérifiez que le **cadenas 🔒** apparaît dans la barre d'adresse
3. Cliquez sur le cadenas pour voir les détails du certificat

✅ **Si vous voyez le cadenas, SSL est configuré !**

---

## 🚀 Étape 5 : Déployer les derniers correctifs

Maintenant que SSL fonctionne, déployons les optimisations :

```bash
# 1. Aller dans le dossier web
cd /root/anireserve/apps/web

# 2. Installer les dépendances (si nécessaire)
npm install

# 3. Rebuild l'application
npm run build

# 4. Redémarrer PM2
pm2 restart anireserve

# 5. Vérifier les logs
pm2 logs anireserve --lines 10
```

Vous devriez voir :
```
✓ Ready in 400-600ms
```

---

## 🔄 Étape 6 : Configurer le renouvellement automatique SSL

Certbot configure automatiquement le renouvellement, mais vérifions :

```bash
# Tester le renouvellement (simulation)
sudo certbot renew --dry-run
```

**Résultat attendu** :
```
Congratulations, all simulated renewals succeeded
```

✅ **Si vous voyez ce message, le renouvellement automatique est configuré !**

---

## 📊 Étape 7 : Vérifications finales

### Checklist complète

- [ ] Certificats SSL créés (`/etc/letsencrypt/live/anireserve.com/`)
- [ ] Configuration Nginx SSL appliquée
- [ ] HTTPS fonctionne : https://anireserve.com
- [ ] HTTP redirige vers HTTPS
- [ ] Le cadenas 🔒 apparaît dans le navigateur
- [ ] Application Next.js redémarrée avec les correctifs
- [ ] Renouvellement automatique SSL configuré
- [ ] Aucune erreur dans les logs : `pm2 logs anireserve`
- [ ] Aucune erreur dans les logs Nginx : `sudo tail -f /var/log/nginx/error.log`

---

## 🎯 Commandes de référence rapide

```bash
# Voir les certificats SSL
sudo certbot certificates

# Tester le renouvellement
sudo certbot renew --dry-run

# Voir les logs Nginx
sudo tail -f /var/log/nginx/error.log

# Voir les logs PM2
pm2 logs anireserve

# Redémarrer tout
sudo systemctl reload nginx
pm2 restart anireserve

# Vérifier le statut
pm2 status
sudo systemctl status nginx
```

---

## 🚨 En cas de problème

### Problème : Certbot échoue toujours

**Solution** : Utiliser le mode standalone avec IPv4 uniquement

```bash
sudo systemctl stop nginx
sudo certbot certonly --standalone --preferred-challenges http -d anireserve.com -d www.anireserve.com --force-ipv4
sudo systemctl start nginx
```

### Problème : Nginx ne démarre pas après la config SSL

**Solution** :
```bash
# Vérifier les erreurs
sudo nginx -t

# Voir les logs
sudo tail -f /var/log/nginx/error.log

# Restaurer l'ancienne config si nécessaire
sudo cp /etc/nginx/sites-available/anireserve.com.backup /etc/nginx/sites-available/anireserve.com
sudo nginx -t
sudo systemctl reload nginx
```

### Problème : HTTPS ne fonctionne pas

**Solution** :
```bash
# Vérifier que les certificats existent
sudo ls -la /etc/letsencrypt/live/anireserve.com/

# Vérifier la configuration
sudo nginx -t

# Vérifier que Nginx écoute sur le port 443
sudo netstat -tlnp | grep :443
```

---

## 🎉 Félicitations !

Si toutes les étapes sont complétées, votre site **AniReserve** est maintenant :

- ✅ **En ligne** : https://anireserve.com
- ✅ **Sécurisé** : SSL/TLS avec certificat Let's Encrypt
- ✅ **Optimisé** : Performance et UX améliorées
- ✅ **Auto-renouvellement** : Les certificats SSL se renouvellent automatiquement
- ✅ **Prêt pour la production** : Tout est configuré !

---

## 📝 Maintenance future

### Vérifier les certificats (mensuel)

```bash
sudo certbot certificates
```

### Vérifier le renouvellement (mensuel)

```bash
sudo certbot renew --dry-run
```

### Renouveler manuellement (si nécessaire)

```bash
sudo certbot renew
sudo systemctl reload nginx
```

Les certificats Let's Encrypt expirent après 90 jours, mais Certbot les renouvelle automatiquement 30 jours avant l'expiration.

---

**Votre site est maintenant complètement configuré et sécurisé ! 🚀**


