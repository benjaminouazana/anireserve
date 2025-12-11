# 🔌 Comment Se Connecter au Serveur

## ⚠️ IMPORTANT

Les commandes de démarrage des services doivent être exécutées **sur le serveur**, pas sur votre Mac !

## 📋 Étape 1: Ouvrir un Terminal sur votre Mac

Ouvrez l'application **Terminal** sur votre Mac.

## 📋 Étape 2: Se connecter au serveur

Dans le Terminal, tapez :

```bash
ssh root@72.61.103.149
```

Appuyez sur **Entrée**.

### Si c'est la première fois :
- Vous verrez un message de confirmation, tapez `yes` et appuyez sur Entrée
- On vous demandera le mot de passe du serveur (tapez-le, il ne s'affichera pas, c'est normal)

### Si vous avez une clé SSH :
- La connexion se fera automatiquement sans mot de passe

## 📋 Étape 3: Vérifier que vous êtes sur le serveur

Une fois connecté, vous devriez voir quelque chose comme :

```
root@vps-xxxxx:~#
```

Le prompt change et montre que vous êtes sur le serveur Linux, pas sur votre Mac.

## 📋 Étape 4: Exécuter les commandes

**Maintenant** vous pouvez exécuter les commandes de démarrage :

```bash
cd /var/www/anireserve/apps/web

# Vérifier/créer le build si nécessaire
[ ! -d .next ] && npm run build

# Démarrer PM2
pm2 delete anireserve 2>/dev/null
pm2 start ecosystem.config.js
pm2 save

# Redémarrer Nginx
systemctl restart nginx

# Vérifier
pm2 status
netstat -tulpn | grep :3000
```

## 🔍 Comment savoir si vous êtes sur le serveur ?

**Sur votre Mac :**
- Le prompt ressemble à : `macbookpro@Ben-Ouazana ~ %`
- Les chemins comme `/var/www/` n'existent pas
- `pm2` et `systemctl` ne sont pas disponibles

**Sur le serveur :**
- Le prompt ressemble à : `root@vps-xxxxx:~#`
- Les chemins comme `/var/www/anireserve/` existent
- `pm2` et `systemctl` sont disponibles

## 🚀 Commande Rapide (Depuis votre Mac)

Si vous préférez, vous pouvez exécuter tout d'un coup depuis votre Mac :

```bash
ssh root@72.61.103.149 << 'EOF'
cd /var/www/anireserve/apps/web
[ ! -d .next ] && npm run build || true
pm2 delete anireserve 2>/dev/null
pm2 start ecosystem.config.js
pm2 save
systemctl restart nginx
sleep 5
pm2 status
netstat -tulpn | grep :3000
EOF
```

Cette commande :
1. Se connecte au serveur
2. Exécute toutes les commandes
3. Affiche les résultats
4. Se déconnecte automatiquement

## ❌ Si vous avez des erreurs de connexion

### Erreur "Connection refused"
- Le serveur n'est peut-être pas complètement démarré
- Attendez 2-3 minutes et réessayez

### Erreur "Permission denied"
- Vérifiez que vous utilisez le bon utilisateur (`root`)
- Vérifiez le mot de passe

### Erreur "Host key verification failed"
```bash
ssh-keygen -R 72.61.103.149
ssh root@72.61.103.149
```

## 📝 Résumé

1. **Ouvrir Terminal** sur votre Mac
2. **Taper** `ssh root@72.61.103.149`
3. **Se connecter** (mot de passe si demandé)
4. **Une fois connecté**, exécuter les commandes de démarrage
5. **Vérifier** que tout fonctionne avec `pm2 status`

---

**Rappel :** Ne jamais exécuter les commandes `pm2` ou `systemctl` directement sur votre Mac, elles doivent être sur le serveur Linux !
