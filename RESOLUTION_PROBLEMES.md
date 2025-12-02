# Résolution des problèmes actuels - VPS

## 🚨 Problème 1 : Le site répond encore avec "Server: LiteSpeed"

**Symptôme** : `curl -I http://anireserve.com` retourne `Server: LiteSpeed`

**Cause** : Un proxy/CDN Hostinger intercepte encore les requêtes avant qu'elles n'arrivent au VPS.

**Solution** : Dans Hostinger, vérifiez et désactivez :
1. **CDN** : Allez dans Hostinger → Domaines → anireserve.com → CDN → Désactiver
2. **Proxy** : Vérifiez s'il y a un proxy activé → Désactiver
3. **Hébergement web** : Assurez-vous qu'aucun hébergement web n'est actif sur ce domaine

**Test** : Après désactivation, attendez 5-10 minutes puis :
```bash
curl -I http://anireserve.com
# Doit retourner : Server: nginx (ou rien, mais PAS LiteSpeed)
```

---

## 🔧 Problème 2 : Conflit Git avec deploy.sh

**Symptôme** : `git pull` échoue avec "deploy.sh would be overwritten"

**Solution** :

```bash
cd /root/anireserve

# Option 1 : Sauvegarder et remplacer
mv deploy.sh deploy.sh.local
git pull origin main
# Si vous aviez des modifications locales, comparez :
diff deploy.sh deploy.sh.local

# Option 2 : Forcer la mise à jour (perd les modifications locales)
git fetch origin
git reset --hard origin/main
```

**Recommandation** : Utilisez l'Option 1 pour ne pas perdre vos modifications.

---

## 🔒 Problème 3 : Certbot échoue avec IPv6

**Symptôme** : Certbot essaie d'accéder via IPv6 et obtient une 404

**Cause** : L'enregistrement AAAA (IPv6) dans le DNS pointe vers une IP qui ne sert pas les fichiers de challenge.

**Solution 1 : Forcer Certbot à utiliser IPv4 uniquement**

```bash
# Arrêter Nginx temporairement
sudo systemctl stop nginx

# Obtenir les certificats en mode standalone avec IPv4 uniquement
sudo certbot certonly --standalone --preferred-challenges http -d anireserve.com -d www.anireserve.com --force-ipv4

# Redémarrer Nginx
sudo systemctl start nginx
```

**Solution 2 : Supprimer l'enregistrement IPv6 dans Hostinger**

Dans Hostinger → DNS :
1. Trouvez l'enregistrement AAAA pour `@`
2. Supprimez-le
3. Attendez 10-30 minutes
4. Réessayez Certbot en mode webroot

---

## 📋 Étapes complètes pour résoudre tous les problèmes

### Étape 1 : Résoudre le conflit Git

```bash
cd /root/anireserve
mv deploy.sh deploy.sh.local 2>/dev/null || true
git pull origin main
```

### Étape 2 : Vérifier que le fichier nginx-ssl-final.conf existe

```bash
ls -la /root/anireserve/nginx-ssl-final.conf
```

Si le fichier n'existe pas :
```bash
cd /root/anireserve
git pull origin main
ls -la nginx-ssl-final.conf
```

### Étape 3 : Désactiver le proxy/CDN Hostinger

**Dans Hostinger** :
1. Allez dans votre panneau Hostinger
2. Domaines → anireserve.com
3. Cherchez "CDN", "Proxy", "Cloudflare" ou similaire
4. **Désactivez tout**
5. Attendez 5-10 minutes

### Étape 4 : Vérifier que le site pointe vers le VPS

```bash
# Tester depuis le VPS
curl -I http://anireserve.com

# Si vous voyez encore "Server: LiteSpeed", attendez encore ou vérifiez Hostinger
# Si vous voyez "Server: nginx" ou rien, c'est bon !
```

### Étape 5 : Obtenir les certificats SSL (mode standalone avec IPv4)

```bash
# Arrêter Nginx
sudo systemctl stop nginx

# Obtenir les certificats
sudo certbot certonly --standalone --preferred-challenges http -d anireserve.com -d www.anireserve.com --force-ipv4

# Redémarrer Nginx
sudo systemctl start nginx
```

**Si ça réussit**, vous verrez :
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/anireserve.com/fullchain.pem
```

### Étape 6 : Appliquer la configuration SSL

```bash
# Backup
sudo cp /etc/nginx/sites-available/anireserve.com /etc/nginx/sites-available/anireserve.com.backup

# Copier la nouvelle config
cd /root/anireserve
sudo cp nginx-ssl-final.conf /etc/nginx/sites-available/anireserve.com

# Tester
sudo nginx -t

# Si OK, recharger
sudo systemctl reload nginx
```

### Étape 7 : Vérifier que HTTPS fonctionne

```bash
# Tester HTTPS
curl -I https://anireserve.com

# Tester la redirection HTTP → HTTPS
curl -I http://anireserve.com
# Doit retourner : 301 Moved Permanently avec Location: https://anireserve.com/
```

---

## 🎯 Solution rapide (si vous voulez tester maintenant)

Si vous voulez tester que votre VPS fonctionne **avant** de résoudre le problème Hostinger :

### Tester directement avec l'IP

```bash
# Depuis votre Mac ou n'importe où
curl -H "Host: anireserve.com" http://72.61.103.149
```

Si ça fonctionne, votre VPS est bien configuré, c'est juste le proxy Hostinger qui bloque.

### Forcer le DNS localement (pour tester)

Sur votre Mac, modifiez `/etc/hosts` :
```bash
sudo nano /etc/hosts
```

Ajoutez :
```
72.61.103.149 anireserve.com
72.61.103.149 www.anireserve.com
```

Puis testez :
```bash
curl -I http://anireserve.com
```

Si ça fonctionne, le problème vient bien du proxy Hostinger.

---

## ✅ Checklist de résolution

- [ ] Conflit Git résolu (`git pull` fonctionne)
- [ ] Fichier `nginx-ssl-final.conf` présent dans `/root/anireserve/`
- [ ] Proxy/CDN Hostinger désactivé
- [ ] `curl -I http://anireserve.com` retourne "Server: nginx" (ou rien, mais PAS LiteSpeed)
- [ ] Certbot réussit (certificats créés)
- [ ] Configuration SSL appliquée
- [ ] HTTPS fonctionne : https://anireserve.com
- [ ] HTTP redirige vers HTTPS

---

## 🚨 Si le problème persiste

### Vérifier les logs

```bash
# Logs Nginx
sudo tail -f /var/log/nginx/error.log

# Logs Certbot
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Logs PM2
pm2 logs anireserve
```

### Vérifier la configuration Nginx actuelle

```bash
sudo cat /etc/nginx/sites-available/anireserve.com
```

### Tester manuellement le fichier de challenge

```bash
# Créer le fichier
echo "test" | sudo tee /var/www/html/.well-known/acme-challenge/test.txt

# Tester depuis l'extérieur
curl http://anireserve.com/.well-known/acme-challenge/test.txt
# Doit retourner : test
```

Si ça ne fonctionne pas, le proxy Hostinger intercepte encore les requêtes.


