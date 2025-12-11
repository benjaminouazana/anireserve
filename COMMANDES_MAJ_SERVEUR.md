# 🚀 Mettre à Jour le Serveur

## Commande Complète (Tout en Une)

Copiez-collez cette commande dans votre terminal :

```bash
ssh root@72.61.103.149 "cd /root/anireserve && git pull origin main && cd apps/web && npm install && npm run build && pm2 restart anireserve && pm2 logs anireserve --lines 10"
```

Entrez le mot de passe quand demandé.

---

## OU Étape par Étape

Si vous préférez faire étape par étape :

### 1. Se connecter au serveur
```bash
ssh root@72.61.103.149
```
Entrez le mot de passe.

### 2. Aller dans le projet
```bash
cd /root/anireserve
```

### 3. Récupérer les derniers changements
```bash
git pull origin main
```

### 4. Aller dans le dossier web
```bash
cd apps/web
```

### 5. Installer les dépendances
```bash
npm install
```

### 6. Rebuild l'application
```bash
npm run build
```

### 7. Redémarrer l'application
```bash
pm2 restart anireserve
```

### 8. Vérifier que ça fonctionne
```bash
pm2 status
pm2 logs anireserve --lines 20
```

---

## Après la Mise à Jour

1. Ouvrez https://anireserve.com
2. Faites **Ctrl+Shift+R** (ou Cmd+Shift+R sur Mac) pour forcer le rechargement
3. Vous verrez le nouveau logo avec l'ampoule

---

## Si Vous Ne Voyez Toujours Pas le Changement

### Vider le cache du navigateur :
- **Chrome/Edge** : Ctrl+Shift+Delete → Cocher "Images et fichiers en cache" → Effacer
- **Firefox** : Ctrl+Shift+Delete → Cocher "Cache" → Effacer
- **Safari** : Cmd+Option+E

### Ou utiliser la navigation privée :
- **Chrome** : Ctrl+Shift+N (Cmd+Shift+N sur Mac)
- **Firefox** : Ctrl+Shift+P (Cmd+Shift+P sur Mac)
- **Safari** : Cmd+Shift+N

---

## ✅ Vous Devriez Voir

- 💡 Une ampoule jaune à gauche
- "Ani" en vert turquoise
- Un trait jaune
- "RESERVE" en bleu foncé
- La phrase : "La plateforme de réservation en Israël<br/>Pour les Français"

---

**Note** : La mise à jour prend environ 2-3 minutes.








