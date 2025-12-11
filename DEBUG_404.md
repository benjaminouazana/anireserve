# Debug : Erreur 404 sur le Serveur

## 🔍 Problème Identifié

Le serveur Nginx répond (nginx/1.24.0), mais retourne une erreur 404. Cela signifie que :
- ✅ Nginx fonctionne
- ❌ L'application Next.js n'est pas accessible ou ne répond pas

## 🔧 Solutions à Vérifier sur le VPS

### 1. Vérifier que PM2 est actif

```bash
ssh root@72.61.103.149
pm2 status
```

**Résultat attendu** : Vous devriez voir `anireserve` avec le statut `online`.

**Si l'application n'est pas démarrée** :
```bash
cd /root/anireserve/apps/web
pm2 start npm --name "anireserve" -- start
pm2 save
```

### 2. Vérifier que l'application écoute sur le port 3000

```bash
# Vérifier si le port 3000 est utilisé
sudo netstat -tlnp | grep 3000
# ou
sudo ss -tlnp | grep 3000
```

**Résultat attendu** : `0.0.0.0:3000` ou `127.0.0.1:3000`

**Si le port n'est pas utilisé** :
```bash
cd /root/anireserve/apps/web
npm run build
pm2 restart anireserve
```

### 3. Tester l'application directement

```bash
# Tester si l'application répond en local
curl http://localhost:3000
```

**Résultat attendu** : HTML de la page d'accueil

**Si ça ne fonctionne pas** :
```bash
# Voir les logs PM2
pm2 logs anireserve --lines 50

# Vérifier les erreurs
pm2 logs anireserve --err --lines 50
```

### 4. Vérifier la configuration Nginx

```bash
# Voir la configuration actuelle
sudo cat /etc/nginx/sites-available/anireserve.com

# Vérifier que proxy_pass pointe vers localhost:3000
grep -A 5 "location /" /etc/nginx/sites-available/anireserve.com
```

**Résultat attendu** : `proxy_pass http://localhost:3000;`

**Si la configuration est incorrecte** :
```bash
sudo nano /etc/nginx/sites-available/anireserve.com
# Vérifier que vous avez :
# location / {
#   proxy_pass http://localhost:3000;
#   ...
# }
```

### 5. Vérifier que le build Next.js existe

```bash
cd /root/anireserve/apps/web
ls -la .next
```

**Résultat attendu** : Le dossier `.next` doit exister avec des fichiers

**Si le build n'existe pas** :
```bash
cd /root/anireserve/apps/web
rm -rf .next
npm run build
pm2 restart anireserve
```

### 6. Vérifier les logs Nginx

```bash
# Voir les erreurs Nginx
sudo tail -50 /var/log/nginx/anireserve_error.log

# Voir les accès
sudo tail -50 /var/log/nginx/anireserve_access.log
```

## 🚨 Problèmes Courants

### Problème 1 : Application non démarrée
**Solution** :
```bash
pm2 start npm --name "anireserve" -- start
pm2 save
pm2 startup
```

### Problème 2 : Build manquant ou corrompu
**Solution** :
```bash
cd /root/anireserve/apps/web
rm -rf .next node_modules
npm install
npm run build
pm2 restart anireserve
```

### Problème 3 : Port 3000 bloqué
**Solution** :
```bash
# Vérifier le firewall
sudo ufw status
sudo ufw allow 3000/tcp  # Si nécessaire (mais normalement pas besoin, c'est en localhost)
```

### Problème 4 : Configuration Nginx incorrecte
**Solution** : Vérifier que `proxy_pass http://localhost:3000;` est présent dans la config.

### Problème 5 : Variables d'environnement manquantes
**Solution** :
```bash
cd /root/anireserve/apps/web
# Vérifier que .env existe
ls -la .env
# Vérifier le contenu (sans afficher les valeurs sensibles)
cat .env | grep -v PASSWORD | grep -v SECRET
```

## ✅ Checklist de Vérification

- [ ] PM2 est actif : `pm2 status` montre `anireserve` online
- [ ] Port 3000 écoute : `netstat -tlnp | grep 3000` retourne quelque chose
- [ ] Application répond : `curl http://localhost:3000` retourne du HTML
- [ ] Build existe : `ls -la .next` montre des fichiers
- [ ] Nginx configuré : `grep proxy_pass /etc/nginx/sites-available/anireserve.com` montre `localhost:3000`
- [ ] Nginx testé : `sudo nginx -t` retourne "syntax is ok"
- [ ] Nginx rechargé : `sudo systemctl reload nginx`

## 🔄 Commandes de Redémarrage Complètes

Si rien ne fonctionne, redémarrez tout :

```bash
# 1. Arrêter PM2
pm2 stop anireserve

# 2. Rebuild
cd /root/anireserve/apps/web
rm -rf .next
npm run build

# 3. Redémarrer PM2
pm2 start npm --name "anireserve" -- start
pm2 save

# 4. Vérifier
pm2 status
curl http://localhost:3000

# 5. Recharger Nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

**Note** : Si le problème persiste après ces vérifications, partagez les logs PM2 et Nginx pour un diagnostic plus approfondi.








