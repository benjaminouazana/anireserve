# 🚀 Déploiement Rapide - AniReserve

## ⚡ Méthode la Plus Simple

### 1. Double-clique sur le fichier `deploy.sh`

Ou depuis le terminal :

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
./deploy.sh
```

### 2. Entre ton mot de passe SSH quand demandé

Le script va automatiquement :
- ✅ Se connecter au serveur
- ✅ Récupérer les derniers changements depuis GitHub
- ✅ Installer les nouvelles dépendances
- ✅ Rebuild l'application
- ✅ Redémarrer l'application avec PM2
- ✅ Afficher les logs

### 3. C'est tout ! 🎉

Ton site sera mis à jour sur https://anireserve.com

---

## 🔧 Si le script ne fonctionne pas

### Option 1 : Exécuter manuellement

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
bash deploy.sh
```

### Option 2 : Commandes manuelles

```bash
# 1. Se connecter au serveur
ssh root@72.61.103.149

# 2. Une fois connecté, exécuter :
cd /root/anireserve
git pull origin main
cd apps/web
npm install
npm run build
pm2 restart anireserve
pm2 logs anireserve --lines 20
```

---

## ⚠️ En cas d'erreur

Si tu vois une erreur, copie-colle le message d'erreur et je t'aiderai à le résoudre !

---

**Astuce** : Tu peux aussi faire un raccourci sur ton bureau pour le script `deploy.sh` pour un déploiement encore plus rapide ! 🎯
