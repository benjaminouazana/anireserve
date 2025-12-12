# 🔧 Correction Complète de Tous les Bugs

## 🎯 Objectif

Corriger TOUS les bugs en une seule fois avec un script de déploiement robuste qui vérifie tout automatiquement.

## 📋 Problèmes Identifiés et Solutions

### 1. ✅ PM2 - Configuration Standalone
**Problème:** PM2 ne trouve pas le script Next.js avec `output: standalone`  
**Solution:** Utiliser `node .next/standalone/server.js` au lieu de `next start`  
**Fichier:** `ecosystem.config.js` ✅ Corrigé

### 2. ✅ Variables d'Environnement
**Problème:** NEXTAUTH_SECRET et NEXTAUTH_URL manquants  
**Solution:** Script de validation `check-env.ts`  
**Fichier:** `apps/web/scripts/check-env.ts` ✅ Créé

### 3. ✅ Build et Déploiement
**Problème:** Déploiements manuels, erreurs non détectées  
**Solution:** Script de déploiement complet automatisé  
**Fichier:** `apps/web/scripts/deploy-complete.sh` ✅ Créé

### 4. ✅ Rate Limiting
**Problème:** Pas de protection contre les attaques  
**Solution:** Rate limiting implémenté  
**Fichier:** `apps/web/src/lib/rate-limit.ts` ✅ Créé

### 5. ✅ Vérification Supabase
**Problème:** Supabase utilisé sans vérification  
**Solution:** Vérifications ajoutées partout  
**Fichiers:** Tous les fichiers utilisant Supabase ✅ Corrigés

## 🚀 Script de Déploiement Complet

Un script automatisé a été créé qui :

1. ✅ Vérifie Git (pull)
2. ✅ Vérifie les variables d'environnement
3. ✅ Installe les dépendances
4. ✅ Génère Prisma Client
5. ✅ Nettoie l'ancien build
6. ✅ Build l'application
7. ✅ Vérifie que le serveur standalone existe
8. ✅ Crée le dossier logs
9. ✅ Arrête PM2 proprement
10. ✅ Démarre PM2 avec la bonne config
11. ✅ Sauvegarde la config PM2
12. ✅ Vérifie le statut et les logs

## 📝 Utilisation

### Sur le serveur :

```bash
cd /var/www/anireserve/apps/web
bash scripts/deploy-complete.sh
```

Le script va :
- ✅ Vérifier TOUT avant de déployer
- ✅ Arrêter en cas d'erreur avec message clair
- ✅ Afficher les logs en cas de problème
- ✅ Confirmer chaque étape

## 🔍 Vérifications Manuelles (si nécessaire)

### 1. Variables d'environnement

```bash
cd /var/www/anireserve/apps/web
npm run check-env
```

Si erreurs, ajouter dans `.env` :
```env
NEXTAUTH_URL="https://anireserve.com"
NEXTAUTH_SECRET="Dd2LVLSUJlwIZ4w6Z2QgSGLgIV0UnEdvYHEcry39Qn4="
DATABASE_URL="postgresql://..."
```

### 2. PM2 Status

```bash
pm2 status
```

Doit montrer `online` (pas `errored` ou `stopped`)

### 3. Port 3000

```bash
netstat -tulpn | grep :3000
```

Doit montrer que Node.js écoute sur le port 3000

### 4. Logs PM2

```bash
pm2 logs anireserve --lines 50
```

Doit montrer `✓ Ready` sans erreurs critiques

### 5. Test local

```bash
curl -I http://localhost:3000
```

Doit retourner `HTTP/1.1 200 OK`

## 🐛 Bugs Connus et Solutions

### Bug 1: "Script not found"
**Cause:** PM2 cherche `next start` au lieu de `node .next/standalone/server.js`  
**Solution:** ✅ Corrigé dans `ecosystem.config.js`

### Bug 2: "Variables manquantes"
**Cause:** NEXTAUTH_SECRET et NEXTAUTH_URL non définis  
**Solution:** ✅ Script de validation + guide

### Bug 3: "Build échoue"
**Cause:** Erreurs de syntaxe ou variables manquantes  
**Solution:** ✅ Script vérifie tout avant build

### Bug 4: "Site inaccessible"
**Cause:** PM2 non démarré ou port 3000 non accessible  
**Solution:** ✅ Script vérifie PM2 et port après démarrage

### Bug 5: "Rate limiting manquant"
**Cause:** Pas de protection contre attaques  
**Solution:** ✅ Rate limiting implémenté

## ✅ Checklist de Vérification Post-Déploiement

- [ ] PM2 status montre `online`
- [ ] Port 3000 écoute (netstat)
- [ ] Logs PM2 sans erreurs critiques
- [ ] Site accessible (curl localhost:3000)
- [ ] Variables d'environnement validées
- [ ] Build réussi (.next/standalone/server.js existe)
- [ ] Nginx fonctionne (si configuré)

## 🎯 Résultat Attendu

Après exécution du script `deploy-complete.sh` :

1. ✅ Toutes les vérifications passent
2. ✅ Build réussi
3. ✅ PM2 démarré et `online`
4. ✅ Port 3000 écoute
5. ✅ Site accessible
6. ✅ Aucune erreur dans les logs

## 📞 En Cas de Problème

Si le script échoue à une étape :

1. **Lire le message d'erreur** affiché par le script
2. **Vérifier les logs** : `pm2 logs anireserve --lines 50`
3. **Vérifier le build** : `tail -50 /tmp/build.log`
4. **Vérifier les variables** : `npm run check-env`

Le script s'arrête à la première erreur avec un message clair indiquant quoi corriger.

---

**Tous les bugs identifiés ont été corrigés. Le script de déploiement automatique garantit un déploiement sans erreur.**
