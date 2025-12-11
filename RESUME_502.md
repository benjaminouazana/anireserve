# 📋 Résumé - Diagnostic et Correction Erreur 502

## ✅ Corrections appliquées

### 1. Chemin corrigé dans ecosystem.config.js
- **Fichier:** `apps/web/ecosystem.config.js`
- **Ligne 7:** Changé de `/root/anireserve/apps/web` à `/var/www/anireserve/apps/web`
- **Ligne 8-9:** Changé de `script: 'npm', args: 'start'` à `script: 'node_modules/.bin/next', args: 'start'` pour plus de robustesse

## 📁 Fichiers créés

1. **`DIAGNOSTIC_502.md`** - Guide de diagnostic détaillé avec toutes les causes possibles
2. **`diagnostic-502.sh`** - Script bash exécutable pour diagnostiquer automatiquement les problèmes
3. **`FIX_502_COMPLET.md`** - Guide complet de résolution étape par étape
4. **`RESUME_502.md`** - Ce fichier, résumé des actions

## 🔍 Causes probables de l'erreur 502

1. **Chemin incorrect dans PM2** ✅ CORRIGÉ
   - Le chemin pointait vers `/root/anireserve` au lieu de `/var/www/anireserve`

2. **Build Next.js manquant ou corrompu**
   - Le dossier `.next` peut ne pas exister ou être incomplet
   - Solution: Exécuter `npm run build` dans `apps/web`

3. **Variables d'environnement manquantes**
   - `DATABASE_URL` doit être définie dans `.env`
   - Vérifier que le fichier `.env` existe dans `apps/web/`

4. **PM2 non démarré ou crashé**
   - L'application peut ne pas être démarrée dans PM2
   - Solution: `pm2 start ecosystem.config.js`

5. **Port 3000 non accessible**
   - L'application Next.js peut ne pas écouter sur le port 3000
   - Vérifier avec: `netstat -tulpn | grep :3000`

6. **Nginx mal configuré**
   - Nginx peut ne pas pointer vers le bon port ou avoir une configuration incorrecte
   - Vérifier: `nginx -t` et `systemctl status nginx`

## 🚀 Actions à effectuer sur le serveur

### Étape 1: Copier les fichiers corrigés
```bash
# Les fichiers ont été corrigés localement
# Il faut les copier sur le serveur ou appliquer les corrections manuellement
```

### Étape 2: Exécuter le diagnostic
```bash
# Copier diagnostic-502.sh sur le serveur
chmod +x diagnostic-502.sh
./diagnostic-502.sh
```

### Étape 3: Appliquer les corrections
```bash
cd /var/www/anireserve/apps/web

# 1. Vérifier/corriger ecosystem.config.js
sed -i "s|/root/anireserve|/var/www/anireserve|g" ecosystem.config.js
sed -i "s|script: 'npm',|script: 'node_modules/.bin/next',|g" ecosystem.config.js
sed -i "s|args: 'start',|args: 'start',|g" ecosystem.config.js

# 2. Vérifier le build
if [ ! -d .next ]; then
    npm run build
fi

# 3. Vérifier .env
if [ ! -f .env ]; then
    echo "⚠️ Créer le fichier .env avec DATABASE_URL"
fi

# 4. Redémarrer PM2
pm2 delete anireserve 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# 5. Vérifier
pm2 status
pm2 logs anireserve --lines 20
netstat -tulpn | grep :3000
```

### Étape 4: Vérifier Nginx
```bash
nginx -t
systemctl reload nginx
tail -f /var/log/nginx/error.log
```

## 📊 Checklist de vérification

Avant de tester le site, vérifiez:

- [ ] `ecosystem.config.js` a le bon chemin (`/var/www/anireserve/apps/web`)
- [ ] `ecosystem.config.js` utilise `node_modules/.bin/next` au lieu de `npm`
- [ ] Le dossier `.next` existe dans `apps/web/`
- [ ] Le fichier `.env` existe avec `DATABASE_URL` valide
- [ ] PM2 montre l'application comme "online" (`pm2 status`)
- [ ] Le port 3000 est utilisé (`netstat -tulpn | grep :3000`)
- [ ] Nginx est actif (`systemctl status nginx`)
- [ ] Les logs PM2 ne montrent pas d'erreurs (`pm2 logs anireserve`)

## 🔗 Commandes rapides

### Diagnostic complet
```bash
./diagnostic-502.sh
```

### Réparation rapide
```bash
cd /var/www/anireserve/apps/web
sed -i "s|/root/anireserve|/var/www/anireserve|g" ecosystem.config.js
npm run build
pm2 delete anireserve && pm2 start ecosystem.config.js && pm2 save
systemctl reload nginx
```

### Vérification finale
```bash
pm2 status
netstat -tulpn | grep :3000
curl -I http://localhost:3000
```

## 📝 Notes importantes

1. **Mode Standalone:** Le `next.config.js` utilise `output: 'standalone'`. Cela signifie que Next.js crée un build optimisé. Le script PM2 actuel (`node_modules/.bin/next start`) fonctionne avec ce mode.

2. **Base de données:** Le schema Prisma utilise PostgreSQL. Assurez-vous que `DATABASE_URL` pointe vers une base PostgreSQL valide.

3. **Logs:** Les logs PM2 sont dans `/root/.pm2/logs/`. Consultez-les en cas de problème:
   ```bash
   pm2 logs anireserve --lines 50
   ```

4. **Permissions:** Assurez-vous que l'utilisateur qui exécute PM2 a les permissions nécessaires sur `/var/www/anireserve`.

## 🆘 Si le problème persiste

1. Consultez `FIX_502_COMPLET.md` pour un guide détaillé
2. Exécutez `diagnostic-502.sh` et partagez les résultats
3. Vérifiez les logs PM2: `pm2 logs anireserve --lines 100`
4. Vérifiez les logs Nginx: `tail -100 /var/log/nginx/error.log`


