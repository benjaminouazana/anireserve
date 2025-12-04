# 🔗 Configuration Webhooks Resend - AniReserve

## ✅ Ce qui a été créé

### 1. **Système de Templates d'Emails** (16 scénarios)
- Templates HTML professionnels avec design cohérent
- Tous les scénarios possibles couverts
- Design responsive et moderne

### 2. **Route Webhook** (`/api/webhooks/resend`)
- Reçoit tous les événements Resend
- Gère tous les types d'événements
- Logging et tracking complet

---

## 📧 Templates Créés (16 scénarios)

### Inscription & Validation
1. ✅ **Nouvelle inscription professionnel** → Admin
2. ✅ **Confirmation inscription** → Professionnel
3. ✅ **Profil validé** → Professionnel
4. ✅ **Profil rejeté** → Professionnel

### Réservations
5. ✅ **Demande de réservation** → Client
6. ✅ **Nouvelle demande** → Professionnel
7. ✅ **Réservation confirmée** → Client
8. ✅ **Réservation confirmée** → Professionnel
9. ✅ **Réservation annulée** → Client
10. ✅ **Réservation annulée** → Professionnel
11. ✅ **Rappel de réservation** → Client/Pro

### Authentification
12. ✅ **Réinitialisation mot de passe** → Client
13. ✅ **Réinitialisation mot de passe** → Professionnel

### Interactions
14. ✅ **Nouvel avis** → Professionnel
15. ✅ **Nouveau favori** → Professionnel
16. ✅ **Nouveau message** → Client/Pro

---

## 🔗 Configuration du Webhook sur Resend

### Étape 1 : Accéder à Resend Dashboard

1. Aller sur [resend.com](https://resend.com)
2. Se connecter à votre compte
3. Aller dans **"Webhooks"** dans le menu

### Étape 2 : Créer un Nouveau Webhook

1. Cliquer sur **"Add Webhook"**
2. Remplir les informations :

**URL du Webhook** :
```
https://anireserve.com/api/webhooks/resend
```

**Événements à écouter** (cocher tous) :
- ✅ `email.sent` - Email envoyé
- ✅ `email.delivered` - Email livré
- ✅ `email.delivery_delayed` - Email en retard
- ✅ `email.complained` - Plainte (spam)
- ✅ `email.bounced` - Email rebondi
- ✅ `email.opened` - Email ouvert
- ✅ `email.clicked` - Lien cliqué
- ✅ `email.unsubscribed` - Désabonnement

**Secret** (optionnel mais recommandé) :
- Générer un secret aléatoire
- L'ajouter dans `.env` comme `RESEND_WEBHOOK_SECRET`

### Étape 3 : Tester le Webhook

1. Resend enverra un événement de test
2. Vérifier les logs sur le serveur :
```bash
pm2 logs anireserve | grep -i webhook
```

---

## 🔧 Configuration sur le Serveur

### Ajouter le Secret du Webhook (optionnel)

```bash
ssh root@72.61.103.149
cd /root/anireserve/apps/web
nano .env

# Ajouter :
RESEND_WEBHOOK_SECRET=votre_secret_ici

# Sauvegarder et redémarrer
pm2 restart anireserve
```

### Vérifier que le Webhook est Accessible

```bash
curl https://anireserve.com/api/webhooks/resend
```

**Résultat attendu** :
```json
{
  "message": "Webhook Resend actif",
  "endpoint": "/api/webhooks/resend",
  "events": [...]
}
```

---

## 📊 Événements Gérés

### 1. `email.sent`
- **Quand** : Email envoyé avec succès
- **Action** : Log dans la console
- **Utilisation** : Confirmer l'envoi

### 2. `email.delivered`
- **Quand** : Email livré dans la boîte de réception
- **Action** : Mettre à jour le statut dans la DB
- **Utilisation** : Tracking de livraison

### 3. `email.delivery_delayed`
- **Quand** : Email en retard de livraison
- **Action** : Logger pour investigation
- **Utilisation** : Détecter les problèmes

### 4. `email.bounced`
- **Quand** : Email rebondi (adresse invalide)
- **Action** : Marquer l'email comme invalide
- **Utilisation** : Nettoyer la base de données

### 5. `email.complained`
- **Quand** : Utilisateur a signalé comme spam
- **Action** : Marquer comme désabonné
- **Utilisation** : Respecter les préférences

### 6. `email.opened`
- **Quand** : Email ouvert par le destinataire
- **Action** : Tracker les ouvertures
- **Utilisation** : Analytics et engagement

### 7. `email.clicked`
- **Quand** : Lien cliqué dans l'email
- **Action** : Tracker les clics
- **Utilisation** : Mesurer l'efficacité

### 8. `email.unsubscribed`
- **Quand** : Utilisateur s'est désabonné
- **Action** : Marquer comme désabonné
- **Utilisation** : Respecter le RGPD

---

## 🎨 Design des Templates

Tous les templates utilisent :
- ✅ Design cohérent avec le branding AniReserve
- ✅ Header avec logo et tagline
- ✅ Couleurs personnalisées par type d'email
- ✅ Footer avec liens et informations
- ✅ Responsive (mobile-friendly)
- ✅ Boutons d'action clairs

### Couleurs par Type :
- **Inscription/Admin** : Vert (#2FB190)
- **Validation** : Vert clair (#10b981)
- **Rejet/Annulation** : Rouge (#ef4444)
- **Réservations** : Violet (#7c3aed) / Rose (#ec4899)
- **Rappels** : Orange (#f59e0b)
- **Authentification** : Violet (#7c3aed) / Rose (#ec4899)
- **Interactions** : Orange (#f59e0b) / Rose (#ec4899)

---

## 🧪 Test des Webhooks

### Test Manuel

1. **Envoyer un email de test** :
   - Créer une inscription professionnel
   - Vérifier les logs : `pm2 logs anireserve`

2. **Vérifier les événements** :
   - Aller sur Resend Dashboard → Webhooks
   - Voir les événements reçus

3. **Tester le webhook directement** :
```bash
curl -X POST https://anireserve.com/api/webhooks/resend \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email.sent",
    "data": {
      "email_id": "test-123",
      "to": ["test@example.com"],
      "subject": "Test"
    }
  }'
```

---

## 📝 Utilisation des Templates

### Exemple : Envoyer un email avec template

```typescript
import { sendEmailWithTemplate } from "@/lib/email";
import { emailTemplates } from "@/lib/email-templates";

// Envoyer un email de validation
await sendEmailWithTemplate(
  "pro@example.com",
  emailTemplates.professionalValidated,
  { professionalName: "Jean Dupont" }
);
```

### Tous les Templates Disponibles

```typescript
emailTemplates.newProfessionalAdmin
emailTemplates.professionalRegistrationConfirmation
emailTemplates.professionalValidated
emailTemplates.professionalRejected
emailTemplates.bookingRequestClient
emailTemplates.bookingRequestPro
emailTemplates.bookingConfirmedClient
emailTemplates.bookingConfirmedPro
emailTemplates.bookingCancelledClient
emailTemplates.bookingCancelledPro
emailTemplates.bookingReminder
emailTemplates.passwordResetClient
emailTemplates.passwordResetPro
emailTemplates.newReview
emailTemplates.newFavorite
emailTemplates.newMessage
```

---

## 🔒 Sécurité

### Vérification de Signature

Le webhook vérifie la signature Resend si `RESEND_WEBHOOK_SECRET` est configuré :

1. Resend envoie une signature dans le header `resend-signature`
2. Le webhook calcule le HMAC-SHA256
3. Compare avec la signature reçue
4. Rejette si invalide

### Protection

- ✅ Vérification de signature (si secret configuré)
- ✅ Gestion d'erreurs robuste
- ✅ Logging de tous les événements
- ✅ Réponse rapide à Resend (évite les retries)

---

## 📊 Analytics Possibles

Avec les webhooks, vous pouvez tracker :

- **Taux de livraison** : `delivered` / `sent`
- **Taux d'ouverture** : `opened` / `delivered`
- **Taux de clic** : `clicked` / `opened`
- **Taux de rebond** : `bounced` / `sent`
- **Taux de plainte** : `complained` / `sent`

---

## ✅ Checklist de Configuration

- [ ] Compte Resend créé
- [ ] Clé API configurée (`RESEND_API_KEY`)
- [ ] Webhook créé sur Resend Dashboard
- [ ] URL webhook : `https://anireserve.com/api/webhooks/resend`
- [ ] Tous les événements sélectionnés
- [ ] Secret webhook configuré (optionnel)
- [ ] Test d'envoi d'email effectué
- [ ] Vérification des logs webhook
- [ ] Templates testés

---

## 🆘 Dépannage

### Le webhook ne reçoit pas d'événements

1. **Vérifier l'URL** :
   ```bash
   curl https://anireserve.com/api/webhooks/resend
   ```

2. **Vérifier les logs** :
   ```bash
   pm2 logs anireserve | grep webhook
   ```

3. **Vérifier sur Resend** :
   - Aller dans Webhooks → Voir les tentatives
   - Vérifier les erreurs éventuelles

### Les emails ne sont pas envoyés

1. **Vérifier la clé API** :
   ```bash
   cat .env | grep RESEND_API_KEY
   ```

2. **Vérifier les logs** :
   ```bash
   pm2 logs anireserve | grep email
   ```

3. **Tester manuellement** :
   - Créer une inscription test
   - Vérifier les emails reçus

---

**Status** : ✅ **Système complet de webhooks et templates créé**

**URL Webhook** : `https://anireserve.com/api/webhooks/resend`



