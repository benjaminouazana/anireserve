# ✅ Vérification Après Redémarrage du Serveur

**Date:** 11 décembre 2025

## 🔍 Commandes de Vérification

### Depuis votre Mac (test rapide)

```bash
# Test de connectivité
ping -c 3 72.61.103.149

# Test HTTPS
curl -I https://anireserve.com

# Test HTTP
curl -I http://anireserve.com
```

### Sur le serveur (via SSH)

```bash
# Se connecter
ssh root@72.61.103.149

# Une fois connecté, vérifier PM2
pm2 status

# Vérifier que Next.js écoute sur le port 3000
netstat -tulpn | grep :3000

# Vérifier les logs PM2 (dernières 20 lignes)
pm2 logs anireserve --lines 20 --nostream

# Vérifier Nginx
systemctl status nginx

# Test local
curl -I http://localhost:3000
```

## ✅ Checklist de Vérification

- [ ] Le serveur répond au ping
- [ ] Le site répond sur HTTPS (anireserve.com)
- [ ] PM2 montre "anireserve" avec statut "online"
- [ ] Le port 3000 est en écoute
- [ ] Nginx est actif
- [ ] Les logs PM2 ne montrent pas d'erreurs critiques
- [ ] Le site s'affiche correctement dans le navigateur

## 🔧 Si quelque chose ne fonctionne pas

### PM2 n'est pas démarré

```bash
cd /var/www/anireserve/apps/web
pm2 start ecosystem.config.js
pm2 save
pm2 status
```

### Le build Next.js est manquant

```bash
cd /var/www/anireserve/apps/web
npm run build
pm2 restart anireserve
```

### Nginx n'est pas actif

```bash
systemctl start nginx
systemctl status nginx
```

### Vérifier les logs d'erreur

```bash
# Logs PM2
pm2 logs anireserve --lines 50

# Logs Nginx
tail -50 /var/log/nginx/error.log
```

## 🎯 Test Final

Une fois toutes les vérifications faites, testez le site dans votre navigateur :

1. Ouvrez https://anireserve.com
2. Vérifiez que la page d'accueil s'affiche
3. Testez quelques fonctionnalités (recherche, connexion, etc.)

---

**Note:** Il peut falloir quelques minutes après le redémarrage pour que tous les services soient complètement opérationnels.
