# 🔄 Mise à Jour du Serveur - Guide Rapide

## 📋 Étapes pour Mettre à Jour le Serveur

### 1. Se Connecter au VPS

```bash
ssh root@72.61.103.149
```

### 2. Aller dans le Dossier du Projet

```bash
cd /root/anireserve
```

### 3. Récupérer les Derniers Changements depuis GitHub

```bash
git pull origin main
```

### 4. Aller dans le Dossier Web

```bash
cd apps/web
```

### 5. Installer les Nouvelles Dépendances (si nécessaire)

```bash
npm install
```

### 6. Rebuild l'Application Next.js

```bash
npm run build
```

### 7. Redémarrer l'Application avec PM2

```bash
pm2 restart anireserve
```

### 8. Vérifier que Tout Fonctionne

```bash
# Voir les logs
pm2 logs anireserve --lines 20

# Vérifier le statut
pm2 status

# Tester l'application
curl http://localhost:3000
```

---

## 🚀 Commande Rapide (Tout en Une)

```bash
ssh root@72.61.103.149 "cd /root/anireserve && git pull origin main && cd apps/web && npm install && npm run build && pm2 restart anireserve && pm2 logs anireserve --lines 10"
```

---

## ⚠️ En Cas de Problème

### Si le build échoue :

```bash
# Nettoyer le cache
cd /root/anireserve/apps/web
rm -rf .next
rm -rf node_modules

# Réinstaller
npm install
npm run build

# Redémarrer
pm2 restart anireserve
```

### Si PM2 ne démarre pas :

```bash
# Voir les erreurs
pm2 logs anireserve --err --lines 50

# Redémarrer depuis zéro
pm2 delete anireserve
cd /root/anireserve/apps/web
pm2 start npm --name "anireserve" -- start
pm2 save
```

---

## ✅ Vérification Finale

1. **Vérifier que l'application répond** :
   ```bash
   curl http://localhost:3000
   ```

2. **Vérifier Nginx** :
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Tester depuis le navigateur** :
   - Ouvrir https://anireserve.com
   - Vérifier que le favicon s'affiche correctement
   - Vérifier qu'il n'y a plus d'icône bleue avec "?"

---

**Note** : Les changements sont déjà sur GitHub, il suffit de les récupérer sur le serveur !






