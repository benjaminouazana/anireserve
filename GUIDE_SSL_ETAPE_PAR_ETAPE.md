# Guide : Configuration SSL/HTTPS - Étape par Étape

## 🎯 Objectif

Configurer HTTPS pour `anireserve.com` avec un certificat SSL gratuit via Let's Encrypt (Certbot).

## ✅ Prérequis

- ✅ DNS pointant vers `72.61.103.149`
- ✅ Nginx installé et fonctionnel
- ✅ Site accessible en HTTP
- ✅ Port 80 ouvert

## 📋 Étapes de Configuration

### Étape 1 : Se connecter au VPS

```bash
ssh root@72.61.103.149
```

### Étape 2 : Installer Certbot

```bash
# Mettre à jour les paquets
sudo apt update

# Installer Certbot et le plugin Nginx
sudo apt install certbot python3-certbot-nginx -y
```

### Étape 3 : Vérifier la configuration Nginx actuelle

```bash
# Voir la configuration actuelle
sudo cat /etc/nginx/sites-available/anireserve.com

# Vérifier que Nginx fonctionne
sudo nginx -t
```

### Étape 4 : Configuration Nginx temporaire (HTTP uniquement)

Assurez-vous que votre configuration Nginx actuelle permet l'accès à `.well-known` pour la validation :

```bash
sudo nano /etc/nginx/sites-available/anireserve.com
```

La configuration doit avoir cette section :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name anireserve.com www.anireserve.com;
    
    # IMPORTANT : Permettre l'accès à .well-known pour Certbot
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        try_files $uri =404;
    }
    
    # Proxy vers Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Sauvegardez (Ctrl+O, Entrée, Ctrl+X) et rechargez Nginx :

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Étape 5 : Créer le dossier pour la validation

```bash
sudo mkdir -p /var/www/html/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/html
```

### Étape 6 : Obtenir le certificat SSL

```bash
# Obtenir le certificat pour anireserve.com et www.anireserve.com
sudo certbot certonly --webroot -w /var/www/html -d anireserve.com -d www.anireserve.com
```

**Réponses aux questions** :
- Email : Entrez votre email (pour les notifications de renouvellement)
- Terms of Service : Tapez `A` pour accepter
- Share email : Tapez `N` (non)

### Étape 7 : Vérifier que les certificats sont créés

```bash
# Vérifier les certificats
sudo ls -la /etc/letsencrypt/live/anireserve.com/
```

Vous devriez voir :
- `fullchain.pem` (certificat complet)
- `privkey.pem` (clé privée)
- `chain.pem` (chaîne intermédiaire)

### Étape 8 : Appliquer la configuration SSL complète

```bash
# Copier la configuration SSL complète
sudo nano /etc/nginx/sites-available/anireserve.com
```

Remplacez tout le contenu par la configuration complète (voir fichier `nginx-ssl-final.conf`).

Ou utilisez cette commande pour appliquer automatiquement :

```bash
sudo certbot --nginx -d anireserve.com -d www.anireserve.com
```

Cette commande va :
- Configurer automatiquement Nginx avec SSL
- Rediriger HTTP vers HTTPS
- Configurer les certificats

**Réponses** :
- Email : Votre email
- Terms : `A` (accepter)
- Share email : `N` (non)
- Redirect HTTP to HTTPS : `2` (oui, rediriger)

### Étape 9 : Vérifier la configuration

```bash
# Tester la configuration Nginx
sudo nginx -t

# Si OK, recharger Nginx
sudo systemctl reload nginx

# Vérifier le statut
sudo systemctl status nginx
```

### Étape 10 : Tester HTTPS

```bash
# Depuis votre machine locale
curl -I https://anireserve.com

# Devrait afficher :
# HTTP/2 200
# Server: nginx/1.24.0
```

### Étape 11 : Configurer le renouvellement automatique

Certbot configure automatiquement le renouvellement, mais vérifions :

```bash
# Vérifier le timer de renouvellement
sudo systemctl status certbot.timer

# Tester le renouvellement (dry-run)
sudo certbot renew --dry-run
```

## 🔧 Configuration Nginx SSL Complète

Si vous préférez configurer manuellement, voici la configuration complète :

```nginx
# Redirection HTTP vers HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name anireserve.com www.anireserve.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        try_files $uri =404;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Configuration HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name anireserve.com www.anireserve.com;

    # Certificats SSL
    ssl_certificate /etc/letsencrypt/live/anireserve.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/anireserve.com/privkey.pem;
    
    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Headers de sécurité
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Proxy vers Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ⚠️ Problèmes Courants

### Erreur : "Failed to connect to server"

**Solution** : Vérifiez que le port 80 est ouvert :
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Erreur : "Could not bind to port 80"

**Solution** : Vérifiez qu'aucun autre service n'utilise le port 80 :
```bash
sudo lsof -i :80
sudo systemctl stop apache2  # Si Apache est installé
```

### Erreur : "Domain does not point to this server"

**Solution** : Vérifiez le DNS :
```bash
dig anireserve.com +short
# Doit retourner 72.61.103.149
```

### Certificat expiré

**Solution** : Renouveler manuellement :
```bash
sudo certbot renew
sudo systemctl reload nginx
```

## ✅ Vérification Finale

1. **HTTP redirige vers HTTPS** :
   ```bash
   curl -I http://anireserve.com
   # Devrait afficher : Location: https://anireserve.com/
   ```

2. **HTTPS fonctionne** :
   ```bash
   curl -I https://anireserve.com
   # Devrait afficher : HTTP/2 200
   ```

3. **Certificat valide** :
   Ouvrez https://anireserve.com dans votre navigateur
   - Le cadenas vert doit apparaître
   - Pas d'avertissement de sécurité

## 🎉 C'est terminé !

Votre site est maintenant accessible en HTTPS avec un certificat SSL valide et renouvelé automatiquement.

---

**Note** : Les certificats Let's Encrypt sont valides 90 jours et se renouvellent automatiquement tous les 60 jours.



