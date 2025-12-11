# 🔐 Ajout de NEXTAUTH_SECRET sur le serveur

## Secret généré

```
NEXTAUTH_SECRET=Dd2LVLSUJlwIZ4w6Z2QgSGLgIV0UnEdvYHEcry39Qn4=
```

## Instructions sur le serveur

### 1. Éditer le fichier .env

```bash
cd /var/www/anireserve/apps/web
nano .env
```

### 2. Ajouter ou modifier ces lignes

```env
NEXTAUTH_URL="https://anireserve.com"
NEXTAUTH_SECRET="Dd2LVLSUJlwIZ4w6Z2QgSGLgIV0UnEdvYHEcry39Qn4="
```

### 3. Sauvegarder et quitter

- Appuyer sur `Ctrl + X`
- Puis `Y` pour confirmer
- Puis `Enter` pour sauvegarder

### 4. Vérifier que les variables sont correctes

```bash
npm run check-env
```

Vous devriez voir :
```
✅ Toutes les variables obligatoires sont présentes et valides!
```

### 5. Rebuilder et redémarrer

```bash
npm run build
pm2 delete anireserve
pm2 start ../../ecosystem.config.js
pm2 save
pm2 status
pm2 logs anireserve --lines 30 --nostream
```

## Vérification finale

Le script `check-env` devrait maintenant passer sans erreur, et le build devrait réussir.

---

**Note de sécurité:** Ce secret est maintenant dans votre `.env` local. Ne le partagez jamais publiquement et ne le commitez pas dans Git (le fichier `.env` est déjà dans `.gitignore`).
