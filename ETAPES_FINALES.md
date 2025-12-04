# Étapes finales - Configuration VPS maintenant que le DNS est correct

## ✅ Étape 1 : Vérifier que le DNS est bien propagé

Sur le VPS, exécutez :

```bash
# Vérifier IPv4
dig anireserve.com +short
# Doit retourner : 72.61.103.149

# Vérifier www
dig www.anireserve.com +short
# Doit retourner : 72.61.103.149

# Tester l'accès HTTP
curl -I http://anireserve.com
# Doit retourner un code 200 ou 301
```

Si ça fonctionne, passez à l'étape 2.

---

## 🔧 Étape 2 : Vérifier et configurer Nginx

### 2.1 Vérifier que Nginx est installé

```bash
nginx -v
```

Si Nginx n'est pas installé :
```bash
sudo apt update
sudo apt install nginx -y
```

### 2.2 Vérifier que la configuration existe

```bash
# Vérifier le fichier
ls -la /etc/nginx/sites-available/anireserve.com

# Si le fichier n'existe pas, créez-le
sudo nano /etc/nginx/sites-available/anireserve.com
```

Collez cette configuration :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name anireserve.com www.anireserve.com;

    # Permettre l'accès à .well-known pour Certbot
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        try_files $uri =404;
    }

    # Toutes les autres requêtes vers Next.js
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Sauvegardez (Ctrl+O, Enter, Ctrl+X).

### 2.3 Activer le site

```bash
# Créer le symlink
sudo ln -s /etc/nginx/sites-available/anireserve.com /etc/nginx/sites-enabled/anireserve.com

# Supprimer le site par défaut (optionnel)
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t
```

Vous devriez voir :
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 2.4 Démarrer/Recharger Nginx

```bash
# Démarrer Nginx
sudo systemctl start nginx

# Activer au démarrage
sudo systemctl enable nginx

# Recharger la configuration
sudo systemctl reload nginx

# Vérifier le statut
sudo systemctl status nginx
```

---

## 🚀 Étape 3 : Vérifier que Next.js tourne

```bash
# Vérifier PM2
pm2 status

# Si anireserve n'est pas dans la liste
cd /root/anireserve/apps/web
pm2 start ecosystem.config.js
pm2 save

# Vérifier les logs
pm2 logs anireserve --lines 10
```

Vous devriez voir :
```
✓ Ready in 400-600ms
```

### 3.1 Tester que Next.js répond

```bash
curl http://localhost:3000
```

Vous devriez voir du HTML (la page d'accueil).

---

## ✅ Étape 4 : Tester que le site est accessible

```bash
# Test depuis le VPS
curl -I http://anireserve.com

# Test avec le bon Host header
curl -H "Host: anireserve.com" http://localhost
```

Les deux doivent retourner un code HTTP 200.

### 4.1 Tester depuis votre navigateur

Ouvrez votre navigateur et allez sur :
- http://anireserve.com

Le site devrait s'afficher ! 🎉

---

## 🔒 Étape 5 : Configurer SSL avec Certbot

Maintenant que le DNS est correct, SSL devrait fonctionner.

### 5.1 Installer Certbot (si pas déjà fait)

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### 5.2 Préparer le dossier webroot

```bash
sudo mkdir -p /var/www/html/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

### 5.3 Obtenir les certificats SSL

```bash
sudo certbot certonly --webroot -w /var/www/html -d anireserve.com -d www.anireserve.com
```

**Questions Certbot** :
1. Email : Entrez votre email
2. Accepter les termes : `Y`
3. Partager l'email avec EFF : `N` (optionnel)

**Résultat attendu** :
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/anireserve.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/anireserve.com/privkey.pem
```

### 5.4 Vérifier les certificats

```bash
sudo ls -la /etc/letsencrypt/live/anireserve.com/
```

Vous devriez voir :
- `fullchain.pem`
- `privkey.pem`
- `chain.pem`

---

## 🌐 Étape 6 : Configurer Nginx avec SSL

### 6.1 Backup de l'ancienne config

```bash
sudo cp /etc/nginx/sites-available/anireserve.com /etc/nginx/sites-available/anireserve.com.backup
```

### 6.2 Appliquer la configuration SSL

```bash
cd /root/anireserve
git pull origin main
sudo cp nginx-ssl-final.conf /etc/nginx/sites-available/anireserve.com
```

### 6.3 Tester et recharger

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ Étape 7 : Vérifier que HTTPS fonctionne

```bash
# Tester HTTPS
curl -I https://anireserve.com

# Tester la redirection HTTP → HTTPS
curl -I http://anireserve.com
# Doit retourner : 301 Moved Permanently avec Location: https://anireserve.com/
```

### 7.1 Tester dans le navigateur

1. Allez sur **https://anireserve.com**
2. Vérifiez le cadenas 🔒 dans la barre d'adresse
3. Le site devrait se charger en HTTPS

---

## 🎯 Étape 8 : Déployer les derniers correctifs

```bash
cd /root/anireserve
git pull origin main
cd apps/web
npm install
npm run build
pm2 restart anireserve
```

Cela appliquera :
- ✅ Le fix du logo (plus d'erreurs 404)
- ✅ Les optimisations de performance
- ✅ Les nouveaux composants UI

---

## 📊 Checklist finale

Vérifiez que tout fonctionne :

- [ ] DNS pointe vers 72.61.103.149
- [ ] Nginx est installé et actif
- [ ] Configuration Nginx existe et est activée
- [ ] Next.js tourne sur le port 3000
- [ ] Le site est accessible en HTTP : http://anireserve.com
- [ ] Certbot a créé les certificats SSL
- [ ] Nginx est configuré avec SSL
- [ ] Le site est accessible en HTTPS : https://anireserve.com
- [ ] HTTP redirige vers HTTPS
- [ ] Le cadenas 🔒 apparaît dans le navigateur
- [ ] Les correctifs sont déployés (logo, optimisations)

---

## 🚨 En cas de problème

### Le site ne charge pas en HTTP

```bash
# Vérifier Nginx
sudo systemctl status nginx
sudo nginx -t

# Vérifier Next.js
pm2 status
pm2 logs anireserve

# Vérifier les ports
sudo netstat -tlnp | grep -E "(nginx|3000)"
```

### Certbot échoue toujours

```bash
# Vérifier le DNS
dig anireserve.com +short

# Vérifier que le fichier de challenge est accessible
echo "test" | sudo tee /var/www/html/.well-known/acme-challenge/test.txt
curl http://anireserve.com/.well-known/acme-challenge/test.txt
# Doit retourner : test
```

### HTTPS ne fonctionne pas

```bash
# Vérifier les certificats
sudo ls -la /etc/letsencrypt/live/anireserve.com/

# Vérifier la configuration Nginx
sudo nginx -t

# Voir les logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🎉 Félicitations !

Si toutes les étapes sont complétées, votre site **AniReserve** est maintenant :
- ✅ En ligne : https://anireserve.com
- ✅ Sécurisé : SSL/TLS configuré
- ✅ Optimisé : Performance et UX améliorées
- ✅ Prêt pour la production !

---

## 📝 Commandes de référence rapide

```bash
# Redémarrer tout
sudo systemctl restart nginx
pm2 restart anireserve

# Voir les logs
pm2 logs anireserve
sudo tail -f /var/log/nginx/error.log

# Vérifier le statut
pm2 status
sudo systemctl status nginx

# Tester le site
curl -I https://anireserve.com
```




