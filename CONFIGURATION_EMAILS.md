# 📧 Configuration des Emails - AniReserve

## ✅ Ce qui a été configuré

### Emails automatiques lors de l'inscription d'un professionnel

1. **Email à l'admin** (`reservation@anireserve.com`)
   - Notification qu'un nouveau professionnel s'est inscrit
   - Contient toutes les informations du professionnel
   - Lien vers l'espace admin pour validation

2. **Email au professionnel**
   - Confirmation que son dossier est en cours de traitement
   - Informations sur les prochaines étapes
   - Délai de traitement (24-48h)

---

## 🔧 Configuration Requise

### 1. Obtenir une clé API Resend

1. Créer un compte sur [Resend.com](https://resend.com)
2. Aller dans "API Keys"
3. Créer une nouvelle clé API
4. Copier la clé (commence par `re_`)

### 2. Configurer la variable d'environnement

#### Sur le serveur VPS :

```bash
# Se connecter au serveur
ssh root@72.61.103.149

# Aller dans le projet
cd /root/anireserve/apps/web

# Éditer le fichier .env
nano .env

# Ajouter ou modifier cette ligne :
RESEND_API_KEY=re_votre_cle_api_ici

# Sauvegarder (Ctrl+O, puis Ctrl+X)

# Redémarrer l'application
pm2 restart anireserve
```

#### En local (développement) :

```bash
cd apps/web
nano .env

# Ajouter :
RESEND_API_KEY=re_votre_cle_api_ici
```

### 3. Vérifier le domaine d'envoi (Important)

Pour envoyer depuis `noreply@anireserve.com` :

1. Aller sur [Resend.com](https://resend.com/domains)
2. Ajouter le domaine `anireserve.com`
3. Configurer les enregistrements DNS (SPF, DKIM, DMARC)
4. Attendre la vérification du domaine

**Alternative** : Utiliser l'email par défaut de Resend (`onboarding@resend.dev`) pour les tests.

---

## 📋 Emails Configurés

### Lors de l'inscription d'un professionnel :

#### Email à l'admin (`reservation@anireserve.com`)
- **Sujet** : `🔔 Nouvelle inscription professionnel : [Nom]`
- **Contenu** :
  - Nom du professionnel
  - Email
  - Téléphone
  - Ville
  - Type de service
  - Description
  - Lien vers l'espace admin

#### Email au professionnel
- **Sujet** : `✅ Votre inscription AniReserve est en cours de traitement`
- **Contenu** :
  - Confirmation de réception
  - Statut : en cours de traitement
  - Prochaines étapes
  - Délai de traitement
  - Contact support

---

## 🧪 Test

### Tester l'envoi d'emails :

1. Créer un compte professionnel de test
2. Vérifier que vous recevez l'email sur `reservation@anireserve.com`
3. Vérifier que le professionnel reçoit l'email de confirmation

### En mode développement :

Si `RESEND_API_KEY` n'est pas configuré, les emails sont simulés dans la console :
```
📧 Email (simulé) - Notification admin : Nouveau professionnel inscrit
📧 Email (simulé) - Confirmation inscription envoyée au pro
```

---

## ⚙️ Variables d'Environnement

### Requises :

```env
RESEND_API_KEY=re_xxxxx
NEXT_PUBLIC_BASE_URL=https://anireserve.com
```

### Optionnelles :

```env
# URL de base pour les liens dans les emails
NEXT_PUBLIC_APP_URL=https://anireserve.com
```

---

## 🔍 Vérification

### Vérifier que les emails fonctionnent :

1. **Vérifier la clé API** :
   ```bash
   # Sur le serveur
   cd /root/anireserve/apps/web
   cat .env | grep RESEND_API_KEY
   ```

2. **Vérifier les logs** :
   ```bash
   pm2 logs anireserve | grep -i email
   ```

3. **Tester une inscription** :
   - Aller sur https://anireserve.com/pro/register
   - Créer un compte test
   - Vérifier les emails reçus

---

## 📝 Notes Importantes

- Les emails sont envoyés de manière **asynchrone** (ne bloquent pas l'inscription)
- Si l'envoi d'email échoue, l'inscription est quand même créée
- Les erreurs d'email sont loggées dans la console
- En développement, les emails sont simulés si la clé API n'est pas configurée

---

## 🆘 Dépannage

### Les emails ne sont pas envoyés :

1. **Vérifier la clé API** :
   - La clé doit commencer par `re_`
   - Vérifier qu'elle est bien dans `.env`

2. **Vérifier le domaine** :
   - Le domaine doit être vérifié sur Resend
   - Les DNS doivent être configurés

3. **Vérifier les logs** :
   ```bash
   pm2 logs anireserve --lines 50
   ```

4. **Tester avec l'email de test Resend** :
   - Utiliser `onboarding@resend.dev` temporairement
   - Modifier dans `lib/email.ts` si nécessaire

---

## ✅ Checklist

- [ ] Compte Resend créé
- [ ] Clé API obtenue
- [ ] Variable `RESEND_API_KEY` configurée sur le serveur
- [ ] Domaine `anireserve.com` vérifié sur Resend (ou utiliser email de test)
- [ ] Test d'inscription effectué
- [ ] Email reçu sur `reservation@anireserve.com`
- [ ] Email de confirmation reçu par le professionnel

---

**Status** : ✅ **Code prêt - Configuration Resend requise**



