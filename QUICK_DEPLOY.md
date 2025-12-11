# 🚀 DÉPLOIEMENT RAPIDE - COMMANDES À EXÉCUTER

## 📝 ÉTAPE PAR ÉTAPE

### 1. Lance le script de déploiement

**Copie-colle dans ton terminal :**

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
chmod +x deploy-vps.sh
./deploy-vps.sh
```

**Ce qui va se passer :**
- Connexion à root@72.61.103.149
- Installation Node.js, PM2, Nginx
- Clone du code depuis GitHub
- Build production
- App démarrée

**Temps:** ~5-10 minutes ⏱️

---

### 2. Configure les variables d'environnement

**Après le déploiement, exécute :**

```bash
ssh root@72.61.103.149
cd /var/www/anireserve
nano .env
```

**Ajoute ces lignes :**

```bash
# Database Supabase
DATABASE_URL="ta_connection_string_supabase"

# App
NEXT_PUBLIC_BASE_URL="http://72.61.103.149"
NODE_ENV="production"

# Email Resend
RESEND_API_KEY="ta_cle_resend"

# Optional
STRIPE_SECRET_KEY="ta_cle_stripe"
```

**Sauvegarde :** `Ctrl+X` → `Y` → `Enter`

---

### 3. Redémarre l'application

```bash
pm2 restart anireserve
```

---

### 4. Vérifie que ça marche

**Ouvre dans ton navigateur :**
```
http://72.61.103.149
```

Tu devrais voir ton app AniReserve ! 🎉

---

## 🔍 VÉRIFIER LES LOGS

**Si problème, regarde les logs :**

```bash
ssh root@72.61.103.149
pm2 logs anireserve
```

---

## ✅ CHECKLIST

- [ ] Script deploy-vps.sh lancé
- [ ] .env configuré sur serveur
- [ ] pm2 restart anireserve exécuté
- [ ] App accessible sur http://72.61.103.149
- [ ] Pas d'erreurs dans `pm2 logs`

---

**Problème ?** Copie-colle l'erreur et je t'aide !
