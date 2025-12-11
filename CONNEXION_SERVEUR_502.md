# 🔌 Connexion au Serveur pour Corriger l'Erreur 502

## ⚠️ Important

Les commandes de correction doivent être exécutées **sur le serveur**, pas sur votre machine locale !

## 📋 Étape 1: Se connecter au serveur

```bash
# Remplacez 72.61.103.149 par l'IP de votre serveur si différente
ssh root@72.61.103.149
```

Si vous avez une clé SSH configurée, vous serez connecté directement. Sinon, on vous demandera le mot de passe.

## 📋 Étape 2: Une fois connecté au serveur, exécuter les commandes

```bash
# Aller dans le répertoire de l'application
cd /var/www/anireserve/apps/web

# Vérifier que vous êtes au bon endroit
pwd
# Devrait afficher: /var/www/anireserve/apps/web

# Vérifier que ecosystem.config.js existe
ls -la ecosystem.config.js

# Corriger ecosystem.config.js
sed -i "s|/root/anireserve|/var/www/anireserve|g" ecosystem.config.js
sed -i "s|script: 'npm',|script: 'node_modules/.bin/next',|g" ecosystem.config.js

# Vérifier les modifications
cat ecosystem.config.js | grep -E "cwd:|script:"

# Rebuild si nécessaire (cela peut prendre quelques minutes)
npm run build

# Redémarrer PM2
pm2 delete anireserve
pm2 start ecosystem.config.js
pm2 save

# Vérifier le statut
pm2 status
netstat -tulpn | grep :3000
```

## 🔍 Alternative: Vérifier d'abord l'état actuel

Si vous préférez vérifier avant de modifier:

```bash
# Se connecter au serveur
ssh root@72.61.103.149

# Aller dans le répertoire
cd /var/www/anireserve/apps/web

# Vérifier l'état actuel
echo "=== État actuel ==="
echo "Répertoire actuel:"
pwd

echo ""
echo "Contenu de ecosystem.config.js:"
cat ecosystem.config.js

echo ""
echo "Statut PM2:"
pm2 status

echo ""
echo "Port 3000:"
netstat -tulpn | grep :3000 || echo "Rien n'écoute sur le port 3000"

echo ""
echo "Build Next.js:"
ls -la .next 2>/dev/null || echo "Dossier .next n'existe pas"
```

## 🚀 Script complet en une seule commande

Vous pouvez aussi copier-coller tout ce script d'un coup:

```bash
ssh root@72.61.103.149 << 'EOF'
cd /var/www/anireserve/apps/web

echo "=== Correction de l'erreur 502 ==="
echo ""

# Sauvegarder l'ancienne config
cp ecosystem.config.js ecosystem.config.js.backup

# Corriger ecosystem.config.js
echo "1. Correction du chemin..."
sed -i "s|/root/anireserve|/var/www/anireserve|g" ecosystem.config.js

echo "2. Correction du script..."
sed -i "s|script: 'npm',|script: 'node_modules/.bin/next',|g" ecosystem.config.js

echo "3. Vérification des modifications..."
echo "Chemin configuré:"
grep "cwd:" ecosystem.config.js
echo "Script configuré:"
grep "script:" ecosystem.config.js

echo ""
echo "4. Vérification du build..."
if [ ! -d .next ]; then
    echo "Build manquant, construction en cours..."
    npm run build
else
    echo "Build existe déjà"
fi

echo ""
echo "5. Redémarrage PM2..."
pm2 delete anireserve 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "6. Vérification..."
sleep 3
pm2 status
echo ""
netstat -tulpn | grep :3000 || echo "⚠️ Rien n'écoute sur le port 3000"

echo ""
echo "=== Fin de la correction ==="
EOF
```

## 📝 Si vous n'avez pas accès SSH direct

Si vous ne pouvez pas vous connecter directement, vous pouvez:

1. **Utiliser un gestionnaire de serveur** (comme cPanel, Plesk, etc.)
2. **Demander à votre hébergeur** de vous donner accès
3. **Utiliser un outil de déploiement** si vous en avez un configuré

## 🔍 Vérification depuis votre machine locale

Une fois les corrections appliquées sur le serveur, vous pouvez vérifier depuis votre Mac:

```bash
# Tester si le site répond
curl -I https://anireserve.com

# Ou ouvrir dans un navigateur
open https://anireserve.com
```

## ⚠️ Notes importantes

1. **Sur macOS**, `netstat` a une syntaxe différente. Sur le serveur Linux, utilisez `netstat -tulpn`
2. **PM2** doit être installé sur le serveur, pas sur votre Mac
3. **Les chemins** `/var/www/anireserve` existent uniquement sur le serveur Linux

## 🆘 Si vous ne pouvez pas vous connecter

Si vous avez des problèmes de connexion SSH:

1. Vérifiez que l'IP du serveur est correcte
2. Vérifiez que le port SSH (22) n'est pas bloqué par un firewall
3. Contactez votre hébergeur pour obtenir les informations de connexion


