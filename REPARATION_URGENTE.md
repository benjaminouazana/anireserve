# 🚨 RÉPARATION URGENTE - Site Inaccessible

**Problème détecté:** Le serveur ne répond pas du tout (timeout complet)

## ⚠️ Diagnostic

- ❌ Le serveur ne répond pas au ping (72.61.103.149)
- ❌ Le site ne répond pas sur HTTPS (anireserve.com)
- ❌ Timeout complet sur toutes les connexions

**Causes possibles:**
1. **Le serveur VPS est arrêté** (le plus probable)
2. **Le firewall bloque toutes les connexions**
3. **Le serveur a changé d'IP**
4. **Problème réseau majeur**

## 🔧 Actions Immédiates

### Étape 1: Vérifier l'état du serveur VPS

**Vous devez vous connecter à votre panneau d'hébergement (Hostinger, DigitalOcean, etc.)**

1. Connectez-vous à votre compte d'hébergement
2. Allez dans la section "VPS" ou "Serveurs"
3. Vérifiez l'état du serveur :
   - ✅ **Actif/En ligne** → Passer à l'étape 2
   - ❌ **Arrêté/Offline** → **Démarrer le serveur** puis passer à l'étape 2
   - ⚠️ **Suspendu** → Contacter le support

### Étape 2: Vérifier l'IP du serveur

Dans votre panneau d'hébergement, vérifiez l'IP actuelle du serveur. Elle peut avoir changé.

### Étape 3: Se connecter au serveur

Une fois le serveur démarré, connectez-vous via SSH :

```bash
ssh root@72.61.103.149
```

**Si l'IP a changé, utilisez la nouvelle IP.**

### Étape 4: Vérifier et redémarrer les services

Une fois connecté au serveur, exécutez ces commandes :

```bash
# 1. Vérifier l'état de PM2
pm2 status

# 2. Si PM2 ne montre rien ou erreur, redémarrer l'application
cd /var/www/anireserve/apps/web
pm2 delete anireserve 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# 3. Vérifier que Next.js écoute sur le port 3000
netstat -tulpn | grep :3000

# 4. Si rien n'écoute, vérifier les logs
pm2 logs anireserve --lines 50

# 5. Vérifier Nginx
systemctl status nginx
systemctl restart nginx

# 6. Vérifier les logs Nginx
tail -50 /var/log/nginx/error.log
```

### Étape 5: Rebuild si nécessaire

Si le build Next.js est manquant ou corrompu :

```bash
cd /var/www/anireserve/apps/web

# Vérifier si le build existe
ls -la .next

# Si le build n'existe pas ou est corrompu
npm run build

# Redémarrer PM2
pm2 restart anireserve
```

## 🔄 Script de Réparation Complet

Copiez-collez ce script sur le serveur une fois connecté :

```bash
#!/bin/bash
echo "🔧 Réparation complète du site AniReserve"
echo "=========================================="
echo ""

# Aller dans le répertoire
cd /var/www/anireserve/apps/web || {
    echo "❌ Erreur: Impossible d'accéder à /var/www/anireserve/apps/web"
    exit 1
}

echo "✅ Répertoire: $(pwd)"
echo ""

# 1. Vérifier le build
echo "1. Vérification du build..."
if [ ! -d .next ]; then
    echo "⚠️ Build manquant, construction en cours..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors du build"
        exit 1
    fi
else
    echo "✅ Build existe"
fi
echo ""

# 2. Vérifier ecosystem.config.js
echo "2. Vérification de la configuration..."
if [ ! -f ecosystem.config.js ]; then
    echo "❌ ecosystem.config.js manquant!"
    exit 1
fi

echo "Chemin configuré:"
grep "cwd:" ecosystem.config.js
echo "Script configuré:"
grep "script:" ecosystem.config.js
echo ""

# 3. Vérifier .env
echo "3. Vérification des variables d'environnement..."
if [ ! -f .env ]; then
    echo "⚠️ .env manquant!"
else
    echo "✅ .env existe"
    if grep -q "DATABASE_URL" .env; then
        echo "✅ DATABASE_URL configuré"
    else
        echo "⚠️ DATABASE_URL manquant dans .env"
    fi
fi
echo ""

# 4. Redémarrer PM2
echo "4. Redémarrage de PM2..."
pm2 delete anireserve 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "Attente du démarrage (10 secondes)..."
sleep 10

# 5. Vérifier le statut
echo ""
echo "5. Vérification du statut..."
pm2 status

echo ""
echo "6. Vérification du port 3000..."
if netstat -tulpn 2>/dev/null | grep :3000 > /dev/null; then
    echo "✅ Port 3000 en écoute"
    netstat -tulpn | grep :3000
else
    echo "❌ Rien n'écoute sur le port 3000"
    echo ""
    echo "Logs PM2:"
    pm2 logs anireserve --lines 30 --nostream
fi
echo ""

# 6. Vérifier Nginx
echo "7. Vérification de Nginx..."
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx est actif"
    systemctl restart nginx
else
    echo "⚠️ Nginx n'est pas actif, démarrage..."
    systemctl start nginx
fi
echo ""

# 7. Test local
echo "8. Test local..."
curl -I http://localhost:3000 2>&1 | head -5
echo ""

echo "=========================================="
echo "✅ Réparation terminée!"
echo ""
echo "Vérifiez maintenant:"
echo "  - pm2 logs anireserve"
echo "  - tail -50 /var/log/nginx/error.log"
echo "  - Testez https://anireserve.com depuis votre navigateur"
```

## 📋 Checklist de Vérification

Après avoir exécuté les commandes, vérifiez :

- [ ] Le serveur VPS est démarré dans le panneau d'hébergement
- [ ] Vous pouvez vous connecter en SSH
- [ ] PM2 montre "anireserve" avec statut "online"
- [ ] Le port 3000 est en écoute (`netstat -tulpn | grep :3000`)
- [ ] Nginx est actif (`systemctl status nginx`)
- [ ] Le build Next.js existe (`ls -la .next`)
- [ ] Les logs PM2 ne montrent pas d'erreurs critiques
- [ ] Le site répond en local (`curl http://localhost:3000`)

## 🆘 Si le Serveur est Complètement Inaccessible

Si vous ne pouvez même pas vous connecter en SSH :

1. **Vérifier dans le panneau d'hébergement:**
   - L'état du serveur (doit être "En ligne")
   - L'IP du serveur (peut avoir changé)
   - Les ressources (CPU, RAM, disque)

2. **Vérifier les factures:**
   - Le serveur n'est peut-être pas suspendu pour non-paiement

3. **Contacter le support de l'hébergeur:**
   - Demander pourquoi le serveur ne répond pas
   - Vérifier s'il y a des problèmes réseau

## 🌐 Vérification DNS

Une fois le serveur redémarré, vérifiez que le DNS pointe toujours vers la bonne IP :

```bash
# Depuis votre Mac
nslookup anireserve.com
dig anireserve.com
```

Si l'IP a changé, vous devrez peut-être mettre à jour les enregistrements DNS.

## ⚡ Solution Rapide (si vous avez accès SSH)

Si vous arrivez à vous connecter en SSH, cette commande unique peut tout réparer :

```bash
ssh root@72.61.103.149 'cd /var/www/anireserve/apps/web && npm run build && pm2 delete anireserve 2>/dev/null; pm2 start ecosystem.config.js && pm2 save && sleep 5 && pm2 status && systemctl restart nginx && echo "✅ Services redémarrés"'
```

## 📞 Prochaines Étapes

1. **Immédiat:** Vérifier l'état du serveur dans le panneau d'hébergement
2. **Si arrêté:** Démarrer le serveur
3. **Si actif:** Se connecter en SSH et exécuter le script de réparation
4. **Vérifier:** Tester le site après réparation

---

**⚠️ IMPORTANT:** Le problème principal semble être que le serveur VPS est arrêté ou inaccessible. Commencez par vérifier l'état du serveur dans votre panneau d'hébergement.
