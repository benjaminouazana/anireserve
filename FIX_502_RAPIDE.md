# 🚨 Fix Rapide Erreur 502

## 🔍 Diagnostic Immédiat

L'erreur 502 signifie que **Nginx ne peut pas communiquer avec l'application Next.js**.

## 🚀 Solution Rapide (à exécuter sur le serveur)

```bash
ssh root@VOTRE_IP

# 1. Vérifier PM2
pm2 status

# 2. Si l'app n'est pas "online", redémarrer
cd /var/www/anireserve/apps/web
pm2 delete anireserve
pm2 start ecosystem.config.js
pm2 save

# 3. Attendre 10 secondes
sleep 10

# 4. Vérifier que le port 3000 est utilisé
netstat -tulpn | grep :3000

# 5. Tester l'application directement
curl http://localhost:3000

# 6. Si ça ne fonctionne pas, vérifier les logs
pm2 logs anireserve --lines 50
```

---

## 🔧 Si l'Application Ne Démarre Pas

### Vérifier les erreurs dans les logs

```bash
pm2 logs anireserve --lines 100
```

### Causes courantes:

1. **Build manquant:**
   ```bash
   cd /var/www/anireserve/apps/web
   ls -la .next
   # Si n'existe pas:
   npm run build
   ```

2. **Variables d'environnement manquantes:**
   ```bash
   cd /var/www/anireserve/apps/web
   ls -la .env
   cat .env | grep DATABASE_URL
   ```

3. **Erreur de connexion DB:**
   ```bash
   # Vérifier la connexion
   cd /var/www/anireserve/apps/web
   npx prisma db pull
   ```

4. **Port 3000 déjà utilisé:**
   ```bash
   lsof -i :3000
   # Tuer le processus si nécessaire
   kill -9 PID
   ```

---

## 🔄 Redémarrage Complet

```bash
cd /var/www/anireserve/apps/web

# 1. Arrêter tout
pm2 delete anireserve
lsof -ti:3000 | xargs kill -9 2>/dev/null

# 2. Vérifier le build
if [ ! -d .next ]; then
    echo "Build manquant, construction..."
    npm run build
fi

# 3. Vérifier .env
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env manquant!"
    exit 1
fi

# 4. Redémarrer
pm2 start ecosystem.config.js
pm2 save

# 5. Attendre et vérifier
sleep 10
pm2 status
curl -I http://localhost:3000
```

---

## 📋 Checklist

- [ ] PM2 montre l'app comme "online"
- [ ] Le port 3000 est utilisé
- [ ] `curl http://localhost:3000` fonctionne
- [ ] Les logs PM2 ne montrent pas d'erreurs critiques
- [ ] Le fichier `.env` existe
- [ ] Le dossier `.next` existe

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

### Envoyer ces informations:

```bash
# 1. Statut PM2
pm2 status

# 2. Logs PM2
pm2 logs anireserve --lines 50

# 3. Port 3000
netstat -tulpn | grep :3000

# 4. Test local
curl -v http://localhost:3000

# 5. Logs Nginx
tail -50 /var/log/nginx/error.log

# 6. Vérification build
ls -la /var/www/anireserve/apps/web/.next
```

---

**Action immédiate:** Exécuter le redémarrage complet ci-dessus sur le serveur.

