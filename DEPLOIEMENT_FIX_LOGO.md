# Déploiement du fix du logo - AniReserve

## 🐛 Problème

Les logs montrent encore des erreurs :
```
⨯ The requested resource isn't a valid image for /logo.png
⨯ The requested resource isn't a valid image for /logo.jpg
...
```

**Cause** : Le correctif du logo n'a pas encore été déployé sur le VPS.

## ✅ Solution : Déployer le correctif

Sur le VPS, exécutez ces commandes :

```bash
# 1. Aller dans le dossier du projet
cd /root/anireserve

# 2. Mettre à jour le code depuis GitHub
git pull origin main

# 3. Aller dans le dossier web
cd apps/web

# 4. Installer les dépendances (si nécessaire)
npm install

# 5. Rebuild l'application avec le correctif
npm run build

# 6. Redémarrer PM2
pm2 restart anireserve

# 7. Vérifier les logs (les erreurs devraient disparaître)
pm2 logs anireserve --lines 20
```

## 🔍 Vérification

Après le déploiement, les erreurs de logo devraient disparaître. Vérifiez :

```bash
# Voir les nouvelles erreurs (il ne devrait plus y avoir d'erreurs logo)
pm2 logs anireserve --err --lines 10

# Voir les logs en temps réel
pm2 logs anireserve
```

## 📝 Ce que fait le correctif

Le composant `Logo.tsx` utilise maintenant directement un fallback text "Ani RESERVE" au lieu d'essayer de charger des fichiers logo qui n'existent pas.

**Avant** : Tentait de charger `/logo.png`, `/logo.jpg`, etc. → Erreurs 404
**Après** : Affiche directement le texte "Ani RESERVE" → Plus d'erreurs

## ✅ Résultat attendu

Après le déploiement :
- ✅ Plus d'erreurs "logo.png" dans les logs
- ✅ Le logo text "Ani RESERVE" s'affiche correctement sur le site
- ✅ Les logs sont propres

## 🚨 Si les erreurs persistent

Si après le déploiement vous voyez encore des erreurs :

1. **Vérifier que le code est à jour** :
```bash
cd /root/anireserve
git log --oneline -5
# Vérifiez que vous voyez le commit avec "fix: Utiliser directement le fallback text logo"
```

2. **Vérifier que le build est récent** :
```bash
cd /root/anireserve/apps/web
ls -la .next/BUILD_ID
# Le timestamp doit être récent
```

3. **Forcer un rebuild complet** :
```bash
cd /root/anireserve/apps/web
rm -rf .next
npm run build
pm2 restart anireserve
```

