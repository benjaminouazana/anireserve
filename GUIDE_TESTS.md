# Guide de tests - AniReserve

## 🧪 Tests à effectuer une fois le site en ligne

### 1. Tests fonctionnels de base

#### Page d'accueil
- [ ] Le logo "Ani RESERVE" s'affiche correctement
- [ ] Le formulaire de recherche est fonctionnel
- [ ] Les filtres (ville, service, disponibilité) fonctionnent
- [ ] La pagination fonctionne
- [ ] Les professionnels s'affichent avec leurs informations

#### Recherche de professionnels
- [ ] Recherche par ville fonctionne
- [ ] Recherche par service fonctionne
- [ ] Recherche par mot-clé fonctionne
- [ ] Les résultats sont triés correctement (nom, note, avis)
- [ ] Filtre "Disponible aujourd'hui" fonctionne

#### Page professionnel
- [ ] La page se charge correctement
- [ ] Les informations du professionnel s'affichent
- [ ] Les avis sont visibles
- [ ] Le calendrier de disponibilité fonctionne
- [ ] Les créneaux horaires sont correctement affichés
- [ ] La galerie d'images fonctionne (si présente)

### 2. Tests d'inscription/connexion

#### Client
- [ ] Inscription client fonctionne
- [ ] Connexion client fonctionne
- [ ] Déconnexion client fonctionne
- [ ] Mot de passe oublié fonctionne
- [ ] Réinitialisation du mot de passe fonctionne

#### Professionnel
- [ ] Inscription professionnel fonctionne (formulaire complet)
- [ ] Validation des champs obligatoires
- [ ] Upload de documents fonctionne
- [ ] Connexion professionnel fonctionne
- [ ] Dashboard professionnel accessible après connexion

### 3. Tests de réservation

#### Processus de réservation
- [ ] Sélection d'un créneau horaire fonctionne
- [ ] Formulaire de réservation se remplit
- [ ] Validation des champs
- [ ] Confirmation de réservation fonctionne
- [ ] Email de confirmation envoyé (si configuré)

#### Gestion des réservations (Client)
- [ ] Liste des réservations visible sur "Mes réservations"
- [ ] Statut des réservations correct (en attente, confirmé, annulé)
- [ ] Annulation de réservation fonctionne
- [ ] Chat/messages avec le professionnel accessible

#### Gestion des réservations (Professionnel)
- [ ] Dashboard affiche les réservations
- [ ] Calendrier affiche les créneaux occupés
- [ ] Confirmation de réservation fonctionne
- [ ] Annulation de réservation fonctionne
- [ ] Export des réservations (CSV) fonctionne

### 4. Tests de favoris

- [ ] Ajout d'un professionnel aux favoris fonctionne
- [ ] Retrait d'un favori fonctionne
- [ ] Page "Mes favoris" affiche les favoris
- [ ] Les favoris persistent après déconnexion/reconnexion

### 5. Tests d'avis/notes

- [ ] Ajout d'un avis fonctionne
- [ ] Note (étoiles) fonctionne
- [ ] Les avis s'affichent sur la page professionnel
- [ ] Calcul de la moyenne des notes correct
- [ ] Nombre total d'avis correct

### 6. Tests administration

#### Connexion admin
- [ ] Connexion admin fonctionne
- [ ] Dashboard admin accessible

#### Gestion des professionnels
- [ ] Liste des professionnels en attente visible
- [ ] Validation d'un professionnel fonctionne
- [ ] Vérification (badge vérifié) fonctionne
- [ ] Rejet d'un professionnel fonctionne

#### Gestion des avis
- [ ] Liste des avis visible
- [ ] Modération des avis fonctionne
- [ ] Suppression d'avis fonctionne

#### Statistiques
- [ ] Dashboard affiche les stats correctes
- [ ] Nombre de professionnels correct
- [ ] Nombre de réservations correct
- [ ] Chiffre d'affaires correct (si applicable)

### 7. Tests de performance

#### Temps de chargement
- [ ] Page d'accueil charge en < 2s
- [ ] Page professionnel charge en < 2s
- [ ] Recherche retourne des résultats en < 1s
- [ ] Images se chargent progressivement (lazy loading)

#### Lighthouse Score
- [ ] Performance : > 80
- [ ] Accessibility : > 90
- [ ] Best Practices : > 90
- [ ] SEO : > 85

### 8. Tests responsive

#### Mobile (375px - iPhone SE)
- [ ] Layout adapté au mobile
- [ ] Navigation fonctionne
- [ ] Formulaires utilisables
- [ ] Boutons cliquables facilement
- [ ] Texte lisible

#### Tablet (768px - iPad)
- [ ] Layout adapté à la tablette
- [ ] Toutes les fonctionnalités accessibles

#### Desktop (1920px)
- [ ] Layout utilise bien l'espace disponible
- [ ] Pas de débordement horizontal

### 9. Tests de sécurité

#### Authentification
- [ ] Les routes protégées redirigent vers login
- [ ] Les tokens JWT expirent correctement
- [ ] Impossible d'accéder aux données d'un autre utilisateur

#### Validation des données
- [ ] Les inputs sont validés côté serveur
- [ ] Protection contre XSS
- [ ] Protection contre SQL injection (Prisma)
- [ ] CSRF protection activée

#### Headers de sécurité
- [ ] X-Frame-Options présent
- [ ] X-Content-Type-Options présent
- [ ] Referrer-Policy présent
- [ ] Content-Security-Policy configuré (après SSL)

### 10. Tests d'accessibilité

#### Navigation clavier
- [ ] Navigation possible au clavier (Tab)
- [ ] Focus visible sur les éléments interactifs
- [ ] Skip links fonctionnent

#### Lecteur d'écran
- [ ] Les images ont des alt text appropriés
- [ ] Les boutons ont des labels ARIA
- [ ] Les formulaires ont des labels associés
- [ ] Les erreurs sont annoncées

#### Contraste
- [ ] Ratio de contraste > 4.5:1 pour le texte normal
- [ ] Ratio de contraste > 3:1 pour le texte large
- [ ] Couleurs ne sont pas la seule indication (ex: erreurs)

### 11. Tests de contenu

#### SEO
- [ ] Balises title personnalisées pour chaque page
- [ ] Meta descriptions présentes
- [ ] Open Graph tags configurés
- [ ] Robots.txt accessible
- [ ] Sitemap.xml accessible et correct

#### Contenu
- [ ] Pas de lorem ipsum restant
- [ ] Textes en français correct
- [ ] Liens fonctionnels (pas de 404)
- [ ] Images pertinentes

### 12. Tests d'erreurs

#### Gestion des erreurs
- [ ] 404 page personnalisée
- [ ] 500 page personnalisée
- [ ] Messages d'erreur utilisateur-friendly
- [ ] Erreurs loggées côté serveur

#### Cas limites
- [ ] Recherche sans résultats affiche un message
- [ ] Champs vides gérés correctement
- [ ] Upload de fichiers trop gros rejeté
- [ ] Formats de fichiers invalides rejetés

## 📊 Checklist de déploiement

### Avant de mettre en production
- [ ] Toutes les variables d'environnement configurées
- [ ] Base de données migrée et peuplée
- [ ] SSL/HTTPS configuré
- [ ] DNS pointant vers le bon serveur
- [ ] Backups automatiques configurés
- [ ] Monitoring en place (logs, erreurs)

### Après mise en production
- [ ] Tester tous les flux principaux
- [ ] Vérifier les logs pour erreurs
- [ ] Tester sur différents appareils
- [ ] Demander des retours aux premiers utilisateurs
- [ ] Corriger les bugs prioritaires

## 🐛 Bugs connus à surveiller

### Logo
- ✅ Corrigé : Erreurs 404 sur logo.png (utilise maintenant fallback text)

### Images
- ⚠️ À surveiller : URLs Unsplash dans la DB peuvent être invalides
- Solution : Utiliser OptimizedImage qui gère les erreurs

### Performance
- ⚠️ À surveiller : Chargement lent si trop de professionnels
- Solution : Pagination déjà en place, vérifier les limites

## 📝 Rapport de tests

Template pour documenter vos tests :

```markdown
# Rapport de tests - [Date]

## Environnement
- URL : https://anireserve.com
- Navigateur : Chrome 120
- Appareil : Desktop

## Tests réalisés
- [x] Page d'accueil : OK
- [x] Recherche : OK
- [ ] Réservation : KO - Erreur lors de la confirmation

## Bugs trouvés
1. **Titre du bug**
   - Description : ...
   - Étapes pour reproduire : ...
   - Priorité : Haute/Moyenne/Basse
   - Screenshot : [lien]

## Recommandations
- ...
```

## 🎯 Priorisation des tests

### Priorité 1 (Critique - À tester en premier)
1. Page d'accueil charge
2. Recherche fonctionne
3. Inscription/connexion
4. Processus de réservation complet

### Priorité 2 (Important)
1. Dashboard professionnel
2. Gestion des réservations
3. Favoris
4. Avis

### Priorité 3 (Nice to have)
1. Administration
2. Export CSV
3. Analytics
4. Optimisations avancées


