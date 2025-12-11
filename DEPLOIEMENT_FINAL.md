# Déploiement final - AniReserve
## Guide pas à pas pour mettre votre site en ligne

---

## 🚨 ÉTAPE 1 : Corriger le DNS (ACTION REQUISE)

### Dans Hostinger

1. **Se connecter à Hostinger** : https://hpanel.hostinger.com
2. **Aller dans Domaines** → `anireserve.com`
3. **Désactiver l'hébergement web** :
   - Si vous voyez "Site web", "WordPress" ou "Hébergement" → Désactivez-le
   - Le domaine doit UNIQUEMENT utiliser les enregistrements DNS
4. **Vérifier les enregistrements DNS** :
   - Type A, Nom `@`, Contenu `72.61.103.149` ✅ (garder)
   - Type CNAME, Nom `www`, Contenu `anireserve.com` ✅ (garder)
   - Tous les autres enregistrements pointant vers 89.117.169.211 → ❌ Supprimer
5. **Désactiver tout CDN/Proxy** si présent
6. **Sauvegarder les modifications**

### Attendre la propagation DNS (10-30 minutes)

Vérifiez toutes les 5-10 minutes :

```bash
# Depuis votre Mac ou le VPS
dig anireserve.com +short
# Doit retourner UNIQUEMENT : 72.61.103.149
```

Quand c'est bon, passez à l'étape 2.

---

## ✅ ÉTAPE 2 : Déployer les correctifs sur le VPS

### Se connecter au VPS

```bash
ssh root@72.61.103.149
```

### Mettre à jour le code

```bash
cd /root/anireserve
git pull origin main
```

Vous devriez voir :
```
Updating a9898ab..58da552
Fast-forward
 apps/web/next.config.js                        |   10 +-
 apps/web/src/components/Button.tsx             |   61 +++
 apps/web/src/components/EmptyState.tsx         |   35 ++
 apps/web/src/components/ErrorBoundary.tsx      |   53 +++
 apps/web/src/components/LoadingSpinner.tsx     |   42 ++
 apps/web/src/components/OptimizedImage.tsx     |   58 +++
 apps/web/src/components/Toast.tsx              |   75 ++++
 ... + documentation
```

### Installer les dépendances et rebuild

```bash
cd apps/web
npm install
npm run build
```

Le build devrait réussir en ~2-3 minutes.

### Redémarrer l'application avec PM2

```bash
pm2 restart anireserve
pm2 logs anireserve --lines 10
```

Vous devriez voir :
```
✓ Ready in 400-600ms
```

### Vérifier que le site fonctionne

```bash
# Test local
curl http://localhost:3000

# Test via Nginx
curl -I http://anireserve.com
```

Vous devriez voir un code HTTP 200.

---

## 🔒 ÉTAPE 3 : Configurer SSL avec Certbot

### Préparer le dossier webroot

```bash
sudo mkdir -p /var/www/html/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

### Obtenir les certificats SSL

```bash
sudo certbot certonly --webroot -w /var/www/html -d anireserve.com -d www.anireserve.com
```

**Questions Certbot** :
1. Email : Entrez votre email
2. Accepter les termes : `Y`
3. Partager l'email avec EFF : `N` (optionnel)

**Résultat attendu** :
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/anireserve.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/anireserve.com/privkey.pem
```

### Vérifier les certificats

```bash
sudo ls -la /etc/letsencrypt/live/anireserve.com/
```

Vous devriez voir :
- `fullchain.pem`
- `privkey.pem`
- `chain.pem`

---

## 🌐 ÉTAPE 4 : Configurer Nginx avec SSL

### Backup de l'ancienne configuration

```bash
sudo cp /etc/nginx/sites-available/anireserve.com /etc/nginx/sites-available/anireserve.com.backup
```

### Appliquer la nouvelle configuration

```bash
cd /root/anireserve
sudo cp nginx-ssl-final.conf /etc/nginx/sites-available/anireserve.com
```

### Tester la configuration

```bash
sudo nginx -t
```

Résultat attendu :
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Recharger Nginx

```bash
sudo systemctl reload nginx
sudo systemctl status nginx
```

Nginx doit être `active (running)`.

---

## ✅ ÉTAPE 5 : Vérifier que tout fonctionne

### Test 1 : HTTPS fonctionne

```bash
curl -I https://anireserve.com
```

Résultat attendu : Code 200 avec headers de sécurité.

### Test 2 : Redirection HTTP → HTTPS

```bash
curl -I http://anireserve.com
```

Résultat attendu : Code 301 avec `Location: https://anireserve.com/`.

### Test 3 : www fonctionne

```bash
curl -I https://www.anireserve.com
```

Résultat attendu : Code 200.

### Test 4 : Ouvrir dans le navigateur

1. Allez sur **https://anireserve.com**
2. Vérifiez le cadenas 🔒 dans la barre d'adresse
3. Le logo "Ani RESERVE" doit s'afficher (plus d'erreurs 404)
4. Testez la recherche de professionnels
5. Testez l'inscription/connexion

### Test 5 : Vérifier les logs

```bash
# Logs PM2
pm2 logs anireserve --lines 50

# Logs Nginx
sudo tail -f /var/log/nginx/anireserve_error.log
```

Il ne devrait PAS y avoir :
- ❌ Erreurs logo.png/logo.jpg
- ❌ Erreurs de connexion à la base de données
- ❌ Erreurs TypeScript critiques

### Test 6 : Tester le renouvellement automatique SSL

```bash
sudo certbot renew --dry-run
```

Résultat attendu :
```
Congratulations, all simulated renewals succeeded
```

---

## 🎯 ÉTAPE 6 : Tests fonctionnels complets

Suivez le guide complet : `GUIDE_TESTS.md`

### Tests prioritaires (15 minutes)

1. **Page d'accueil** : Charge correctement ✅
2. **Recherche** : Trouve des professionnels ✅
3. **Page professionnel** : Affiche les infos + calendrier ✅
4. **Inscription client** : Fonctionne ✅
5. **Connexion client** : Fonctionne ✅
6. **Réservation** : Processus complet fonctionne ✅
7. **Dashboard professionnel** : Accessible après connexion ✅

### Si un test échoue

1. Vérifiez les logs : `pm2 logs anireserve --lines 100`
2. Vérifiez les variables d'environnement : `cat /root/anireserve/apps/web/.env`
3. Consultez le guide de dépannage dans `RECAP_FINAL.md`

---

## 📊 ÉTAPE 7 : Monitoring et maintenance

### Configurer PM2 pour le démarrage automatique

```bash
pm2 save
sudo pm2 startup
```

Suivez les instructions affichées.

### Configurer la rotation des logs PM2

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
pm2 save
```

### Vérifier l'espace disque

```bash
df -h
```

Vous devriez avoir au moins 5-10 GB libres.

### Surveiller les ressources

```bash
# CPU et RAM
pm2 monit

# Statut général
pm2 status
```

---

## 🎉 FÉLICITATIONS !

Si vous êtes arrivé ici, votre site **AniReserve** est maintenant :

✅ **En ligne** : https://anireserve.com  
✅ **Sécurisé** : SSL/TLS avec certificat valide  
✅ **Optimisé** : Performance, UX, accessibilité  
✅ **Documenté** : 9 guides complets disponibles  
✅ **Maintenable** : Script de déploiement automatisé  
✅ **Monitoré** : PM2 + Logs configurés  

---

## 📂 Récapitulatif des fichiers de documentation

Tous les guides sont disponibles à la racine du projet :

1. **AUDIT_COMPLET.md** - Liste complète des problèmes identifiés
2. **CORRECTIONS_APPLIQUEES.md** - État des corrections
3. **CORRECTION_TYPESCRIPT.md** - Guide pour corriger TypeScript
4. **ENV_VARIABLES.md** - Documentation des variables d'environnement
5. **OPTIMISATIONS_APPLIQUEES.md** - Détail des optimisations
6. **GUIDE_TESTS.md** - Checklist de tests complète (100+ tests)
7. **INSTRUCTIONS_SSL.md** - Guide détaillé pour SSL
8. **RECAP_FINAL.md** - Récapitulatif complet du projet
9. **DEPLOIEMENT_FINAL.md** - Ce fichier (guide pas à pas)
10. **deploy.sh** - Script de déploiement automatisé

---

## 🚀 Déploiements futurs (mises à jour)

Pour déployer une nouvelle version de votre site :

```bash
# Sur le VPS
cd /root/anireserve
./deploy.sh
```

Le script va automatiquement :
1. Récupérer les modifications depuis GitHub
2. Installer les dépendances
3. Générer Prisma Client
4. Builder l'application
5. Redémarrer PM2
6. Vérifier que tout fonctionne

**Simple et automatisé !** 💪

---

## 📞 Support

### En cas de problème

1. **Consultez les logs** : `pm2 logs anireserve`
2. **Vérifiez le statut** : `pm2 status && sudo systemctl status nginx`
3. **Consultez les guides** : Tous les problèmes courants sont documentés
4. **Restaurez si nécessaire** : Les backups sont dans `/root/anireserve/apps/web/.next.backup.*`

### Commandes utiles

```bash
# Redémarrer l'application
pm2 restart anireserve

# Voir les logs en temps réel
pm2 logs anireserve

# Vérifier Nginx
sudo nginx -t
sudo systemctl status nginx

# Vérifier SSL
sudo certbot certificates

# Espace disque
df -h

# Processus et ressources
htop
```

---

## 🎯 Prochaines améliorations (optionnelles)

Une fois le site en ligne, vous pourrez :

1. **Corriger les erreurs TypeScript** (voir `CORRECTION_TYPESCRIPT.md`)
2. **Ajouter des tests automatisés** (Jest, Playwright)
3. **Configurer un système de backup automatique**
4. **Mettre en place un monitoring avancé** (Sentry, LogRocket)
5. **Optimiser encore plus** (Service Worker, mode offline)
6. **Ajouter le mode sombre**
7. **Implémenter des notifications push**

Mais pour l'instant : **profitez de votre site en ligne !** 🎊

---

**Temps total estimé pour le déploiement : 1-2 heures**  
(En fonction de la propagation DNS)

**Bonne chance ! 🚀**









