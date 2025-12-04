# Configuration des emails avec Resend

## Étape 1 : Créer un compte Resend

1. Va sur [resend.com](https://resend.com)
2. Crée un compte gratuit (100 emails/jour gratuits)
3. Vérifie ton email

## Étape 2 : Obtenir la clé API

1. Va dans "API Keys" dans le dashboard Resend
2. Clique sur "Create API Key"
3. Donne-lui un nom (ex: "AniReserve Production")
4. Copie la clé API (commence par `re_`)

## Étape 3 : Configurer dans le projet

Ajoute la clé API dans ton fichier `.env` à la racine du projet :

```env
RESEND_API_KEY=re_ta_cle_api_ici
```

## Étape 4 : Vérifier le domaine (optionnel pour production)

Pour envoyer depuis ton propre domaine :
1. Va dans "Domains" dans Resend
2. Ajoute ton domaine
3. Suis les instructions DNS
4. Modifie `from` dans `/lib/email.ts` avec ton domaine

## Test

Les emails fonctionnent automatiquement :
- ✅ Confirmation de réservation
- ✅ Changement de statut (confirmé/annulé)
- ✅ Rappels 24h avant (via cron job)

**Note** : Si `RESEND_API_KEY` n'est pas configuré, les emails sont simulés dans la console (pour le développement).








