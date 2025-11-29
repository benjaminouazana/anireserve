# 📸 Ajouter le Logo

## Instructions

1. **Place ton image de logo** dans le dossier :
   ```
   apps/web/public/logo.png
   ```

   Ou si c'est un autre format :
   - `logo.jpg`
   - `logo.svg`
   - `logo.webp`

2. **Si le fichier a un nom différent**, dis-moi le nom et je modifierai le composant.

3. **Formats supportés** :
   - PNG (recommandé)
   - JPG/JPEG
   - SVG
   - WEBP

## Après avoir ajouté l'image

Le logo s'affichera automatiquement sur :
- La page d'accueil
- Toutes les pages qui utilisent le composant `<Logo />`

## Personnalisation

Si tu veux ajuster la taille du logo, tu peux modifier les props `width` et `height` :

```tsx
<Logo width={250} height={100} />
```




