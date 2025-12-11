# 🖥️ Commandes à Exécuter sur le Serveur

## 📌 Instructions

**IMPORTANT:** Ces commandes doivent être exécutées **sur le serveur**, pas sur votre Mac.

## 🔌 Étape 1: Connexion SSH

```bash
ssh root@72.61.103.149
```

(Remplacez l'IP par celle de votre serveur si différente)

## 📋 Étape 2: Copier-coller ces commandes une par une

```bash
# 1. Aller dans le répertoire
cd /var/www/anireserve/apps/web

# 2. Vérifier que vous êtes au bon endroit
pwd

# 3. Vérifier que ecosystem.config.js existe
ls -la ecosystem.config.js

# 4. Sauvegarder l'ancienne configuration
cp ecosystem.config.js ecosystem.config.js.backup

# 5. Corriger le chemin
sed -i "s|/root/anireserve|/var/www/anireserve|g" ecosystem.config.js

# 6. Corriger le script
sed -i "s|script: 'npm',|script: 'node_modules/.bin/next',|g" ecosystem.config.js

# 7. Vérifier les modifications
echo "=== Configuration corrigée ==="
grep "cwd:" ecosystem.config.js
grep "script:" ecosystem.config.js

# 8. Vérifier si le build existe
if [ -d .next ]; then
    echo "✅ Build existe"
else
    echo "⚠️ Build manquant, construction en cours..."
    npm run build
fi

# 9. Arrêter l'ancienne instance PM2
pm2 delete anireserve 2>/dev/null || echo "Aucune instance à supprimer"

# 10. Démarrer avec la nouvelle configuration
pm2 start ecosystem.config.js

# 11. Sauvegarder la configuration PM2
pm2 save

# 12. Attendre quelques secondes
sleep 5

# 13. Vérifier le statut
echo ""
echo "=== Statut PM2 ==="
pm2 status

# 14. Vérifier le port 3000
echo ""
echo "=== Port 3000 ==="
netstat -tulpn | grep :3000 || echo "⚠️ Rien n'écoute sur le port 3000"

# 15. Vérifier les logs récents
echo ""
echo "=== Logs récents (10 dernières lignes) ==="
pm2 logs anireserve --lines 10 --nostream
```

## 🚀 Version en une seule commande (tout copier d'un coup)

```bash
ssh root@72.61.103.149 'cd /var/www/anireserve/apps/web && cp ecosystem.config.js ecosystem.config.js.backup && sed -i "s|/root/anireserve|/var/www/anireserve|g" ecosystem.config.js && sed -i "s|script: '\''npm'\'',|script: '\''node_modules/.bin/next'\'',|g" ecosystem.config.js && echo "=== Configuration ===" && grep -E "cwd:|script:" ecosystem.config.js && if [ ! -d .next ]; then echo "Build manquant..." && npm run build; else echo "Build OK"; fi && pm2 delete anireserve 2>/dev/null; pm2 start ecosystem.config.js && pm2 save && sleep 5 && pm2 status && netstat -tulpn | grep :3000'
```

## 🔍 Vérification après correction

Une fois les commandes exécutées, vérifiez:

```bash
# Sur le serveur
pm2 status
# Devrait montrer "anireserve" avec le statut "online"

netstat -tulpn | grep :3000
# Devrait montrer que quelque chose écoute sur le port 3000

pm2 logs anireserve --lines 20
# Devrait montrer les logs sans erreurs critiques
```

## 🌐 Tester depuis votre Mac

```bash
# Tester si le site répond
curl -I https://anireserve.com

# Devrait retourner HTTP/2 200 ou similaire
# Si vous voyez HTTP/2 502, il y a encore un problème
```

## ⚠️ Si ça ne fonctionne pas

Si après ces commandes vous avez encore une erreur 502:

1. **Vérifier les logs PM2:**
   ```bash
   pm2 logs anireserve --lines 50
   ```

2. **Vérifier les logs Nginx:**
   ```bash
   tail -50 /var/log/nginx/error.log
   ```

3. **Vérifier que .env existe:**
   ```bash
   cd /var/www/anireserve/apps/web
   ls -la .env
   cat .env | grep DATABASE_URL
   ```

4. **Tester manuellement Next.js:**
   ```bash
   cd /var/www/anireserve/apps/web
   NODE_ENV=production npm start
   # Dans un autre terminal SSH, tester:
   curl http://localhost:3000
   ```


