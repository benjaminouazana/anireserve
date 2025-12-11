# 📋 Commandes pour copier les fichiers

## Sur votre Mac

Exécutez ces commandes une par une :

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve

scp apps/web/src/app/globals.css root@72.61.103.149:/var/www/anireserve/apps/web/src/app/globals.css

scp apps/web/src/app/layout.tsx root@72.61.103.149:/var/www/anireserve/apps/web/src/app/layout.tsx

scp apps/web/src/app/sitemap.ts root@72.61.103.149:/var/www/anireserve/apps/web/src/app/sitemap.ts
```

---

## Puis sur le serveur

Connectez-vous au serveur et exécutez :

```bash
ssh root@72.61.103.149

cd /var/www/anireserve/apps/web

npm run build

pm2 restart anireserve

pm2 save

sleep 10

pm2 status

netstat -tulpn | grep :3000

curl -I http://localhost:3000
```

---

## Version en une seule commande (serveur)

```bash
ssh root@72.61.103.149 "cd /var/www/anireserve/apps/web && npm run build && pm2 restart anireserve && pm2 save && sleep 10 && pm2 status && netstat -tulpn | grep :3000 && curl -I http://localhost:3000"
```

