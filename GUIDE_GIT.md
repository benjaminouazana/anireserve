# Guide Git - Mettre à jour GitHub depuis le terminal

## 📋 Commandes Git essentielles

### 1. Vérifier l'état actuel

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
git status
```

Cette commande vous montre :
- Les fichiers modifiés
- Les fichiers non suivis (nouveaux)
- Les fichiers prêts à être commités

### 2. Ajouter les fichiers modifiés

```bash
# Ajouter tous les fichiers modifiés
git add .

# Ou ajouter un fichier spécifique
git add nom-du-fichier.js

# Ou ajouter plusieurs fichiers
git add fichier1.js fichier2.js
```

### 3. Vérifier ce qui sera commité

```bash
git status
```

Vous verrez les fichiers en vert qui seront inclus dans le commit.

### 4. Créer un commit (sauvegarder les changements)

```bash
git commit -m "Description de vos changements"
```

**Exemples de messages de commit** :
```bash
git commit -m "fix: Corriger le bug de connexion"
git commit -m "feat: Ajouter nouvelle fonctionnalité de recherche"
git commit -m "docs: Mettre à jour la documentation"
git commit -m "style: Améliorer le design du header"
```

### 5. Pousser vers GitHub

```bash
git push origin main
```

**Si c'est la première fois** ou si vous avez des problèmes d'authentification :
```bash
# Avec HTTPS (vous devrez entrer votre username/password ou token)
git push origin main

# Avec SSH (si vous avez configuré une clé SSH)
git push origin main
```

## 🔄 Workflow complet (exemple)

```bash
# 1. Aller dans le dossier du projet
cd /Users/macbookpro/Desktop/aniresa/AniReserve

# 2. Vérifier l'état
git status

# 3. Ajouter tous les changements
git add .

# 4. Créer un commit avec un message descriptif
git commit -m "feat: Ajouter nouvelle page de contact"

# 5. Pousser vers GitHub
git push origin main
```

## 📥 Récupérer les changements depuis GitHub

Si quelqu'un d'autre a fait des changements ou si vous travaillez sur plusieurs machines :

```bash
# Récupérer les changements
git pull origin main

# Ou en deux étapes
git fetch origin
git merge origin/main
```

## 🔍 Voir l'historique des commits

```bash
# Voir les derniers commits
git log

# Voir les commits de manière compacte
git log --oneline

# Voir les 10 derniers commits
git log -10
```

## 🚨 En cas de conflit

Si `git pull` ou `git push` indique un conflit :

```bash
# 1. Récupérer les changements
git pull origin main

# 2. Résoudre les conflits dans les fichiers
# (Git vous indiquera quels fichiers ont des conflits)

# 3. Après avoir résolu les conflits, ajouter les fichiers
git add .

# 4. Finaliser le merge
git commit -m "Merge: Résolution des conflits"

# 5. Pousser
git push origin main
```

## 🔐 Configuration Git (si nécessaire)

### Vérifier votre configuration

```bash
git config --global user.name
git config --global user.email
```

### Configurer votre nom et email

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

## 📝 Exemples pratiques

### Exemple 1 : Modifier un fichier et le pousser

```bash
# 1. Modifier un fichier (avec votre éditeur)
nano apps/web/src/app/page.tsx

# 2. Vérifier les changements
git status

# 3. Ajouter le fichier
git add apps/web/src/app/page.tsx

# 4. Commiter
git commit -m "fix: Corriger le bug sur la page d'accueil"

# 5. Pousser
git push origin main
```

### Exemple 2 : Ajouter un nouveau fichier

```bash
# 1. Créer un nouveau fichier
touch nouveau-fichier.js

# 2. Ajouter le fichier
git add nouveau-fichier.js

# 3. Commiter
git commit -m "feat: Ajouter nouveau composant"

# 4. Pousser
git push origin main
```

### Exemple 3 : Mettre à jour depuis GitHub

```bash
# Si vous avez fait des changements sur GitHub ou sur une autre machine
git pull origin main
```

## 🎯 Commandes rapides (cheat sheet)

```bash
# Voir l'état
git status

# Ajouter tout
git add .

# Commiter
git commit -m "votre message"

# Pousser
git push origin main

# Récupérer
git pull origin main

# Voir les différences
git diff

# Annuler les changements non commités (ATTENTION !)
git checkout -- nom-du-fichier

# Annuler le dernier commit (garder les fichiers)
git reset --soft HEAD~1

# Voir l'historique
git log --oneline
```

## 🔒 Authentification GitHub

### Option 1 : Token d'accès personnel (recommandé)

1. Allez sur GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Créez un nouveau token avec les permissions `repo`
3. Utilisez ce token comme mot de passe quand Git vous le demande

### Option 2 : SSH (plus sécurisé)

```bash
# Générer une clé SSH
ssh-keygen -t ed25519 -C "votre.email@example.com"

# Copier la clé publique
cat ~/.ssh/id_ed25519.pub

# Ajouter la clé sur GitHub → Settings → SSH and GPG keys
```

## ✅ Checklist avant de pousser

- [ ] J'ai testé mes changements localement
- [ ] J'ai vérifié avec `git status` ce qui sera commité
- [ ] Mon message de commit est clair et descriptif
- [ ] J'ai fait un `git pull` pour récupérer les derniers changements
- [ ] Je suis prêt à pousser avec `git push origin main`

## 🚨 Erreurs courantes et solutions

### Erreur : "fatal: not a git repository"

**Solution** : Vous n'êtes pas dans le bon dossier
```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
```

### Erreur : "Permission denied (publickey)"

**Solution** : Configurez SSH ou utilisez HTTPS avec un token
```bash
# Vérifier votre remote
git remote -v

# Si c'est SSH, configurez votre clé SSH
# Si c'est HTTPS, utilisez un token GitHub
```

### Erreur : "Updates were rejected"

**Solution** : Récupérez d'abord les changements
```bash
git pull origin main
# Résolvez les conflits si nécessaire
git push origin main
```

## 📚 Ressources

- Documentation Git : https://git-scm.com/doc
- GitHub Guides : https://guides.github.com
- Git Cheat Sheet : https://education.github.com/git-cheat-sheet-education.pdf

