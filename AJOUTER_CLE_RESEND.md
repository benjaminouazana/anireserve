# 🔑 Ajouter la Clé API Resend sur le Serveur

## ✅ Votre Clé API Resend

```
re_YaufuMTW_LVJ8N4CdbffuSEVU6B1EYMrx
```

---

## 🚀 Commandes à Exécuter sur le Serveur

### Option 1 : Commande Rapide (Tout en Une)

```bash
ssh root@72.61.103.149 "cd /root/anireserve/apps/web && sed -i 's/RESEND_API_KEY=.*/RESEND_API_KEY=re_YaufuMTW_LVJ8N4CdbffuSEVU6B1EYMrx/' .env || echo 'RESEND_API_KEY=re_YaufuMTW_LVJ8N4CdbffuSEVU6B1EYMrx' >> .env && pm2 restart anireserve && echo '✅ Clé API mise à jour et application redémarrée'"
```

### Option 2 : Étape par Étape

```bash
# 1. Se connecter au serveur
ssh root@72.61.103.149

# 2. Aller dans le dossier web
cd /root/anireserve/apps/web

# 3. Vérifier si .env existe
ls -la .env

# 4. Mettre à jour la clé API (remplace l'ancienne si elle existe)
sed -i 's/RESEND_API_KEY=.*/RESEND_API_KEY=re_YaufuMTW_LVJ8N4CdbffuSEVU6B1EYMrx/' .env

# OU si la ligne n'existe pas, l'ajouter :
if ! grep -q "RESEND_API_KEY" .env; then
  echo 'RESEND_API_KEY=re_YaufuMTW_LVJ8N4CdbffuSEVU6B1EYMrx' >> .env
fi

# OU éditer manuellement :
nano .env
# Modifier ou ajouter la ligne : RESEND_API_KEY=re_YaufuMTW_LVJ8N4CdbffuSEVU6B1EYMrx
# Sauvegarder : Ctrl+O, puis Ctrl+X

# 5. Vérifier que la clé est bien ajoutée
cat .env | grep RESEND_API_KEY

# 6. Redémarrer l'application
pm2 restart anireserve

# 7. Vérifier les logs
pm2 logs anireserve --lines 20
```

---

## ✅ Vérification

### Vérifier que la clé est bien configurée :

```bash
# Sur le serveur
cd /root/anireserve/apps/web
cat .env | grep RESEND_API_KEY
```

**Résultat attendu** :
```
RESEND_API_KEY=re_YaufuMTW_LVJ8N4CdbffuSEVU6B1EYMrx
```

---

## 🧪 Test

### Tester l'envoi d'emails :

1. Aller sur https://anireserve.com/pro/register
2. Créer un compte professionnel de test
3. Vérifier que vous recevez l'email sur `reservation@anireserve.com`
4. Vérifier que le professionnel reçoit l'email de confirmation

### Vérifier les logs :

```bash
pm2 logs anireserve | grep -i email
```

---

## ⚠️ Important

- La clé API est **sensible**, ne la partagez pas publiquement
- Assurez-vous que le fichier `.env` n'est pas commité dans Git (il devrait être dans `.gitignore`)
- Après ajout de la clé, **redémarrer PM2** pour que les changements prennent effet

---

## 🔒 Sécurité

Le fichier `.env` contient des informations sensibles. Assurez-vous qu'il est bien protégé :

```bash
# Vérifier les permissions
chmod 600 /root/anireserve/apps/web/.env

# Vérifier que .env est dans .gitignore
cat /root/anireserve/.gitignore | grep .env
```

---

**Status** : ✅ **Clé API fournie - À ajouter sur le serveur**

