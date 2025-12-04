# 🚀 Déploiement Étape par Étape - AniReserve

## ✅ ÉTAPE 1 : Installer PM2

Sur votre VPS, exécutez :

```bash
npm install -g pm2
```

**Attendez que la commande se termine, puis dites-moi "fait" ou "ok".**

---

## ✅ ÉTAPE 2 : Aller dans le dossier de l'application

```bash
cd /root/anireserve/apps/web
```

**Dites-moi quand c'est fait.**

---

## ✅ ÉTAPE 3 : Vérifier que le build existe

```bash
ls -la .next
```

**Vous devriez voir un dossier `.next`. Dites-moi ce que vous voyez.**

---

## ✅ ÉTAPE 4 : Démarrer l'application avec PM2

```bash
pm2 start npm --name "anireserve" -- start
```

**Dites-moi le résultat (vous devriez voir un tableau avec "anireserve" en ligne).**

---

## ✅ ÉTAPE 5 : Vérifier que PM2 fonctionne

```bash
pm2 status
```

**Vous devriez voir "anireserve" avec le statut "online". Dites-moi ce que vous voyez.**

---

## ✅ ÉTAPE 6 : Voir les logs

```bash
pm2 logs anireserve --lines 20
```

**Vérifiez qu'il n'y a pas d'erreurs. Dites-moi ce que vous voyez.**

---

## ✅ ÉTAPE 7 : Sauvegarder la configuration PM2

```bash
pm2 save
```

**Dites-moi quand c'est fait.**

---

## ✅ ÉTAPE 8 : Configurer PM2 pour démarrer au boot

```bash
pm2 startup
```

**Cette commande va vous donner une commande à exécuter avec `sudo`. Copiez-collez cette commande et exécutez-la, puis dites-moi "fait".**

---

## 🌐 ÉTAPE 9 : Installer Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

**Attendez la fin de l'installation, puis dites-moi "fait".**

---

## 🌐 ÉTAPE 10 : Créer la configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/anireserve
```

**Dans l'éditeur nano, collez ce contenu :**

```nginx
server {
    listen 80;
    server_name anireserve.com www.anireserve.com;

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

**Pour sauvegarder dans nano :**
- Appuyez sur `Ctrl + O` puis `Enter`
- Appuyez sur `Ctrl + X` pour quitter

**Dites-moi quand c'est fait.**

---

## 🌐 ÉTAPE 11 : Activer la configuration Nginx

```bash
sudo ln -s /etc/nginx/sites-available/anireserve /etc/nginx/sites-enabled/
```

**Dites-moi quand c'est fait.**

---

## 🌐 ÉTAPE 12 : Supprimer la configuration par défaut (optionnel mais recommandé)

```bash
sudo rm /etc/nginx/sites-enabled/default
```

**Dites-moi quand c'est fait.**

---

## 🌐 ÉTAPE 13 : Tester la configuration Nginx

```bash
sudo nginx -t
```

**Vous devriez voir "syntax is ok" et "test is successful". Dites-moi ce que vous voyez.**

---

## 🌐 ÉTAPE 14 : Redémarrer Nginx

```bash
sudo systemctl restart nginx
```

**Dites-moi quand c'est fait.**

---

## 🌐 ÉTAPE 15 : Vérifier que Nginx fonctionne

```bash
sudo systemctl status nginx
```

**Vous devriez voir "active (running)". Dites-moi ce que vous voyez.**

---

## 🔒 ÉTAPE 16 : Installer Certbot pour SSL

```bash
sudo apt install certbot python3-certbot-nginx -y
```

**Attendez la fin de l'installation, puis dites-moi "fait".**

---

## 🔒 ÉTAPE 17 : Obtenir le certificat SSL

```bash
sudo certbot --nginx -d anireserve.com -d www.anireserve.com
```

**Certbot va vous poser quelques questions :**
- Email : entrez votre email
- Terms : tapez `Y` puis `Enter`
- Share email : tapez `Y` ou `N` selon votre préférence

**À la fin, vous devriez voir "Congratulations!". Dites-moi ce que vous voyez.**

---

## ✅ ÉTAPE 18 : Vérifier que tout fonctionne

1. **Vérifier PM2 :**
   ```bash
   pm2 status
   ```

2. **Vérifier Nginx :**
   ```bash
   sudo systemctl status nginx
   ```

3. **Tester le site :**
   - Ouvrez votre navigateur
   - Allez sur `https://anireserve.com`
   - Le site devrait s'afficher !

**Dites-moi si le site fonctionne !**

---

## 🎉 FÉLICITATIONS !

Votre site est maintenant en ligne ! 🚀





