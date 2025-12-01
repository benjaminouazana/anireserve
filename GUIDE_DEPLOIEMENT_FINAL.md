# 🚀 Guide de Déploiement Final - AniReserve

## ✅ Étape 1 : Build réussi ✓

Le build Next.js fonctionne maintenant ! Passons au déploiement.

---

## 📋 Étape 2 : Configuration PM2

PM2 va gérer votre application Next.js en production.

### Sur le VPS, exécutez :

```bash
# Installer PM2 globalement
npm install -g pm2

# Aller dans le dossier de l'application
cd /root/anireserve/apps/web

# Démarrer l'application avec PM2
pm2 start npm --name "anireserve" -- start

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
```

**Vérification :**
```bash
pm2 status
pm2 logs anireserve
```

---

## 🌐 Étape 3 : Configuration Nginx

Nginx va servir votre application et gérer le reverse proxy.

### Installer Nginx :

```bash
sudo apt update
sudo apt install nginx -y
```

### Créer la configuration Nginx :

```bash
sudo nano /etc/nginx/sites-available/anireserve
```

**Contenu du fichier :**

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

### Activer la configuration :

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/anireserve /etc/nginx/sites-enabled/

# Supprimer la configuration par défaut (optionnel)
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration Nginx
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

---

## 🔒 Étape 4 : Configuration SSL avec Certbot

Pour avoir HTTPS (obligatoire pour la production).

### Installer Certbot :

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Obtenir le certificat SSL :

```bash
sudo certbot --nginx -d anireserve.com -d www.anireserve.com
```

Certbot va :
- Générer les certificats SSL
- Modifier automatiquement la configuration Nginx
- Configurer le renouvellement automatique

**Vérification :**
```bash
sudo certbot renew --dry-run
```

---

## ⚙️ Étape 5 : Variables d'environnement

Assurez-vous que toutes les variables d'environnement sont configurées.

### Sur le VPS :

```bash
cd /root/anireserve/apps/web
nano .env
```

**Variables essentielles :**
```env
DATABASE_URL=postgresql://postgres:oe5OGBYSfDeU5aiX@db.atpzrfjxnzteqyrlrhgt.supabase.co:5432/postgres
NEXT_PUBLIC_BASE_URL=https://anireserve.com
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase
RESEND_API_KEY=votre_cle_resend
STRIPE_SECRET_KEY=votre_cle_stripe
STRIPE_WEBHOOK_SECRET=votre_webhook_secret
```

**Redémarrer PM2 après modification :**
```bash
pm2 restart anireserve
```

---

## 🔍 Étape 6 : Vérifications

### Vérifier que tout fonctionne :

1. **PM2 :**
   ```bash
   pm2 status
   pm2 logs anireserve --lines 50
   ```

2. **Nginx :**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t
   ```

3. **Application :**
   - Ouvrir `http://anireserve.com` (ou votre IP)
   - Vérifier que le site s'affiche
   - Tester quelques fonctionnalités

4. **Logs :**
   ```bash
   # Logs PM2
   pm2 logs anireserve
   
   # Logs Nginx
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/nginx/access.log
   ```

---

## 🔄 Étape 7 : Mise à jour du code (pour plus tard)

Quand vous voulez mettre à jour le code :

```bash
cd /root/anireserve
git pull origin main
cd apps/web
npm install
npm run build
pm2 restart anireserve
```

---

## 📊 Commandes utiles PM2

```bash
# Voir le statut
pm2 status

# Voir les logs
pm2 logs anireserve

# Redémarrer
pm2 restart anireserve

# Arrêter
pm2 stop anireserve

# Supprimer
pm2 delete anireserve

# Monitoring
pm2 monit
```

---

## 🐛 Dépannage

### L'application ne démarre pas :
```bash
pm2 logs anireserve --err
cd /root/anireserve/apps/web
npm run build  # Vérifier que le build fonctionne
```

### Nginx ne fonctionne pas :
```bash
sudo nginx -t  # Vérifier la syntaxe
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Port 3000 déjà utilisé :
```bash
# Trouver le processus
sudo lsof -i :3000

# Tuer le processus
sudo kill -9 <PID>
```

---

## ✅ Checklist finale

- [ ] Build Next.js réussi
- [ ] PM2 installé et configuré
- [ ] Application démarre avec PM2
- [ ] Nginx installé et configuré
- [ ] Configuration Nginx testée
- [ ] SSL configuré avec Certbot
- [ ] Variables d'environnement configurées
- [ ] Site accessible via le domaine
- [ ] HTTPS fonctionne
- [ ] Logs vérifiés

---

**Une fois tout configuré, votre site sera en ligne ! 🎉**

