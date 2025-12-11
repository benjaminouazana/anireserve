# 🔧 Guide Complet de Résolution Erreur 502

## 📋 Résumé des problèmes identifiés

1. ✅ **Chemin incorrect dans ecosystem.config.js** - CORRIGÉ
   - Ancien: `/root/anireserve/apps/web`
   - Nouveau: `/var/www/anireserve/apps/web`

2. ⚠️ **Configuration Next.js en mode standalone**
   - Le `next.config.js` utilise `output: 'standalone'`
   - Cela nécessite un build spécifique et un script de démarrage adapté

3. ⚠️ **Variables d'environnement**
   - `DATABASE_URL` doit être définie et valide
   - `NEXTAUTH_SECRET` recommandé pour l'authentification

## 🚀 Solution Complète

### Étape 1: Se connecter au serveur

```bash
ssh root@72.61.103.149
# ou l'IP de votre serveur
```

### Étape 2: Exécuter le script de diagnostic

```bash
# Copier le script sur le serveur
# Puis exécuter:
chmod +x diagnostic-502.sh
./diagnostic-502.sh
```

### Étape 3: Corriger la configuration PM2

```bash
cd /var/www/anireserve/apps/web

# Vérifier et corriger le chemin si nécessaire
sed -i "s|/root/anireserve|/var/www/anireserve|g" ecosystem.config.js

# Vérifier le contenu
cat ecosystem.config.js | grep cwd
```

### Étape 4: Vérifier/Créer le build Next.js

```bash
cd /var/www/anireserve/apps/web

# Vérifier si .next existe
if [ ! -d .next ]; then
    echo "Build manquant, construction en cours..."
    npm run build
fi

# Si le build existe mais est ancien, le reconstruire
npm run build
```

**Note importante:** Avec `output: 'standalone'`, Next.js crée un dossier `.next/standalone` qui contient une version autonome de l'application. Le script PM2 doit pointer vers ce dossier.

### Étape 5: Adapter ecosystem.config.js pour standalone (si nécessaire)

Si vous utilisez le mode standalone, vous avez deux options:

#### Option A: Utiliser le serveur Next.js standard (recommandé pour simplicité)

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    script: 'node_modules/.bin/next',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // ... reste de la config
  }]
};
```

#### Option B: Utiliser le build standalone (plus optimisé)

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web/.next/standalone',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // ... reste de la config
  }]
};
```

**⚠️ Attention:** Si vous utilisez l'option B, vous devez aussi copier les dossiers `public` et `.next/static` à côté du dossier standalone.

### Étape 6: Vérifier les variables d'environnement

```bash
cd /var/www/anireserve/apps/web

# Vérifier que .env existe
if [ ! -f .env ]; then
    echo "⚠️ Fichier .env manquant - À créer"
    exit 1
fi

# Vérifier DATABASE_URL
if ! grep -q "DATABASE_URL" .env; then
    echo "⚠️ DATABASE_URL manquante dans .env"
    echo "Ajoutez: DATABASE_URL=\"postgresql://user:password@host:5432/database\""
fi

# Afficher (sans le mot de passe) pour vérification
grep "DATABASE_URL" .env | sed 's/:[^@]*@/:***@/'
```

### Étape 7: Redémarrer PM2

```bash
# Arrêter l'ancienne instance
pm2 delete anireserve 2>/dev/null || true

# Démarrer avec la nouvelle configuration
cd /var/www/anireserve/apps/web
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Vérifier le statut
pm2 status
pm2 logs anireserve --lines 20
```

### Étape 8: Vérifier que l'application écoute sur le port 3000

```bash
# Attendre quelques secondes pour le démarrage
sleep 5

# Vérifier le port
netstat -tulpn | grep :3000

# Si rien n'apparaît, vérifier les logs
pm2 logs anireserve --lines 50
```

### Étape 9: Vérifier et recharger Nginx

```bash
# Tester la configuration Nginx
nginx -t

# Si OK, recharger
systemctl reload nginx

# Vérifier les logs d'erreur
tail -f /var/log/nginx/error.log
```

### Étape 10: Tester le site

```bash
# Depuis votre machine locale
curl -I https://anireserve.com

# Ou ouvrir dans un navigateur
```

## 🔍 Diagnostic des erreurs courantes

### Erreur: "Cannot find module"
**Cause:** `node_modules` manquant ou incomplet
**Solution:**
```bash
cd /var/www/anireserve/apps/web
rm -rf node_modules
npm install
```

### Erreur: "DATABASE_URL is not defined"
**Cause:** Variable d'environnement manquante
**Solution:**
```bash
cd /var/www/anireserve/apps/web
echo 'DATABASE_URL="postgresql://user:password@host:5432/database"' >> .env
pm2 restart anireserve
```

### Erreur: "Port 3000 already in use"
**Cause:** Un autre processus utilise le port
**Solution:**
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus (remplacer PID)
kill -9 PID

# Redémarrer PM2
pm2 restart anireserve
```

### Erreur: "Build not found" ou ".next missing"
**Cause:** Le build n'existe pas
**Solution:**
```bash
cd /var/www/anireserve/apps/web
npm run build
pm2 restart anireserve
```

## 📝 Checklist finale

Avant de tester, vérifiez:

- [ ] Le chemin dans `ecosystem.config.js` est `/var/www/anireserve/apps/web`
- [ ] Le dossier `.next` existe et contient un build récent
- [ ] Le fichier `.env` existe avec `DATABASE_URL` valide
- [ ] PM2 montre l'application comme "online"
- [ ] Le port 3000 est utilisé (`netstat -tulpn | grep :3000`)
- [ ] Nginx est actif et configuré correctement
- [ ] Les logs PM2 ne montrent pas d'erreurs critiques

## 🆘 Si le problème persiste

1. **Vérifier les logs détaillés:**
   ```bash
   pm2 logs anireserve --lines 100
   tail -100 /var/log/nginx/error.log
   ```

2. **Tester la connexion à la base de données:**
   ```bash
   cd /var/www/anireserve/apps/web
   npx prisma db pull
   ```

3. **Vérifier les permissions:**
   ```bash
   ls -la /var/www/anireserve/apps/web
   # Les fichiers doivent être accessibles par l'utilisateur qui exécute PM2
   ```

4. **Tester manuellement Next.js:**
   ```bash
   cd /var/www/anireserve/apps/web
   NODE_ENV=production npm start
   # Dans un autre terminal, tester:
   curl http://localhost:3000
   ```

## 📞 Support

Si le problème persiste après avoir suivi toutes ces étapes, fournissez:
- Le résultat du script `diagnostic-502.sh`
- Les 50 dernières lignes de `pm2 logs anireserve`
- Les 20 dernières lignes de `/var/log/nginx/error.log`
- Le contenu de `ecosystem.config.js`
- La sortie de `netstat -tulpn | grep :3000`


