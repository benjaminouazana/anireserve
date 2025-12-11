# ✅ Vérification Finale - Services Démarrés

**Date:** 11 décembre 2025

## ✅ État Actuel

- ✅ PM2: Application "anireserve" démarrée (statut: **online**)
- ✅ Nginx: Redémarré
- ✅ Application: Utilise 61.8mb de mémoire

## 🔍 Vérifications à Faire

### 1. Vérifier que le port 3000 écoute

Sur le serveur, exécutez :

```bash
netstat -tulpn | grep :3000
```

**Résultat attendu :** Devrait montrer que quelque chose écoute sur le port 3000.

### 2. Vérifier les logs PM2

```bash
pm2 logs anireserve --lines 20 --nostream
```

**Résultat attendu :** Pas d'erreurs critiques, l'application devrait être prête.

### 3. Test local sur le serveur

```bash
curl -I http://localhost:3000
```

**Résultat attendu :** HTTP 200, 301, ou 302 (pas d'erreur 500 ou 502).

### 4. Vérifier Nginx

```bash
systemctl status nginx
```

**Résultat attendu :** "active (running)".

### 5. Vérifier les logs Nginx

```bash
tail -20 /var/log/nginx/error.log
```

**Résultat attendu :** Pas d'erreurs récentes.

## 🌐 Test Final

Après ces vérifications, testez le site depuis votre navigateur :

1. Ouvrez https://anireserve.com
2. Le site devrait s'afficher correctement

## 📋 Commandes Complètes de Vérification

Copiez-collez ces commandes sur le serveur :

```bash
echo "=== Port 3000 ==="
netstat -tulpn | grep :3000

echo ""
echo "=== Logs PM2 (20 dernières lignes) ==="
pm2 logs anireserve --lines 20 --nostream

echo ""
echo "=== Test local ==="
curl -I http://localhost:3000 2>&1 | head -5

echo ""
echo "=== Statut Nginx ==="
systemctl status nginx --no-pager | head -5

echo ""
echo "=== Logs Nginx (erreurs récentes) ==="
tail -10 /var/log/nginx/error.log
```

## ✅ Si Tout est OK

Si toutes les vérifications passent :
- ✅ Le site devrait être accessible sur https://anireserve.com
- ✅ PM2 redémarrera automatiquement l'application si elle crash
- ✅ Nginx redirige correctement vers l'application

## 🐛 Si Il Y a des Problèmes

### Si le port 3000 n'écoute pas :

```bash
# Vérifier les logs pour voir l'erreur
pm2 logs anireserve --lines 50

# Vérifier que le build existe
ls -la .next

# Si le build n'existe pas
npm run build
pm2 restart anireserve
```

### Si Nginx ne fonctionne pas :

```bash
# Vérifier la configuration
nginx -t

# Redémarrer
systemctl restart nginx

# Vérifier les logs
tail -50 /var/log/nginx/error.log
```

### Si le site ne répond toujours pas :

```bash
# Vérifier le firewall
ufw status

# Vérifier que les ports sont ouverts
netstat -tulpn | grep -E ':(80|443|3000)'
```

---

**Prochaine étape :** Exécutez les commandes de vérification ci-dessus sur le serveur.
