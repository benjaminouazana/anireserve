# Vérification de la configuration VPS - AniReserve

## 🔍 Diagnostic automatique

Sur le VPS, exécutez le script de diagnostic :

```bash
cd /root/anireserve
git pull origin main
bash diagnostic-vps.sh
```

Ce script vérifie automatiquement :
- ✅ Installation de Nginx
- ✅ Statut du service Nginx
- ✅ Configuration du site
- ✅ Activation du site (symlink)
- ✅ Syntaxe de la configuration
- ✅ Ports écoutés (80, 443)
- ✅ Configuration du firewall
- ✅ Statut de PM2 et Next.js
- ✅ Port 3000 (Next.js)
- ✅ Connexions locales
- ✅ IP publique du serveur
- ✅ Logs d'erreurs

## 📋 Vérifications manuelles

### 1. Vérifier que Nginx est installé et actif

```bash
# Vérifier l'installation
nginx -v

# Vérifier le statut
sudo systemctl status nginx

# Si non actif, démarrer
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Vérifier la configuration du site

```bash
# Vérifier que le fichier existe
ls -la /etc/nginx/sites-available/anireserve.com

# Voir le contenu
cat /etc/nginx/sites-available/anireserve.com
```

**Le fichier doit contenir** :
```nginx
server {
    listen 80;
    server_name anireserve.com www.anireserve.com;
    
    location / {
        proxy_pass http://localhost:3000;
        # ... autres configurations
    }
}
```

### 3. Vérifier que le site est activé

```bash
# Vérifier le symlink
ls -la /etc/nginx/sites-enabled/anireserve.com

# Si le symlink n'existe pas, le créer
sudo ln -s /etc/nginx/sites-available/anireserve.com /etc/nginx/sites-enabled/anireserve.com
```

### 4. Vérifier la syntaxe

```bash
sudo nginx -t
```

**Résultat attendu** :
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 5. Recharger Nginx

```bash
sudo systemctl reload nginx
```

### 6. Vérifier que Nginx écoute sur le port 80

```bash
sudo netstat -tlnp | grep nginx
# ou
sudo ss -tlnp | grep nginx
```

**Vous devriez voir** :
```
tcp  0  0  0.0.0.0:80  0.0.0.0:*  LISTEN  nginx
```

### 7. Vérifier le firewall

```bash
# Vérifier le statut
sudo ufw status

# Si le port 80 n'est pas ouvert
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### 8. Vérifier que Next.js tourne

```bash
# Vérifier PM2
pm2 status

# Si anireserve n'est pas dans la liste
cd /root/anireserve/apps/web
pm2 start ecosystem.config.js
pm2 save
```

### 9. Vérifier que Next.js écoute sur le port 3000

```bash
# Vérifier le port
sudo netstat -tlnp | grep :3000
# ou
sudo ss -tlnp | grep :3000

# Tester la connexion
curl http://localhost:3000
```

**Vous devriez voir du HTML** (la page d'accueil).

### 10. Tester Nginx localement

```bash
# Test basique
curl http://localhost

# Test avec le bon Host header
curl -H "Host: anireserve.com" http://localhost
```

**Les deux doivent retourner du HTML**.

### 11. Vérifier les logs

```bash
# Logs Nginx
sudo tail -f /var/log/nginx/error.log

# Logs PM2
pm2 logs anireserve --lines 50
```

## 🚨 Problèmes courants et solutions

### Problème 1 : Nginx ne démarre pas

**Symptôme** : `sudo systemctl start nginx` échoue

**Solutions** :
```bash
# Vérifier les erreurs
sudo nginx -t

# Vérifier les logs
sudo journalctl -u nginx -n 50

# Vérifier les conflits de ports
sudo lsof -i :80
```

### Problème 2 : "502 Bad Gateway"

**Cause** : Nginx ne peut pas se connecter à Next.js

**Solutions** :
```bash
# Vérifier que Next.js tourne
pm2 status
curl http://localhost:3000

# Vérifier la configuration proxy_pass
grep "proxy_pass" /etc/nginx/sites-available/anireserve.com
# Doit être : proxy_pass http://localhost:3000;
```

### Problème 3 : "Connection refused" depuis l'extérieur

**Cause** : Firewall ou DNS

**Solutions** :
```bash
# Vérifier le firewall
sudo ufw status

# Autoriser les ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Vérifier l'IP publique
curl ifconfig.me
# Doit être : 72.61.103.149
```

### Problème 4 : Le site charge mais montre une erreur

**Cause** : Problème avec Next.js ou la base de données

**Solutions** :
```bash
# Vérifier les logs PM2
pm2 logs anireserve --lines 100

# Vérifier les variables d'environnement
cat /root/anireserve/apps/web/.env

# Vérifier la connexion à la base de données
cd /root/anireserve/apps/web
npx prisma db pull
```

## ✅ Checklist de vérification complète

Avant de dire que le site est configuré, vérifiez :

- [ ] Nginx est installé et actif
- [ ] Le fichier `/etc/nginx/sites-available/anireserve.com` existe
- [ ] Le symlink `/etc/nginx/sites-enabled/anireserve.com` existe
- [ ] La syntaxe Nginx est correcte (`nginx -t`)
- [ ] Nginx écoute sur le port 80 (`netstat -tlnp | grep :80`)
- [ ] Le firewall autorise le port 80 (`ufw allow 80/tcp`)
- [ ] PM2 est installé et l'application tourne (`pm2 status`)
- [ ] Next.js écoute sur le port 3000 (`netstat -tlnp | grep :3000`)
- [ ] Next.js répond localement (`curl http://localhost:3000`)
- [ ] Nginx répond localement (`curl http://localhost`)
- [ ] Nginx répond avec le bon Host (`curl -H "Host: anireserve.com" http://localhost`)
- [ ] Aucune erreur dans les logs Nginx
- [ ] Aucune erreur dans les logs PM2
- [ ] L'IP publique est correcte (72.61.103.149)

## 🎯 Si tout est OK mais le site n'est toujours pas accessible

Si toutes les vérifications ci-dessus passent mais que le site n'est toujours pas accessible depuis l'extérieur, le problème vient **forcément du DNS**.

**Vérifiez dans Hostinger** :
1. Les enregistrements DNS pointent vers `72.61.103.149`
2. Aucun hébergement web n'est actif sur le domaine
3. Aucun CDN/Proxy n'intercepte les requêtes

**Test depuis l'extérieur** :
```bash
# Depuis votre Mac
dig anireserve.com +short
# Doit retourner : 72.61.103.149

curl -I http://anireserve.com
# Doit retourner un code 200 ou 301
```

## 📞 Commandes de dépannage rapide

```bash
# Redémarrer tout
sudo systemctl restart nginx
pm2 restart anireserve

# Voir les logs en temps réel
sudo tail -f /var/log/nginx/error.log
pm2 logs anireserve

# Vérifier le statut global
sudo systemctl status nginx
pm2 status
sudo netstat -tlnp | grep -E "(nginx|3000)"
```









