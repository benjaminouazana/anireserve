# 🧪 Guide de Test Utilisateur - AniReserve

## 📋 Objectif
Ce guide permet de tester toutes les fonctionnalités du site avant le lancement.

---

## 👤 Test 1 : Inscription et Connexion Client

### Étapes :
1. Aller sur `http://localhost:3001`
2. Cliquer sur "Connexion" → "Créer un compte"
3. Remplir le formulaire :
   - Nom : Test Client
   - Email : test@client.com
   - Mot de passe : Test123!
4. Vérifier :
   - ✅ Redirection vers le dashboard client
   - ✅ Message de bienvenue affiché
   - ✅ Pas de doublon d'email possible

### Test de connexion :
1. Se déconnecter
2. Se reconnecter avec les mêmes identifiants
3. Vérifier que la connexion fonctionne

---

## 👨‍💼 Test 2 : Inscription Professionnel

### Étapes :
1. Aller sur `/pro/register`
2. Remplir le formulaire complet :
   - Informations personnelles
   - Ville et services
   - Description
   - Upload Teoudate Zeoute
3. Vérifier :
   - ✅ Message de confirmation
   - ✅ Redirection vers page "En attente de validation"
   - ✅ Pas de doublon d'email/téléphone

### Test de connexion pro :
1. Se connecter avec les identifiants du pro
2. Vérifier l'accès au dashboard pro

---

## 🔍 Test 3 : Recherche de Professionnels

### Étapes :
1. Sur la page d'accueil, tester :
   - Recherche par ville
   - Recherche par service
   - Recherche par mots-clés
   - Filtre "Disponible aujourd'hui"
   - Tri par nom/note/avis
2. Vérifier :
   - ✅ Résultats pertinents
   - ✅ Pagination fonctionnelle
   - ✅ Affichage correct des professionnels

---

## 📅 Test 4 : Réservation (Client)

### Étapes :
1. Sélectionner un professionnel
2. Cliquer sur "Réserver"
3. Remplir le formulaire :
   - Nom et email (pré-remplis si connecté)
   - Date souhaitée
   - Sélectionner un créneau
4. Vérifier :
   - ✅ Affichage des créneaux disponibles
   - ✅ Calendrier visuel avec boutons
   - ✅ Confirmation de réservation
   - ✅ Message de succès

---

## ⭐ Test 5 : Favoris

### Étapes :
1. Cliquer sur le bouton ❤️ d'un professionnel
2. Aller sur "Mes favoris"
3. Vérifier :
   - ✅ Professionnel ajouté aux favoris
   - ✅ Liste des favoris affichée
   - ✅ Possibilité de retirer des favoris

---

## 💬 Test 6 : Chat

### Étapes :
1. Aller sur "Mes réservations"
2. Cliquer sur "💬 Chat" pour une réservation
3. Envoyer un message
4. Vérifier :
   - ✅ Messages affichés
   - ✅ Interface de chat fonctionnelle

---

## 🖼️ Test 7 : Galerie d'Images (Pro)

### Étapes :
1. Se connecter en tant que pro
2. Aller sur son propre profil
3. Cliquer sur "📷 Ajouter des images"
4. Tester :
   - Upload d'image via bouton
   - Ajout d'URLs manuelles
5. Vérifier :
   - ✅ Images affichées dans la galerie
   - ✅ Lightbox fonctionnel

---

## 💰 Test 8 : Gestion des Tarifs (Pro)

### Étapes :
1. Sur le profil pro, cliquer sur "💰 Gérer mes prix"
2. Ajouter plusieurs services avec prix
3. Sauvegarder
4. Vérifier :
   - ✅ Tarifs affichés sur le profil
   - ✅ Format correct (₪)

---

## 📅 Test 9 : Disponibilités (Pro)

### Étapes :
1. Aller sur `/pro/availability`
2. Pour chaque jour :
   - Activer/désactiver
   - Ajouter plusieurs tranches horaires (ex: 09:00-10:00 et 17:00-18:00)
   - Supprimer une tranche
3. Sauvegarder
4. Vérifier :
   - ✅ Plusieurs tranches horaires sauvegardées
   - ✅ Créneaux générés correctement

---

## ➕ Test 10 : Réservation Manuelle (Pro)

### Étapes :
1. Aller sur `/pro/create-booking`
2. Remplir les informations d'un client
3. Sélectionner date et heures
4. Créer la réservation
5. Vérifier :
   - ✅ Réservation créée
   - ✅ Affichée dans le dashboard pro
   - ✅ Client créé automatiquement

---

## 🛡️ Test 11 : Interface Admin

### Étapes :
1. Se connecter en tant qu'admin
2. Aller sur `/admin/professionals/pending`
3. Tester :
   - Voir les documents Teoudate Zeoute
   - Approuver un professionnel
   - Rejeter un professionnel (avec raison)
4. Vérifier :
   - ✅ Documents affichés correctement
   - ✅ Actions fonctionnelles
   - ✅ Emails envoyés (si configuré)

---

## 🔐 Test 12 : Changement de Mot de Passe

### Client :
1. Dashboard client → "Changer mon mot de passe"
2. Entrer ancien et nouveau mot de passe
3. Vérifier la mise à jour

### Pro :
1. Dashboard pro → Paramètres → "Changer mon mot de passe"
2. Tester le changement

---

## 📱 Test 13 : Responsive Design

### Tester sur différentes tailles d'écran :
- Mobile (< 640px)
- Tablette (640px - 1024px)
- Desktop (> 1024px)

### Vérifier :
- ✅ Layout adaptatif
- ✅ Boutons accessibles
- ✅ Textes lisibles
- ✅ Formulaires utilisables

---

## 🎨 Test 14 : Thème Sombre

### Étapes :
1. Cliquer sur le bouton de thème
2. Vérifier :
   - ✅ Basculement thème clair/sombre
   - ✅ Persistance du choix
   - ✅ Tous les éléments visibles

---

## ⚠️ Points à Vérifier Spécialement

### Bugs connus à tester :
- [ ] Connexion à la base de données stable
- [ ] Upload d'images fonctionne
- [ ] Créneaux disponibles s'affichent correctement
- [ ] Pas d'erreurs dans la console
- [ ] Tous les liens fonctionnent
- [ ] Formulaires valident correctement

### Performance :
- [ ] Temps de chargement < 3 secondes
- [ ] Images optimisées
- [ ] Pas de requêtes inutiles

---

## 📝 Template de Rapport de Test

```
Date : __________
Testeur : __________

Fonctionnalités testées : __________
Résultat : ✅ / ❌
Problèmes rencontrés : __________
Suggestions : __________
```

---

## 🚀 Après les Tests

1. Compiler tous les rapports de test
2. Prioriser les bugs trouvés
3. Corriger les problèmes critiques
4. Relancer les tests sur les corrections
5. Préparer le déploiement










