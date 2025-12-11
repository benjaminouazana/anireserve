# Guide : Désactiver le Proxy Hostinger

## 🔍 Problème Identifié

Le domaine `anireserve.com` pointe bien vers `72.61.103.149` (DNS correct), mais un **proxy Hostinger** intercepte les requêtes et redirige vers l'ancien serveur WordPress (LiteSpeed).

## ✅ Solution : Désactiver le Proxy dans Hostinger

### Étape 1 : Accéder au Panneau Hostinger

1. Connectez-vous à **hPanel** (https://hpanel.hostinger.com)
2. Allez dans **Domaines** → **anireserve.com**

### Étape 2 : Vérifier les Paramètres DNS

1. Cliquez sur **"Gérer"** à côté de `anireserve.com`
2. Allez dans l'onglet **"DNS"** ou **"Zone DNS"**

### Étape 3 : Désactiver le Proxy/CDN

**Option A : Si vous voyez un bouton "Proxy" ou "Cloudflare"**
- Cliquez sur l'icône **nuage orange/jaune** à côté des enregistrements A
- Désactivez le proxy (l'icône doit devenir **gris**)
- Attendez 5-10 minutes pour la propagation

**Option B : Si vous voyez "DNS Cloudflare"**
- Désactivez Cloudflare dans les paramètres
- Utilisez uniquement les DNS Hostinger

**Option C : Si vous voyez "CDN" ou "Accélération"**
- Désactivez le CDN dans les paramètres du domaine
- Désactivez toute "accélération" ou "cache"

### Étape 4 : Vérifier les Enregistrements A

Assurez-vous que les enregistrements A sont corrects :

```
Type    Nom        Valeur          Proxy
A       @          72.61.103.149   ❌ DÉSACTIVÉ
A       www        72.61.103.149   ❌ DÉSACTIVÉ
```

**Important** : L'icône de proxy doit être **grisée** (désactivée), pas orange/jaune.

### Étape 5 : Vérifier sur le VPS

Une fois le proxy désactivé, vérifiez sur le VPS :

```bash
# Se connecter au VPS
ssh root@72.61.103.149

# Vérifier que Nginx écoute bien
sudo systemctl status nginx

# Vérifier la configuration
sudo nginx -t

# Vérifier les logs
sudo tail -f /var/log/nginx/anireserve_error.log
```

## 🔄 Alternative : Utiliser Cloudflare Directement

Si Hostinger ne permet pas de désactiver le proxy facilement, vous pouvez :

1. **Transférer les DNS vers Cloudflare** (gratuit)
2. Configurer Cloudflare pour pointer vers `72.61.103.149`
3. Désactiver le proxy Cloudflare (mode DNS uniquement)

## ⏱️ Temps de Propagation

- **DNS** : 5-30 minutes
- **Proxy** : 5-15 minutes
- **Total** : Attendre jusqu'à 1 heure maximum

## ✅ Vérification

Après avoir désactivé le proxy, testez :

```bash
# Vérifier le serveur qui répond
curl -I http://anireserve.com

# Devrait afficher :
# Server: nginx/1.24.0 (Ubuntu)
# (et non plus LiteSpeed)
```

## 📞 Support Hostinger

Si vous ne trouvez pas l'option pour désactiver le proxy :
1. Contactez le support Hostinger
2. Demandez de **désactiver le proxy/CDN pour anireserve.com**
3. Expliquez que vous utilisez votre propre serveur VPS

---

**Note** : Le proxy Hostinger est souvent activé par défaut pour améliorer les performances, mais il interfère avec votre configuration VPS personnalisée.






