# Installation de bcryptjs

## Installer le package

Dans le terminal, à la racine de `AniReserve` :

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
npm install bcryptjs --workspace web
npm install -D @types/bcryptjs --workspace web
```

## Redémarrer le serveur

Après l'installation, redémarre le serveur Next.js :

```bash
npm run dev --workspace web
```

## Mettre à jour le mot de passe existant

Le professionnel `sarah@example.com` a encore un mot de passe en clair. Pour le hasher :

```bash
node create-pro.js
```

Ça va créer un nouveau professionnel avec mot de passe hashé, ou tu peux utiliser Prisma Studio pour mettre à jour le mot de passe existant.













