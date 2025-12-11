# 🔄 Comment Mettre à Jour le Code sur le VPS

## 📝 Commandes Simples

Une fois connecté en SSH au VPS, exécutez ces commandes :

```bash
# 1. Aller dans le dossier du projet
cd /root/anireserve

# 2. Récupérer les dernières modifications depuis GitHub
git pull origin main

# 3. Aller dans le dossier de l'application
cd apps/web

# 4. Installer les nouvelles dépendances (si nécessaire)
npm install

# 5. Générer Prisma Client (si le schéma a changé)
npx prisma generate

# 6. Appliquer les migrations (si la base de données a changé)
npx prisma migrate deploy

# 7. Rebuilder l'application
npm run build

# 8. Redémarrer l'application avec PM2
pm2 restart anireserve
```

---

## 🚀 Script Automatique (Optionnel)

Pour simplifier, créez un script :

```bash
nano /root/anireserve/update.sh
```

Collez ce contenu :

```bash
#!/bin/bash
cd /root/anireserve
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
chmod +x /root/anireserve/update.sh
```

Ensuite, pour mettre à jour, il suffit de :

```bash
/root/anireserve/update.sh
```

---

## 📋 Étapes Détaillées

### 1. Se connecter au VPS

Sur votre Mac :
```bash
ssh root@votre-ip-vps
```

### 2. Mettre à jour le code

```bash
cd /root/anireserve
git pull origin main
```

### 3. Mettre à jour les dépendances

```bash
cd apps/web
npm install
```

### 4. Rebuilder

```bash
npm run build
```

### 5. Redémarrer

```bash
pm2 restart anireserve
```

---

## ⚠️ Important

- **Toujours** faire `git pull` avant de rebuilder
- Si vous modifiez le schéma Prisma, faire `npx prisma generate` et `npx prisma migrate deploy`
- **Toujours** redémarrer avec `pm2 restart anireserve` après un build

---

## 🆘 En cas de problème

### Le build échoue

```bash
# Vérifier les logs
pm2 logs anireserve

# Vérifier les erreurs de build
cd /root/anireserve/apps/web
npm run build
```

### L'application ne démarre pas

```bash
# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs anireserve

# Redémarrer
pm2 restart anireserve
```

---

**Dernière mise à jour** : $(date)








