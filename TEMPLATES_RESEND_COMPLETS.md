# 📧 Templates Complets pour Resend.com

## 🎯 Instructions

1. Aller sur https://resend.com/templates
2. Cliquer sur "+ Create template"
3. Pour chaque template ci-dessous :
   - Copier le **Name** et **Subject**
   - Copier le **HTML** complet
   - Sauvegarder

---

## Template 1 : Inscription Pro - Admin

**Name** : `inscription-pro-admin`  
**Subject** : `🔔 Nouvelle inscription professionnel : {{professionalName}}`

<details>
<summary>📄 HTML Complet (cliquer pour voir)</summary>

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
    <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">
      Vous recevez cet email car vous êtes administrateur d'AniReserve
    </p>
  </div>
</body>
</html>
```

</details>

---

## Template 2 : Inscription Pro - Confirmation

**Name** : `inscription-pro-confirmation`  
**Subject** : `✅ Votre inscription AniReserve est en cours de traitement`

<details>
<summary>📄 HTML Complet</summary>

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

</details>

---

## Template 3 : Profil Validé

**Name** : `profil-valide`  
**Subject** : `🎉 Votre compte AniReserve est validé !`

<details>
<summary>📄 HTML Complet</summary>

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #18223b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">
      💡 Ani<span style="color: #FFDE59;">RESERVE</span>
    </h1>
    <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">
      La plateforme de réservation en Israël pour les Français
    </p>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <h2 style="color: #10b981; margin-top: 0;">🎉 Votre compte est validé !</h2>
    <p>Bonjour {{professionalName}},</p>
    <p>Excellente nouvelle ! Votre profil professionnel a été <strong>validé</strong> par notre équipe.</p>
    
    <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
      <p style="margin: 0; font-size: 18px; font-weight: bold; color: #10b981;">✅ Votre compte est maintenant actif</p>
    </div>
    
    <p>Vous pouvez maintenant :</p>
    <ul style="line-height: 1.8;">
      <li>✅ Vous connecter à votre espace professionnel</li>
      <li>✅ Configurer votre planning de disponibilités</li>
      <li>✅ Recevoir des demandes de réservation</li>
      <li>✅ Apparaître dans les résultats de recherche</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://anireserve.com/pro/dashboard" 
         style="background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Accéder à mon espace pro
      </a>
    </div>
    
    <p>Bienvenue dans la communauté AniReserve ! 🎉</p>
  </div>
  
  <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="color: #6b7280; font-size: 12px; margin: 0;">
      AniReserve - La plateforme de réservation en Israël pour les Français<br>
      <a href="https://anireserve.com" style="color: #10b981; text-decoration: none;">anireserve.com</a>
    </p>
  </div>
</body>
</html>
```

</details>

---

## Template 4 : Profil Rejeté

**Name** : `profil-rejete`  
**Subject** : `❌ Votre demande d'inscription AniReserve`

<details>
<summary>📄 HTML Complet</summary>

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #ef4444 0%, #18223b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">
      💡 Ani<span style="color: #FFDE59;">RESERVE</span>
    </h1>
    <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">
      La plateforme de réservation en Israël pour les Français
    </p>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <h2 style="color: #ef4444; margin-top: 0;">❌ Votre demande d'inscription</h2>
    <p>Bonjour {{professionalName}},</p>
    <p>Nous avons examiné votre demande d'inscription sur AniReserve.</p>
    
    <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
      <p style="margin: 0; font-size: 18px; font-weight: bold; color: #ef4444;">❌ Votre profil n'a pas pu être validé</p>
      {{#if reason}}
      <p style="margin: 10px 0 0 0;"><strong>Raison :</strong> {{reason}}</p>
      {{/if}}
    </div>
    
    <p>Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez plus d'informations, n'hésitez pas à nous contacter :</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="mailto:contact@anireserve.com" 
         style="background: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Nous contacter
      </a>
    </div>
  </div>
  
  <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="color: #6b7280; font-size: 12px; margin: 0;">
      AniReserve - La plateforme de réservation en Israël pour les Français<br>
      <a href="https://anireserve.com" style="color: #ef4444; text-decoration: none;">anireserve.com</a>
    </p>
  </div>
</body>
</html>
```

</details>

---

## 📝 Note Importante

Resend utilise la syntaxe `{{variable}}` pour les variables de template.

**Variables disponibles** :
- `{{professionalName}}`
- `{{email}}`
- `{{phone}}`
- `{{city}}`
- `{{serviceType}}`
- `{{description}}`
- `{{clientName}}`
- `{{date}}`
- `{{time}}`
- `{{reason}}`

---

**Pour les autres templates** (réservations, rappels, etc.), utilisez le même format avec les variables appropriées. Les templates sont dans `apps/web/src/lib/email-templates.ts` - vous pouvez extraire le HTML de chaque fonction.



