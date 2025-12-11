# 🚀 Guide Déploiement VPS - root@72.61.103.149

## ⚠️ AVANT DE DÉPLOYER

### 1. Modifie l'URL GitHub dans le script

Ouvre `deploy-vps.sh` et remplace:
```bash
REPO_URL="https://github.com/TON-USERNAME/AniReserve.git"
```

Par ton vrai URL GitHub (trouve-le sur GitHub → Code → HTTPS)

---

## 🚀 DÉPLOIEMENT AUTOMATIQUE

### Étape 1: Lance le script

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
./deploy-vps.sh
```

Le script va automatiquement:
- ✅ Se connecter au VPS
- ✅ Installer Node.js, PM2, Nginx
- ✅ Cloner ton repo GitHub
- ✅ Installer dépendances
- ✅ Build Next.js
- ✅ Configurer PM2 & Nginx
- ✅ Démarrer l'app

**Temps:** ~5-10 minutes

---

## ⚙️ CONFIGURATION .ENV (Important!)

Une fois déployé, connecte-toi au serveur:

```bash
ssh root@72.61.103.149
cd /var/www/anireserve
nano .env
```

Ajoute ces variables:
```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/anireserve"

# App
NEXT_PUBLIC_BASE_URL="http://72.61.103.149"
NODE_ENV="production"

# Email
RESEND_API_KEY="re_YOUR_KEY"

# Optional
STRIPE_SECRET_KEY="sk_..."
```

**Sauvegarde:** Ctrl+X → Y → Enter

Puis redémarre:
```bash
pm2 restart anireserve
```

---

## 🌐 ACCÈS À TON APP

**URL temporaire:** http://72.61.103.149

---

## 🔒 SSL / HTTPS (Recommandé)

### Prérequis: Avoir un domaine

1. **Configure DNS:**
   - Ajoute record A: `@` → `72.61.103.149`
   - Ajoute record A: `www` → `72.61.103.149`

2. **Installe Certbot:**
```bash
ssh root@72.61.103.149
apt install -y certbot python3-certbot-nginx
certbot --nginx -d tondomaine.com -d www.tondomaine.com
```

3. **Renouvellement auto:**
```bash
certbot renew --dry-run
```

---

## 📊 COMMANDES UTILES

### Gérer l'app (PM2)
```bash
ssh root@72.61.103.149

pm2 status              # Voir status
pm2 logs anireserve     # Voir logs en temps réel
pm2 restart anireserve  # Redémarrer
pm2 stop anireserve     # Arrêter
pm2 delete anireserve   # Supprimer
```

### Mise à jour du code
```bash
ssh root@72.61.103.149
cd /var/www/anireserve
git pull origin main
cd apps/web
npm run build
pm2 restart anireserve
```

### Voir logs Nginx
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🐛 TROUBLESHOOTING

### App ne démarre pas
```bash
pm2 logs anireserve  # Voir l'erreur
```

Causes communes:
- .env manquant → Configure .env
- Port déjà utilisé → Change PORT dans ecosystem.config.js
- Build échoué → Vérifie les logs

### Nginx erreur 502
```bash
# Vérifie que PM2 tourne
pm2 status

# Redémarre Nginx
systemctl restart nginx
```

### Base de données
Si tu utilises PostgreSQL local:
```bash
# Crée la DB
sudo -u postgres psql
CREATE DATABASE anireserve;
CREATE USER anireserve_user WITH PASSWORD 'ton_password';
GRANT ALL PRIVILEGES ON DATABASE anireserve TO anireserve_user;
\q
```

---

## 🔄 MISES À JOUR FUTURES

**Script rapide de redéploiement:**
```bash
# Sur le serveur
cd /var/www/anireserve
git pull
npm install
cd apps/web && npm run build
pm2 restart anireserve
```

---

## 📱 POUR L'APP MOBILE

Une fois le backend déployé, mets à jour `capacitor.config.ts`:

```typescript
server: {
  url: 'http://72.61.103.149',  // Ou ton domaine HTTPS
  cleartext: false,  // true si HTTP, false si HTTPS
}
```

Puis rebuild l'app mobile:
```bash
npx cap sync
npx cap open ios
```

---

## ✅ CHECKLIST POST-DÉPLOIEMENT

- [ ] Script deploy-vps.sh exécuté
- [ ] .env configuré sur serveur
- [ ] App accessible sur http://72.61.103.149
- [ ] PM2 status = "online"
- [ ] Logs PM2 sans erreurs
- [ ] (Optionnel) SSL configuré
- [ ] (Optionnel) Domaine configuré
- [ ] Capacitor config mis à jour
- [ ] App mobile testée

---

**Besoin d'aide ?** Copie-colle les erreurs et je t'aide !
