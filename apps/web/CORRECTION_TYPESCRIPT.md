# Guide de correction des erreurs TypeScript

## Étape 1 : Identifier toutes les erreurs TypeScript

Sur le VPS, exécutez :

```bash
cd /root/anireserve/apps/web
npm run build 2>&1 | grep "Type error" > typescript-errors.txt
```

Ou en local :

```bash
cd apps/web
npm run build
```

## Étape 2 : Types d'erreurs courantes et solutions

### Erreur : "Parameter 'x' implicitly has an 'any' type"

**Solution** : Ajouter un type explicite

```typescript
// ❌ Avant
array.map((item) => item.id)

// ✅ Après
array.map((item: { id: number }) => item.id)
```

### Erreur : "Property 'x' does not exist on type '{}'"

**Solution** : Définir un type ou interface

```typescript
// ✅ Définir un type
type RatingData = {
  avg: number;
  count: number;
};

const data: RatingData = map.get(id) || { avg: 0, count: 0 };
```

### Erreur : "Route has an invalid export"

**Solution** : Utiliser la bonne signature pour Next.js 15

```typescript
// ✅ Pour les API routes
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}

// ✅ Pour les pages
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  // ...
}
```

## Étape 3 : Corriger progressivement

1. Corriger les erreurs une par une
2. Tester avec `npm run build` après chaque correction
3. Une fois toutes les erreurs corrigées, réactiver les checks dans `next.config.js`

## Étape 4 : Réactiver les checks

Dans `next.config.js`, changez :

```javascript
// ❌ Avant (temporaire)
eslint: {
  ignoreDuringBuilds: true,
},
typescript: {
  ignoreBuildErrors: true,
},

// ✅ Après (une fois les erreurs corrigées)
eslint: {
  ignoreDuringBuilds: false,
},
typescript: {
  ignoreBuildErrors: false,
},
```

## Fichiers à vérifier en priorité

- `src/app/api/**/*.ts` - Routes API
- `src/app/**/page.tsx` - Pages
- `src/lib/**/*.ts` - Utilitaires

