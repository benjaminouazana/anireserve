# 🔧 Résolution Conflit Git sur le Serveur

**Erreur:** `Your local changes to the following files would be overwritten by merge`

## 🔍 Problème

Le fichier `ecosystem.config.js` a été modifié localement sur le serveur et entre en conflit avec la version sur GitHub.

## ✅ Solution

Sur le serveur, exécutez :

```bash
cd /var/www/anireserve/apps/web

# Sauvegarder la configuration actuelle qui fonctionne
cp ecosystem.config.js ecosystem.config.js.local-backup

# Supprimer le fichier tar.gz qui pose problème
rm -f next-build.tar.gz

# Stash les changements locaux (sauvegarde temporaire)
git stash

# Récupérer les dernières modifications
git pull

# Restaurer la configuration qui fonctionne
cp ecosystem.config.js.local-backup ecosystem.config.js

# Rebuild
npm run build

# Redémarrer PM2
pm2 restart anireserve
```

## 🚀 Commande Complète

```bash
cd /var/www/anireserve/apps/web && cp ecosystem.config.js ecosystem.config.js.local-backup && rm -f next-build.tar.gz && git stash && git pull && cp ecosystem.config.js.local-backup ecosystem.config.js && npm run build && pm2 restart anireserve && sleep 15 && pm2 status
```

## 📝 Explication

1. **Sauvegarder** la config qui fonctionne (npx next start)
2. **Supprimer** le fichier tar.gz qui bloque
3. **Stash** les changements locaux
4. **Pull** les dernières modifications
5. **Restaurer** la config qui fonctionne
6. **Rebuild** avec les nouveaux fichiers
7. **Redémarrer** PM2

---

**Action:** Exécutez la commande complète ci-dessus sur le serveur.
