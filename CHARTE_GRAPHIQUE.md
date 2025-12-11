# 🎨 Charte Graphique AniReserve

## Couleurs Principales

- **Bleu foncé** : `#18223b` - Couleur principale, textes, fonds sombres
- **Teal/Vert** : `#2FB190` - Couleur secondaire, accents, bordures, liens
- **Jaune** : `#FFDE59` - Couleur d'accent, highlights, CTA

## Application

### ✅ Modifications Effectuées

1. **Logo** : Fallback textuel avec les couleurs de la charte
2. **Footer** : Fond `#18223b`, titres `#FFDE59`, liens `#2FB190`
3. **Page d'accueil** : 
   - Background avec dégradé utilisant les 3 couleurs
   - Boutons avec bordures `#2FB190`
   - Hover effects avec `#2FB190` et `#FFDE59`
4. **Formulaires** : Bordures `#2FB190`, focus `#18223b`
5. **Tailwind Config** : Couleurs ajoutées dans la config

### 📝 À Faire

- Vérifier tous les boutons de soumission
- Mettre à jour les cartes de professionnels
- Vérifier les pages de login/register
- Mettre à jour les autres pages du site

## Utilisation dans le Code

```tsx
// Couleurs inline
style={{ color: "#18223b" }}
style={{ backgroundColor: "#2FB190" }}
style={{ borderColor: "#FFDE59" }}

// Classes Tailwind (si configurées)
className="text-primary-dark"
className="bg-primary"
className="border-accent"
```











