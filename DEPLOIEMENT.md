# 🚀 Guide de Déploiement - AniReserve

Ce guide explique comment déployer AniReserve sur ton nom de domaine.

## 📋 Prérequis

1. Un nom de domaine (ex: `anireserve.com`)
2. Un compte Vercel (recommandé) ou un autre hébergeur
3. Les variables d'environnement configurées

## 🔧 Option 1 : Déploiement sur Vercel (Recommandé)

### Étape 1 : Préparer le projet

1. Assure-toi que tout est commité sur GitHub :
```bash
git add .
git commit -m "Préparation déploiement"
git push origin main
```

### Étape 2 : Créer un projet Vercel

1. Va sur [vercel.com](https://vercel.com)
2. Connecte-toi avec GitHub
3. Clique sur "Add New Project"
4. Importe ton repository `AniReserve`
5. Vercel détectera automatiquement Next.js

### Étape 3 : Configurer les variables d'environnement

Dans les paramètres du projet Vercel, ajoute toutes les variables d'environnement :

```env
# Database
DATABASE_URL=postgresql://...

# Supabase (si utilisé)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Resend (emails)
RESEND_API_KEY=re_...

# Base URL (important pour les emails et liens)
NEXT_PUBLIC_BASE_URL=https://ton-domaine.com

# Admin (optionnel)
ADMIN_EMAIL=admin@ton-domaine.com
ADMIN_PASSWORD=...
```

### Étape 4 : Configurer le nom de domaine

1. Dans Vercel, va dans "Settings" > "Domains"
2. Ajoute ton nom de domaine
3. Suis les instructions pour configurer les DNS :
   - Ajoute un enregistrement `A` pointant vers l'IP de Vercel
   - Ou un enregistrement `CNAME` pointant vers `cname.vercel-dns.com`

### Étape 5 : Déployer

1. Vercel déploiera automatiquement à chaque push sur `main`
2. Tu peux aussi déclencher un déploiement manuel depuis le dashboard

## 🔧 Option 2 : Déploiement sur un VPS

### Étape 1 : Préparer le serveur

```bash
# Installer Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PM2 pour gérer le processus
sudo npm install -g pm2

# Installer PostgreSQL (si pas déjà fait)
sudo apt-get install postgresql
```

### Étape 2 : Cloner le projet

```bash
cd /var/www
git clone https://github.com/ton-username/AniReserve.git
cd AniReserve
npm install
```

### Étape 3 : Configurer l'environnement

```bash
cp .env.example .env
nano .env  # Éditer avec tes valeurs
```

### Étape 4 : Build et migration

```bash
npm run build
npx prisma migrate deploy
npx prisma generate
```

### Étape 5 : Lancer avec PM2

```bash
pm2 start npm --name "anireserve" -- start
pm2 save
pm2 startup  # Pour démarrer au boot
```

### Étape 6 : Configurer Nginx

```nginx
server {
    listen 80;
    server_name ton-domaine.com www.ton-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Étape 7 : SSL avec Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d ton-domaine.com -d www.ton-domaine.com
```

## 🔐 Sécurité

### Variables d'environnement importantes

- `DATABASE_URL` : Ne JAMAIS exposer publiquement
- `RESEND_API_KEY` : Garde-le secret
- `SUPABASE_SERVICE_ROLE_KEY` : Accès complet à Supabase

### Recommandations

1. Active le HTTPS (SSL/TLS)
2. Configure un firewall (UFW sur Ubuntu)
3. Fais des backups réguliers de la base de données
4. Utilise des mots de passe forts pour l'admin

## 📊 Monitoring

### Vercel Analytics

Vercel propose des analytics intégrés. Active-les dans les paramètres du projet.

### Logs

```bash
# Vercel
vercel logs

# PM2
pm2 logs anireserve
```

## 🔄 Mises à jour

### Avec Vercel

Les mises à jour se font automatiquement à chaque push sur `main`.

### Avec VPS

```bash
cd /var/www/AniReserve
git pull
npm install
npm run build
npx prisma migrate deploy
pm2 restart anireserve
```

## 🐛 Dépannage

### Erreur de connexion à la base de données

- Vérifie que `DATABASE_URL` est correct
- Vérifie que la base de données est accessible depuis le serveur
- Vérifie les règles de firewall

### Erreur 500

- Vérifie les logs : `pm2 logs` ou dashboard Vercel
- Vérifie que toutes les variables d'environnement sont définies
- Vérifie que les migrations Prisma sont appliquées

### Emails ne partent pas

- Vérifie que `RESEND_API_KEY` est correct
- Vérifie les logs Resend
- En développement, les emails sont simulés si la clé n'est pas définie

## 📝 Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données accessible
- [ ] Migrations Prisma appliquées
- [ ] Nom de domaine configuré
- [ ] SSL/HTTPS activé
- [ ] Tests de fonctionnement (création compte, réservation, etc.)
- [ ] Backup de la base de données configuré
- [ ] Monitoring activé

## 🆘 Support

En cas de problème, vérifie :
1. Les logs du serveur
2. Les logs de la base de données
3. Les variables d'environnement
4. La documentation Next.js et Vercel











