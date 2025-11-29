# 📤 Envoyer votre code sur GitHub

Votre dépôt est configuré : https://github.com/benjaminouazana/anireserve/

## 🔐 Authentification requise

GitHub demande une authentification. Deux options :

### Option 1 : Personal Access Token (Recommandé - Simple)

1. **Créer un token GitHub** :
   - Allez sur : https://github.com/settings/tokens
   - Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
   - Donnez un nom : `AniReserve`
   - Cochez la case **`repo`** (accès complet aux dépôts)
   - Cliquez sur **"Generate token"**
   - **⚠️ COPIEZ LE TOKEN** (vous ne le verrez qu'une fois !)

2. **Envoyer le code** :
   ```bash
   cd /Users/macbookpro/Desktop/aniresa/AniReserve
   git push -u origin main
   ```
   
   Quand il demande :
   - **Username** : `benjaminouazana`
   - **Password** : **Collez le token** (pas votre mot de passe GitHub)

### Option 2 : SSH (Plus sécurisé, mais plus complexe)

Si vous préférez SSH, je peux vous aider à configurer les clés SSH.

## ✅ Après l'envoi

Une fois le code envoyé, vous pourrez voir tous vos fichiers sur :
**https://github.com/benjaminouazana/anireserve/**

## 💡 Commandes pour les prochaines sauvegardes

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
git add .
git commit -m "Description de vos changements"
git push
```




