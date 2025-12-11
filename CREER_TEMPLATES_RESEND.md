# 📧 Créer les Templates sur Resend.com

## 🎯 Objectif

Créer tous les templates d'emails directement sur Resend.com pour pouvoir les réutiliser facilement.

---

## 📋 Liste des Templates à Créer (16)

### 1. Inscription Professionnel - Notification Admin
### 2. Inscription Professionnel - Confirmation Pro
### 3. Profil Validé
### 4. Profil Rejeté
### 5. Demande de Réservation - Client
### 6. Nouvelle Demande - Professionnel
### 7. Réservation Confirmée - Client
### 8. Réservation Confirmée - Professionnel
### 9. Réservation Annulée - Client
### 10. Réservation Annulée - Professionnel
### 11. Rappel de Réservation
### 12. Réinitialisation Mot de Passe - Client
### 13. Réinitialisation Mot de Passe - Professionnel
### 14. Nouvel Avis
### 15. Nouveau Favori
### 16. Nouveau Message

---

## 🚀 Étapes pour Créer un Template

### Sur Resend.com :

1. **Aller sur** : https://resend.com/templates
2. **Cliquer** : "+ Create template"
3. **Remplir** :
   - **Name** : Nom du template (ex: "Inscription Professionnel - Admin")
   - **Subject** : Sujet de l'email (ex: "🔔 Nouvelle inscription professionnel : {{professionalName}}")
   - **HTML** : Coller le HTML du template
4. **Sauvegarder**

---

## 📝 Templates HTML à Copier

### Template 1 : Inscription Professionnel - Notification Admin

**Name** : `inscription-pro-admin`  
**Subject** : `🔔 Nouvelle inscription professionnel : {{professionalName}}`

**HTML** :
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #2FB190 0%, #18223b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">
      💡 Ani<span style="color: #FFDE59;">RESERVE</span>
    </h1>
    <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">
      La plateforme de réservation en Israël pour les Français
    </p>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <h2 style="color: #2FB190; margin-top: 0;">🔔 Nouvelle inscription professionnel</h2>
    <p>Bonjour,</p>
    <p>Un nouveau professionnel vient de s'inscrire sur AniReserve et son dossier est en attente de validation.</p>
    
    <div style="background: #f0f9f7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2FB190;">
      <h3 style="margin-top: 0; color: #18223b;">Informations du professionnel</h3>
      <p style="margin: 5px 0;"><strong>👤 Nom :</strong> {{professionalName}}</p>
      <p style="margin: 5px 0;"><strong>📧 Email :</strong> {{email}}</p>
      <p style="margin: 5px 0;"><strong>📱 Téléphone :</strong> {{phone}}</p>
      <p style="margin: 5px 0;"><strong>📍 Ville :</strong> {{city}}</p>
      <p style="margin: 5px 0;"><strong>💼 Service :</strong> {{serviceType}}</p>
      <p style="margin: 5px 0;"><strong>📝 Description :</strong> {{description}}</p>
    </div>
    
    <p><strong>⏳ Action requise :</strong> Connectez-vous à l'espace admin pour valider ou rejeter ce profil.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://anireserve.com/admin/professionals/pending" 
         style="background: #2FB190; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Accéder à l'espace admin
      </a>
    </div>
  </div>
  
  <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="color: #6b7280; font-size: 12px; margin: 0;">
      AniReserve - La plateforme de réservation en Israël pour les Français<br>
      <a href="https://anireserve.com" style="color: #2FB190; text-decoration: none;">anireserve.com</a> | 
      <a href="mailto:contact@anireserve.com" style="color: #2FB190; text-decoration: none;">contact@anireserve.com</a>
    </p>
  </div>
</body>
</html>
```

---

### Template 2 : Inscription Professionnel - Confirmation Pro

**Name** : `inscription-pro-confirmation`  
**Subject** : `✅ Votre inscription AniReserve est en cours de traitement`

**HTML** :
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #2FB190 0%, #18223b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">
      💡 Ani<span style="color: #FFDE59;">RESERVE</span>
    </h1>
    <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">
      La plateforme de réservation en Israël pour les Français
    </p>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <h2 style="color: #2FB190; margin-top: 0;">✅ Inscription reçue !</h2>
    <p>Bonjour {{professionalName}},</p>
    <p>Nous avons bien reçu votre demande d'inscription sur <strong>AniReserve</strong>.</p>
    
    <div style="background: #f0f9f7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2FB190;">
      <p style="margin: 0;"><strong>⏳ Statut :</strong> Votre dossier est en cours de traitement</p>
      <p style="margin: 10px 0 0 0;">Notre équipe examine votre profil et vos documents. Vous recevrez un email dès que votre compte sera validé.</p>
    </div>
    
    <p><strong>📋 Prochaines étapes :</strong></p>
    <ul style="line-height: 1.8;">
      <li>Vérification de vos documents (Teoudate Zeoute)</li>
      <li>Validation de votre profil professionnel</li>
      <li>Activation de votre compte</li>
    </ul>
    
    <p><strong>⏰ Délai de traitement :</strong> Généralement sous 24-48 heures</p>
    
    <p>Une fois votre compte validé, vous pourrez :</p>
    <ul style="line-height: 1.8;">
      <li>Gérer votre planning de disponibilités</li>
      <li>Recevoir des demandes de réservation</li>
      <li>Apparaître dans les résultats de recherche</li>
    </ul>
    
    <p>En cas de question, n'hésitez pas à nous contacter à <a href="mailto:contact@anireserve.com" style="color: #2FB190;">contact@anireserve.com</a></p>
  </div>
  
  <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="color: #6b7280; font-size: 12px; margin: 0;">
      AniReserve - La plateforme de réservation en Israël pour les Français<br>
      <a href="https://anireserve.com" style="color: #2FB190; text-decoration: none;">anireserve.com</a>
    </p>
  </div>
</body>
</html>
```

---

## 🔧 Utilisation des Templates dans le Code

Une fois les templates créés sur Resend, vous pouvez les utiliser ainsi :

```typescript
import { resend } from '@/lib/resend-config';

// Envoyer un email avec un template
await resend.emails.send({
  from: 'AniReserve <noreply@anireserve.com>',
  to: 'reservation@anireserve.com',
  template_id: 'votre-template-id-ici',
  template_data: {
    professionalName: 'Jean Dupont',
    email: 'jean@example.com',
    phone: '+33 6 12 34 56 78',
    city: 'Tel Aviv',
    serviceType: 'Coiffeur',
    description: 'Coiffeur spécialisé...'
  }
});
```

---

## 📝 Variables Disponibles par Template

### Template Admin :
- `{{professionalName}}`
- `{{email}}`
- `{{phone}}`
- `{{city}}`
- `{{serviceType}}`
- `{{description}}`

### Template Pro :
- `{{professionalName}}`

### Templates Réservation :
- `{{clientName}}`
- `{{professionalName}}`
- `{{date}}`
- `{{time}}`
- `{{clientEmail}}`

---

## ✅ Checklist

- [ ] Créer compte Resend
- [ ] Vérifier domaine `anireserve.com`
- [ ] Créer les 16 templates sur Resend
- [ ] Noter les IDs des templates
- [ ] Mettre à jour le code pour utiliser les template IDs
- [ ] Tester l'envoi d'emails

---

**Note** : Les templates sur Resend permettent de modifier facilement le design sans toucher au code.








