# 📸 Instructions pour Ajouter le Logo

## 📁 Emplacement des Fichiers

Pour que le logo et le favicon fonctionnent correctement, vous devez placer votre image de logo dans les emplacements suivants :

### 1. Logo Principal
**Chemin** : `/apps/web/public/logo.png`

- Format recommandé : PNG avec fond transparent ou blanc
- Taille recommandée : 400x200px minimum (ratio 2:1)
- Le logo sera utilisé dans le header du site

### 2. Favicon
**Chemin** : `/apps/web/public/favicon.ico`

- Format : ICO (ou PNG converti en ICO)
- Taille : 32x32px, 64x64px, ou 128x128px
- Le favicon apparaîtra dans l'onglet du navigateur

### 3. Icônes Apple (Optionnel)
**Chemin** : `/apps/web/public/logo.png` (même fichier que le logo)

- Utilisé pour les icônes sur les appareils Apple
- Taille recommandée : 180x180px minimum

---

## 🔧 Conversion en Favicon

Si vous avez une image PNG et que vous voulez la convertir en ICO :

### Option 1 : En ligne
1. Allez sur https://convertio.co/png-ico/ ou https://favicon.io/favicon-converter/
2. Uploadez votre logo PNG
3. Téléchargez le fichier `.ico`
4. Placez-le dans `/apps/web/public/favicon.ico`

### Option 2 : Avec ImageMagick (si installé)
```bash
convert logo.png -resize 32x32 favicon.ico
```

---

## ✅ Vérification

Une fois les fichiers placés :

1. **Logo** : Le logo devrait apparaître dans le header du site
2. **Favicon** : Rafraîchissez la page (Ctrl+F5 ou Cmd+Shift+R) pour voir le favicon dans l'onglet

---

## 📝 Notes

- Le composant `Logo.tsx` cherche automatiquement plusieurs formats :
  - `/logo.png` (priorité)
  - `/logo.jpg`
  - `/logo.jpeg`
  - `/logo.svg`
  - `/logo.webp`

- Si aucun logo n'est trouvé, un logo texte avec les couleurs de la charte sera affiché automatiquement.

---

**Dernière mise à jour** : $(date)

