# Instructions pour configurer SSL - AniReserve

## 📋 Prérequis

Avant de commencer, assurez-vous que :
- ✅ Le DNS est corrigé (anireserve.com pointe vers 72.61.103.149)
- ✅ Le site est accessible en HTTP : `curl -I http://anireserve.com`
- ✅ Nginx fonctionne : `sudo systemctl status nginx`
- ✅ PM2 fonctionne : `pm2 status`

## 🔒 Étape 1 : Obtenir les certificats SSL avec Certbot

Sur le VPS, exécutez :

```bash
# 1. S'assurer que le dossier webroot existe
sudo mkdir -p /var/www/html/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# 2. Obtenir les certificats
sudo certbot certonly --webroot -w /var/www/html -d anireserve.com -d www.anireserve.com
```

Certbot va vous demander :
1. **Email** : Entrez votre email (pour les notifications d'expiration)
2. **Accepter les termes** : Tapez `Y`
3. **Partager l'email avec EFF** : Tapez `N` (optionnel)

Si tout se passe bien, vous verrez :
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/anireserve.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/anireserve.com/privkey.pem
```

## 📝 Étape 2 : Appliquer la configuration Nginx avec SSL

```bash
# 1. Faire un backup de l'ancienne config
sudo cp /etc/nginx/sites-available/anireserve.com /etc/nginx/sites-available/anireserve.com.backup

# 2. Copier la nouvelle configuration
cd /root/anireserve
sudo cp nginx-ssl-final.conf /etc/nginx/sites-available/anireserve.com

# 3. Tester la configuration
sudo nginx -t
```

Vous devriez voir :
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Si c'est OK :
```bash
# 4. Recharger Nginx
sudo systemctl reload nginx

# 5. Vérifier le statut
sudo systemctl status nginx
```

## ✅ Étape 3 : Vérifier que SSL fonctionne

### Test 1 : Vérifier depuis le VPS
```bash
curl -I https://anireserve.com
```

Vous devriez voir un code 200 et les headers de sécurité.

### Test 2 : Vérifier la redirection HTTP → HTTPS
```bash
curl -I http://anireserve.com
```

Vous devriez voir un code 301 avec `Location: https://anireserve.com/`.

### Test 3 : Ouvrir dans le navigateur
1. Allez sur https://anireserve.com
2. Vérifiez que le cadenas 🔒 apparaît dans la barre d'adresse
3. Cliquez sur le cadenas pour voir les détails du certificat

### Test 4 : Tester avec SSL Labs (optionnel)
Allez sur https://www.ssllabs.com/ssltest/ et testez votre domaine. Vous devriez obtenir un score A ou A+.

## 🔄 Étape 4 : Configurer le renouvellement automatique

Certbot configure automatiquement le renouvellement, mais vérifions :

```bash
# 1. Tester le renouvellement
sudo certbot renew --dry-run
```

Si le test réussit, le renouvellement automatique est configuré. Les certificats seront automatiquement renouvelés 30 jours avant leur expiration.

### Vérifier le timer systemd
```bash
# Vérifier que le timer est actif
sudo systemctl status certbot.timer

# Voir les prochaines exécutions
sudo systemctl list-timers | grep certbot
```

## 🚨 En cas de problème

### Problème 1 : Certbot échoue avec "unauthorized"
**Cause** : Le DNS ne pointe pas vers le bon serveur.

**Solution** :
```bash
# Vérifier le DNS
dig anireserve.com +short
# Doit retourner : 72.61.103.149

# Vérifier que Nginx répond
curl http://anireserve.com/.well-known/acme-challenge/test.txt
```

### Problème 2 : Nginx ne démarre pas après la configuration SSL
**Cause** : Les certificats n'existent pas ou le chemin est incorrect.

**Solution** :
```bash
# Vérifier que les certificats existent
sudo ls -la /etc/letsencrypt/live/anireserve.com/

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/error.log

# Restaurer l'ancienne config
sudo cp /etc/nginx/sites-available/anireserve.com.backup /etc/nginx/sites-available/anireserve.com
sudo nginx -t
sudo systemctl reload nginx
```

### Problème 3 : Redirection infinie HTTP ↔ HTTPS
**Cause** : Mauvaise configuration des headers `X-Forwarded-Proto`.

**Solution** : Vérifiez que la configuration Nginx contient bien :
```nginx
proxy_set_header X-Forwarded-Proto $scheme;
```

### Problème 4 : Le site est lent après SSL
**Cause** : HTTP/2 non activé ou session SSL mal configurée.

**Solution** : Vérifiez que la ligne suivante est présente :
```nginx
listen 443 ssl http2;
```

## 📊 Vérifier les performances SSL

### Test de performance
```bash
# Tester la connexion SSL
openssl s_client -connect anireserve.com:443 -servername anireserve.com < /dev/null
```

### Headers de sécurité
```bash
curl -I https://anireserve.com | grep -i "strict-transport\|x-frame\|x-content"
```

Vous devriez voir :
```
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
```

## 🎯 Checklist finale

Une fois SSL configuré, vérifiez :

- [ ] https://anireserve.com fonctionne avec le cadenas 🔒
- [ ] http://anireserve.com redirige vers https://
- [ ] https://www.anireserve.com fonctionne
- [ ] Les headers de sécurité sont présents
- [ ] Le site se charge rapidement (< 2s)
- [ ] Aucune erreur dans les logs Nginx : `sudo tail -f /var/log/nginx/error.log`
- [ ] Aucune erreur dans PM2 : `pm2 logs anireserve --lines 20`
- [ ] Le renouvellement automatique fonctionne : `sudo certbot renew --dry-run`

## 🎉 Félicitations !

Si tous les checks passent, votre site **AniReserve** est maintenant :
- ✅ En ligne et accessible
- ✅ Sécurisé avec SSL/TLS
- ✅ Optimisé pour les performances
- ✅ Protégé avec des headers de sécurité
- ✅ Configuré pour le renouvellement automatique des certificats

Vous pouvez maintenant :
1. Tester toutes les fonctionnalités (voir `GUIDE_TESTS.md`)
2. Surveiller les logs régulièrement
3. Partager le site avec vos premiers utilisateurs !

## 📝 Maintenance régulière

### Hebdomadaire
- Vérifier les logs pour erreurs : `pm2 logs anireserve --lines 100`
- Vérifier l'espace disque : `df -h`

### Mensuel
- Vérifier les mises à jour de sécurité : `sudo apt update && sudo apt upgrade`
- Vérifier que les certificats se renouvellent : `sudo certbot certificates`
- Vérifier les performances avec Lighthouse

### Au besoin
- Déployer les nouvelles versions : `cd /root/anireserve && ./deploy.sh`
- Sauvegarder la base de données
- Monitorer le trafic et les performances


