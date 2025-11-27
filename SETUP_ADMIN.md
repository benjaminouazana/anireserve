# 🛡️ Configuration de l'Administrateur

## Création du compte administrateur

Pour créer le compte administrateur, exécutez la commande suivante :

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
npx tsx create-admin.ts
```

## Informations de connexion par défaut

- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@anireserve.com`
- **Mot de passe**: `AdminAniReserve2024!`

⚠️ **IMPORTANT**: Changez le mot de passe après la première connexion !

## Fonctionnalités du dashboard admin

Le dashboard administrateur permet de :

- 📊 **Voir les statistiques générales** :
  - Nombre total de clients
  - Nombre total de professionnels
  - Nombre total de réservations
  - Note moyenne des avis

- 📈 **Suivre les réservations** :
  - Réservations par statut (en attente, confirmées, annulées)
  - Réservations des 30 derniers jours
  - Liste des réservations récentes

- 👥 **Gérer les utilisateurs** :
  - Liste des clients récents
  - Liste des professionnels récents

- 🏷️ **Analyser les services** :
  - Répartition des professionnels par service
  - Répartition des professionnels par ville

## Accès sécurisé

- Seuls les administrateurs authentifiés peuvent accéder au dashboard
- Les routes admin sont protégées par authentification
- Session administrateur valide 7 jours

