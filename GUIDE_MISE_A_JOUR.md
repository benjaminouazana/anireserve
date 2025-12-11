# 🔄 Guide Complet : Mettre à Jour le Code sur GitHub et le Serveur

## 📋 Vue d'Ensemble

Ce guide explique comment :
1. ✅ Commiter et pousser les changements vers GitHub
2. ✅ Mettre à jour le code sur le serveur VPS

---

## 🚀 ÉTAPE 1 : Mettre à Jour GitHub

### 1.1. Vérifier les Fichiers Modifiés

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
git status
```

Cette commande te montre tous les fichiers qui ont été modifiés, ajoutés ou supprimés.

### 1.2. Ajouter les Fichiers au Staging

**Option A : Ajouter tous les fichiers modifiés**
```bash
git add .
```

**Option B : Ajouter des fichiers spécifiques**
```bash
git add apps/web/src/app/professionals/[slug]/ReviewsSection.tsx
git add apps/web/src/components/ThemeToggle.tsx
git add apps/web/src/app/api/reviews/can-review/route.ts
```

### 1.3. Créer un Commit avec un Message

```bash
git commit -m "Ajout du bouton 'Laisser un avis' et correction du thème sombre/clair"
```

**Exemples de messages de commit :**
- `"Correction du bouton de thème"`
- `"Ajout du système d'avis pour les clients"`
- `"Amélioration de l'interface utilisateur"`

### 1.4. Pousser vers GitHub

```bash
git push origin main
```

Si tu es sur une autre branche (par exemple `develop`), remplace `main` par le nom de ta branche :
```bash
git push origin develop
```

---

## 🖥️ ÉTAPE 2 : Mettre à Jour le Serveur

### 2.1. Se Connecter au VPS

```bash
ssh root@72.61.103.149
```

### 2.2. Aller dans le Dossier du Projet

```bash
cd /root/anireserve
```

### 2.3. Récupérer les Derniers Changements depuis GitHub

```bash
git pull origin main
```

**Si tu as des conflits :**
```bash
# Sauvegarder les changements locaux
git stash

# Récupérer les changements
git pull origin main

# Réappliquer tes changements locaux
git stash pop
```

### 2.4. Aller dans le Dossier Web

```bash
cd apps/web
```

### 2.5. Installer les Nouvelles Dépendances (si nécessaire)

```bash
npm install
```

Cette commande installe automatiquement les nouvelles dépendances si tu as ajouté des packages.

### 2.6. Rebuild l'Application Next.js

```bash
npm run build
```

Cette étape compile l'application Next.js et crée les fichiers optimisés dans le dossier `.next/`.

**⏱️ Temps estimé : 2-5 minutes**

### 2.7. Redémarrer l'Application avec PM2

```bash
pm2 restart anireserve
```

PM2 est le gestionnaire de processus qui fait tourner ton application en arrière-plan.

### 2.8. Vérifier que Tout Fonctionne

```bash
# Voir les logs en temps réel
pm2 logs anireserve --lines 20

# Vérifier le statut
pm2 status

# Tester l'application localement
curl http://localhost:3000
```

---

## 🎯 Commande Rapide (Tout en Une)

### Sur ton Mac (pour pousser vers GitHub) :

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
git add .
git commit -m "Description des changements"
git push origin main
```

### Sur le Serveur (pour mettre à jour) :

```bash
ssh root@72.61.103.149 "cd /root/anireserve && git pull origin main && cd apps/web && npm install && npm run build && pm2 restart anireserve && pm2 logs anireserve --lines 10"
```

---

## ⚠️ En Cas de Problème

### Si le build échoue sur le serveur :

```bash
# Nettoyer le cache
cd /root/anireserve/apps/web
rm -rf .next
rm -rf node_modules

# Réinstaller
npm install
npm run build

# Redémarrer
pm2 restart anireserve
```

### Si PM2 ne démarre pas :

```bash
# Voir les erreurs détaillées
pm2 logs anireserve --err --lines 50

# Redémarrer depuis zéro
pm2 delete anireserve
cd /root/anireserve/apps/web
pm2 start npm --name "anireserve" -- start
pm2 save
```

### Si git pull échoue (conflits) :

```bash
# Sauvegarder les changements locaux
git stash

# Récupérer les changements
git pull origin main

# Réappliquer tes changements
git stash pop

# Résoudre les conflits manuellement si nécessaire
```

---

## ✅ Checklist de Vérification

Après avoir mis à jour le serveur, vérifie :

1. **L'application répond** :
   ```bash
   curl http://localhost:3000
   ```

2. **Nginx fonctionne** :
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Tester depuis le navigateur** :
   - Ouvrir https://anireserve.com
   - Vérifier que les nouvelles fonctionnalités sont présentes
   - Tester le bouton de thème
   - Tester le bouton "Laisser un avis"

---

## 📝 Exemple Complet

### Sur ton Mac :

```bash
# 1. Aller dans le projet
cd /Users/macbookpro/Desktop/aniresa/AniReserve

# 2. Vérifier les changements
git status

# 3. Ajouter tous les fichiers
git add .

# 4. Créer un commit
git commit -m "Ajout du bouton 'Laisser un avis' et correction du thème"

# 5. Pousser vers GitHub
git push origin main
```

### Sur le Serveur :

```bash
# 1. Se connecter
ssh root@72.61.103.149

# 2. Aller dans le projet
cd /root/anireserve

# 3. Récupérer les changements
git pull origin main

# 4. Aller dans le dossier web
cd apps/web

# 5. Installer les dépendances
npm install

# 6. Rebuild
npm run build

# 7. Redémarrer
pm2 restart anireserve

# 8. Vérifier
pm2 logs anireserve --lines 20
```

---

## 🔐 Notes Importantes

- ⚠️ **Ne jamais commiter les fichiers `.env`** : ils contiennent des informations sensibles
- ✅ **Toujours tester localement** avant de pousser vers GitHub
- ✅ **Vérifier les logs PM2** après chaque redémarrage
- ✅ **Faire des commits avec des messages clairs** pour faciliter le suivi

---

## 🆘 Besoin d'Aide ?

Si tu rencontres un problème :
1. Vérifie les logs : `pm2 logs anireserve`
2. Vérifie le statut : `pm2 status`
3. Vérifie Nginx : `sudo nginx -t`
4. Consulte les fichiers de documentation dans le projet




