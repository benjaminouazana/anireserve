# 🚀 Créer le dépôt GitHub - Guide étape par étape

## Option 1 : Script automatique (Recommandé)

1. **Exécutez le script** :
   ```bash
   cd /Users/macbookpro/Desktop/aniresa/AniReserve
   ./setup-github.sh
   ```

2. **Suivez les instructions** affichées par le script

## Option 2 : Manuel (si le script ne fonctionne pas)

### Étape 1 : Créer le dépôt sur GitHub

1. Allez sur **https://github.com**
2. Connectez-vous (ou créez un compte si nécessaire)
3. Cliquez sur le bouton **"+"** en haut à droite
4. Sélectionnez **"New repository"**

### Étape 2 : Configurer le dépôt

- **Repository name** : `anireserve` (ou un autre nom)
- **Description** : `Plateforme de réservation entre professionnels et clients en Israël`
- **Visibilité** : 
  - ✅ **Private** (recommandé - votre code reste privé)
  - ⬜ Public (visible par tous)
- **IMPORTANT** : ⬜ **NE COCHEZ PAS** "Add a README file"
- **IMPORTANT** : ⬜ **NE COCHEZ PAS** "Add .gitignore"
- **IMPORTANT** : ⬜ **NE COCHEZ PAS** "Choose a license"

5. Cliquez sur **"Create repository"**

### Étape 3 : Connecter votre projet local

Une fois le dépôt créé, GitHub vous affichera des instructions. Utilisez celles-ci :

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve

# Ajouter le remote GitHub
git remote add origin https://github.com/VOTRE-USERNAME/anireserve.git

# Renommer la branche en 'main' (si nécessaire)
git branch -M main

# Envoyer le code
git push -u origin main
```

**Remplacez `VOTRE-USERNAME`** par votre nom d'utilisateur GitHub.

### Étape 4 : Vérifier

Allez sur votre dépôt GitHub, vous devriez voir tous vos fichiers !

## 🔐 Authentification GitHub

Si `git push` vous demande un mot de passe :

1. **Utilisez un Personal Access Token** (pas votre mot de passe) :
   - Allez sur : https://github.com/settings/tokens
   - Cliquez sur "Generate new token (classic)"
   - Donnez-lui un nom (ex: "AniReserve")
   - Cochez `repo` (accès complet aux dépôts)
   - Cliquez sur "Generate token"
   - **Copiez le token** (vous ne le verrez qu'une fois !)
   - Utilisez ce token comme mot de passe lors du `git push`

## ✅ Après la création

Votre code sera sauvegardé sur GitHub. Pour les prochaines sauvegardes :

```bash
git add .
git commit -m "Description de vos changements"
git push
```

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez que vous êtes connecté à GitHub
2. Vérifiez que l'URL du dépôt est correcte
3. Vérifiez que vous avez les permissions d'écriture








