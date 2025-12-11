# 📋 Améliorations Demandées

## ✅ 1. Bouton "Mes réservations" ne fonctionne pas
**Statut :** À corriger
**Problème :** Le bouton existe mais peut-être un problème d'authentification ou de redirection

## ✅ 2. Créneaux indisponibles dès réservation créée (même en attente)
**Statut :** ✅ DÉJÀ IMPLÉMENTÉ
**Fichier :** `/apps/web/src/app/api/bookings/route.ts` ligne 28-53
**Note :** L'API vérifie déjà les conflits avec les réservations "pending" ou "confirmed"

## 🔨 3. Système de notes pour les professionnels
**Statut :** À implémenter
**Besoin :** Les clients doivent pouvoir ajouter des notes privées sur les professionnels

## 🔨 4. Profil client enrichi
**Statut :** À implémenter
**Besoin :** 
- Ville
- Nom, prénom (séparés)
- Email (déjà présent)
- Numéro de téléphone
- Adresse complète
- Photo de profil

## 🔨 5. Professionnel peut être aussi client
**Statut :** À implémenter
**Besoin :** Un professionnel peut prendre rendez-vous avec un autre professionnel (ex: développeur web → dentiste)
**Solution :** 
- Permettre aux professionnels de créer un compte client lié
- Ou permettre aux professionnels de réserver directement avec leur compte pro

## 🔨 6. Client → Professionnel
**Statut :** ✅ DÉJÀ POSSIBLE
**Note :** Un client peut déjà remplir le formulaire pour devenir pro

## 🔨 7. Bouton de conversation
**Statut :** À implémenter
**Besoin :** Bouton pour lancer une conversation entre client et pro
**Emplacement :** 
- Sur la page du professionnel
- Dans "Mes réservations"
- Peut-être déjà présent mais pas visible ?






