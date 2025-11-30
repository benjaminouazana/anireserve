# 🖥️ Guide de Déploiement sur VPS Hostinger

## 📋 Prérequis

- [ ] VPS Hostinger acheté
- [ ] Accès SSH au VPS
- [ ] Domaine anireserve.com configuré (chez Hostinger)
- [ ] Base de données Supabase créée (ou PostgreSQL sur le VPS)

---

## 🚀 Étape 1 : Préparer le VPS

### 1.1 Se connecter en SSH

```bash
ssh root@votre-ip-vps
# ou
ssh root@anireserve.com
```

### 1.2 Mettre à jour le système

```bash
apt update && apt upgrade -y
```

### 1.3 Installer les dépendances

```bash
# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2 (gestionnaire de processus)
npm install -g pm2

# Git
apt install -y git

# Nginx (serveur web)
apt install -y nginx

# Certbot (pour SSL)
apt install -y certbot python3-certbot-nginx
```

### 1.4 Vérifier les installations

```bash
node --version  # Doit afficher v20.x
npm --version
pm2 --version
nginx -v
```

---

## 🗄️ Étape 2 : Configurer la Base de Données

### Option A : Utiliser Supabase (Recommandé - Plus simple)

Vous avez déjà Supabase configuré, continuez avec ça.

**DATABASE_URL** : `postgresql://postgres:oe5OGBYSfDeU5aiX@db.atpzrfjxnzteqyrlrhgt.supabase.co:5432/postgres`

### Option B : Installer PostgreSQL sur le VPS (Optionnel)

Si vous préférez avoir la base de données sur le VPS :

```bash
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Créer un utilisateur et une base de données
sudo -u postgres psql
```

Dans PostgreSQL :
```sql
CREATE USER anireserve WITH PASSWORD 'votre_mot_de_passe';
CREATE DATABASE anireserve OWNER anireserve;
\q
```

---

## 📥 Étape 3 : Cloner le Projet

### 3.1 Créer un utilisateur pour l'application

```bash
adduser anireserve
usermod -aG sudo anireserve
su - anireserve
```

### 3.2 Cloner le repository

```bash
cd /home/anireserve
git clone https://github.com/benjaminouazana/anireserve.git
cd anireserve
```

### 3.3 Installer les dépendances

```bash
npm install
```

---

## 🔧 Étape 4 : Configurer l'Application

### 4.1 Créer le fichier .env

```bash
cd apps/web
nano .env.production
```

Ajoutez :

```env
# Base de données
DATABASE_URL=postgresql://postgres:oe5OGBYSfDeU5aiX@db.atpzrfjxnzteqyrlrhgt.supabase.co:5432/postgres

# Next.js
NEXT_PUBLIC_APP_URL=https://anireserve.com
NODE_ENV=production

# Email (si configuré)
RESEND_API_KEY=votre_clé_resend

# Supabase (si utilisé pour images)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service
```

Sauvegardez : `Ctrl+X`, puis `Y`, puis `Enter`

### 4.2 Générer Prisma Client

```bash
cd /home/anireserve/anireserve/apps/web
npx prisma generate
```

### 4.3 Appliquer les migrations

```bash
npx prisma migrate deploy
```

### 4.4 Build de l'application

```bash
npm run build
```

---

## 🚀 Étape 5 : Lancer l'Application avec PM2

### 5.1 Créer un script de démarrage

```bash
cd /home/anireserve/anireserve/apps/web
nano ecosystem.config.js
```

Ajoutez :

```javascript
module.exports = {
  apps: [{
    name: 'anireserve',
    script: 'npm',
    args: 'start',
    cwd: '/home/anireserve/anireserve/apps/web',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

Sauvegardez.

### 5.2 Démarrer avec PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5.3 Vérifier que ça fonctionne

```bash
pm2 status
pm2 logs anireserve
```

L'application devrait être accessible sur `http://votre-ip:3000`

---

## 🌐 Étape 6 : Configurer Nginx

### 6.1 Créer la configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/anireserve
```

Ajoutez :

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
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Sauvegardez.

### 6.2 Activer le site

```bash
sudo ln -s /etc/nginx/sites-available/anireserve /etc/nginx/sites-enabled/
sudo nginx -t  # Vérifier la configuration
sudo systemctl restart nginx
```

---

## 🔒 Étape 7 : Configurer SSL (HTTPS)

### 7.1 Obtenir un certificat SSL

```bash
sudo certbot --nginx -d anireserve.com -d www.anireserve.com
```

Suivez les instructions :
- Entrez votre email
- Acceptez les conditions
- Choisissez de rediriger HTTP vers HTTPS

### 7.2 Vérifier le renouvellement automatique

```bash
sudo certbot renew --dry-run
```

---

## 🔄 Étape 8 : Mise à Jour de l'Application

### 8.1 Script de mise à jour

Créez un script pour faciliter les mises à jour :

```bash
nano /home/anireserve/update.sh
```

Ajoutez :

```bash
#!/bin/bash
cd /home/anireserve/anireserve
git pull origin main
cd apps/web
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart anireserve
echo "✅ Mise à jour terminée !"
```

Rendez-le exécutable :

```bash
chmod +x /home/anireserve/update.sh
```

### 8.2 Utilisation

```bash
/home/anireserve/update.sh
```

---

## 📊 Étape 9 : Monitoring

### 9.1 Vérifier les logs

```bash
pm2 logs anireserve
pm2 monit
```

### 9.2 Vérifier Nginx

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

---

## ✅ Checklist Finale

- [ ] VPS configuré et mis à jour
- [ ] Node.js, PM2, Nginx installés
- [ ] Projet cloné depuis GitHub
- [ ] Variables d'environnement configurées
- [ ] Base de données connectée
- [ ] Application buildée et lancée avec PM2
- [ ] Nginx configuré et actif
- [ ] SSL/HTTPS configuré
- [ ] Site accessible sur https://anireserve.com
- [ ] Emails fonctionnent toujours (MX conservés)

---

## 🆘 Dépannage

### L'application ne démarre pas

```bash
pm2 logs anireserve
cd /home/anireserve/anireserve/apps/web
npm run build  # Vérifier les erreurs de build
```

### Nginx ne fonctionne pas

```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Problème de permissions

```bash
sudo chown -R anireserve:anireserve /home/anireserve/anireserve
```

### Redémarrer tout

```bash
pm2 restart anireserve
sudo systemctl restart nginx
```

---

## 📝 Notes Importantes

- **Sécurité** : Changez le mot de passe root après la première connexion
- **Firewall** : Configurez un firewall (UFW) si nécessaire
- **Backups** : Configurez des backups réguliers de la base de données
- **Monitoring** : Surveillez les logs régulièrement

---

## 🎉 Félicitations !

Votre site est maintenant en ligne sur **https://anireserve.com** avec :
- ✅ Application Next.js sur VPS Hostinger
- ✅ Nginx comme reverse proxy
- ✅ SSL/HTTPS automatique
- ✅ PM2 pour la gestion des processus
- ✅ Emails chez Hostinger (inchangés)

---

**Besoin d'aide ?** Contactez le support Hostinger ou consultez la documentation.

---

**Dernière mise à jour** : $(date)

