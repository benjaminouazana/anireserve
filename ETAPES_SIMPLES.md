# 📝 Étapes Simples pour Corriger l'Erreur 502

## 🎯 Ce que vous devez faire

### Étape 1 : Ouvrir un terminal sur votre Mac

Ouvrez l'application **Terminal** sur votre Mac.

### Étape 2 : Se connecter au serveur

Tapez cette commande et appuyez sur Entrée :

```bash
ssh root@72.61.103.149
```

**Note :** Remplacez `72.61.103.149` par l'IP de votre serveur si elle est différente.

Si on vous demande un mot de passe, tapez-le (vous ne verrez rien s'afficher, c'est normal).

### Étape 3 : Une fois connecté au serveur

Vous verrez quelque chose comme `root@votre-serveur:~#`. C'est bon signe, vous êtes sur le serveur !

### Étape 4 : Aller dans le bon répertoire

Tapez cette commande :

```bash
cd /var/www/anireserve/apps/web
```

### Étape 5 : Vérifier que vous êtes au bon endroit

Tapez :

```bash
pwd
```

Vous devriez voir : `/var/www/anireserve/apps/web`

### Étape 6 : Sauvegarder l'ancienne configuration (au cas où)

```bash
cp ecosystem.config.js ecosystem.config.js.backup
```

### Étape 7 : Corriger le chemin dans ecosystem.config.js

```bash
sed -i "s|/root/anireserve|/var/www/anireserve|g" ecosystem.config.js
```

### Étape 8 : Corriger le script dans ecosystem.config.js

```bash
sed -i "s|script: 'npm',|script: 'node_modules/.bin/next',|g" ecosystem.config.js
```

### Étape 9 : Vérifier que les corrections sont bonnes

```bash
grep -E "cwd:|script:" ecosystem.config.js
```

Vous devriez voir :
- `cwd: '/var/www/anireserve/apps/web',`
- `script: 'node_modules/.bin/next',`

### Étape 10 : Vérifier si le build existe

```bash
ls -la .next
```

Si vous voyez "No such file or directory", passez à l'étape 11. Sinon, passez à l'étape 12.

### Étape 11 : Construire l'application (si nécessaire)

```bash
npm run build
```

**⚠️ Attention :** Cela peut prendre 2-5 minutes. Attendez que ça se termine.

### Étape 12 : Arrêter l'ancienne instance PM2

```bash
pm2 delete anireserve
```

Si ça dit "process not found", c'est normal, continuez.

### Étape 13 : Démarrer avec la nouvelle configuration

```bash
pm2 start ecosystem.config.js
```

### Étape 14 : Sauvegarder la configuration PM2

```bash
pm2 save
```

### Étape 15 : Attendre quelques secondes

```bash
sleep 5
```

### Étape 16 : Vérifier que tout fonctionne

```bash
pm2 status
```

Vous devriez voir `anireserve` avec le statut **online** (en vert).

### Étape 17 : Vérifier le port 3000

```bash
netstat -tulpn | grep :3000
```

Vous devriez voir quelque chose qui écoute sur le port 3000.

### Étape 18 : Vérifier les logs (optionnel)

```bash
pm2 logs anireserve --lines 10
```

Si vous voyez des erreurs en rouge, notez-les.

### Étape 19 : Quitter le serveur

```bash
exit
```

### Étape 20 : Tester le site

Ouvrez votre navigateur et allez sur : **https://anireserve.com**

Le site devrait fonctionner maintenant ! ✅

---

## 🚀 Version Rapide (tout en une fois)

Si vous préférez copier-coller tout d'un coup, voici toutes les commandes :

```bash
ssh root@72.61.103.149
```

Une fois connecté, copiez-collez tout ce bloc :

```bash
cd /var/www/anireserve/apps/web && cp ecosystem.config.js ecosystem.config.js.backup && sed -i "s|/root/anireserve|/var/www/anireserve|g" ecosystem.config.js && sed -i "s|script: 'npm',|script: 'node_modules/.bin/next',|g" ecosystem.config.js && echo "=== Vérification ===" && grep -E "cwd:|script:" ecosystem.config.js && if [ ! -d .next ]; then echo "Build manquant, construction..." && npm run build; else echo "Build OK"; fi && pm2 delete anireserve 2>/dev/null; pm2 start ecosystem.config.js && pm2 save && sleep 5 && echo "=== Statut ===" && pm2 status && echo "=== Port 3000 ===" && netstat -tulpn | grep :3000
```

---

## ❓ Si quelque chose ne fonctionne pas

### Problème : "Permission denied" lors de la connexion SSH
- Vérifiez que vous avez le bon mot de passe
- Vérifiez que l'IP du serveur est correcte

### Problème : "No such file or directory" pour /var/www/anireserve
- Vérifiez que le chemin est correct
- Essayez : `ls -la /var/www/` pour voir ce qui existe

### Problème : "pm2: command not found"
- PM2 n'est pas installé sur le serveur
- Installez-le avec : `npm install -g pm2`

### Problème : Le site affiche toujours 502
- Vérifiez les logs : `pm2 logs anireserve --lines 50`
- Vérifiez Nginx : `systemctl status nginx`
- Vérifiez que .env existe : `ls -la /var/www/anireserve/apps/web/.env`

---

## 📞 Besoin d'aide ?

Si vous êtes bloqué à une étape, notez :
1. À quelle étape vous êtes
2. Le message d'erreur exact que vous voyez
3. La sortie de `pm2 status`
4. La sortie de `pm2 logs anireserve --lines 20`


