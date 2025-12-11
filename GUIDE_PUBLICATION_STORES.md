# Guide Complet : Publication sur Apple App Store et Google Play Store

## 🎯 Objectif

Transformer votre application web Next.js en applications natives pour iOS et Android en utilisant **Capacitor**.

---

## 📋 Prérequis

### Pour iOS (Apple App Store)
- ✅ Mac avec macOS
- ✅ Xcode installé (via App Store)
- ✅ Compte développeur Apple (99$/an)
- ✅ Certificats de développement Apple

### Pour Android (Google Play Store)
- ✅ Android Studio installé
- ✅ Compte développeur Google Play (25$ une fois)
- ✅ Java JDK installé

---

## 🚀 Étape 1 : Installation de Capacitor

### 1.1 Installer Capacitor

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
npm install @capacitor/app @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard
```

### 1.2 Initialiser Capacitor

```bash
npx cap init
```

**Réponses** :
- App name: `AniReserve`
- App ID: `com.anireserve.app`
- Web dir: `apps/web/.next` (ou `apps/web/out` si vous utilisez l'export statique)

---

## 🎨 Étape 2 : Créer les Icônes et Splash Screens

### 2.1 Créer les Icônes

Vous devez créer des icônes dans plusieurs tailles :

**Tailles requises** :
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512 (pour PWA)
- 1024x1024 (pour iOS et Android)

**Outils recommandés** :
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [App Icon Generator](https://www.appicon.co/)
- [Favicon Generator](https://realfavicongenerator.net/)

### 2.2 Placer les Icônes

```bash
# Créer le dossier des icônes
mkdir -p apps/web/public/icons

# Placer vos icônes dans apps/web/public/icons/
# icon-72x72.png, icon-96x96.png, etc.
```

### 2.3 Générer les Icônes avec Capacitor

```bash
# Installer l'outil de génération
npm install -D @capacitor/assets

# Générer automatiquement les icônes et splash screens
npx capacitor-assets generate --iconBackgroundColor '#2FB190' --iconBackgroundColorDark '#18223b' --splashBackgroundColor '#f0f9f7'
```

---

## 📱 Étape 3 : Configuration iOS

### 3.1 Ajouter la Plateforme iOS

```bash
npx cap add ios
```

### 3.2 Configurer Xcode

```bash
# Ouvrir le projet dans Xcode
npx cap open ios
```

### 3.3 Configuration dans Xcode

1. **Sélectionner le projet** dans le navigateur de gauche
2. **Onglet "Signing & Capabilities"** :
   - Cocher "Automatically manage signing"
   - Sélectionner votre équipe de développement
3. **Onglet "General"** :
   - Version: `1.0.0`
   - Build: `1`
   - Bundle Identifier: `com.anireserve.app`
4. **Onglet "Info"** :
   - Ajouter les permissions nécessaires (Camera, Photos, etc.)

### 3.4 Tester sur Simulateur

```bash
# Dans Xcode, sélectionner un simulateur et cliquer sur "Run"
```

### 3.5 Build pour App Store

1. Dans Xcode : **Product → Archive**
2. Une fois l'archive créée, cliquer sur **"Distribute App"**
3. Sélectionner **"App Store Connect"**
4. Suivre les étapes de soumission

---

## 🤖 Étape 4 : Configuration Android

### 4.1 Ajouter la Plateforme Android

```bash
npx cap add android
```

### 4.2 Configurer Android Studio

```bash
# Ouvrir le projet dans Android Studio
npx cap open android
```

### 4.3 Configuration dans Android Studio

1. **Ouvrir** `android/app/build.gradle` :
   - `applicationId`: `com.anireserve.app`
   - `versionCode`: `1`
   - `versionName`: `"1.0.0"`

2. **Ouvrir** `android/app/src/main/AndroidManifest.xml` :
   - Vérifier les permissions
   - Ajouter les permissions nécessaires (INTERNET, CAMERA, etc.)

### 4.4 Tester sur Émulateur

1. Créer un AVD (Android Virtual Device) dans Android Studio
2. Lancer l'émulateur
3. Cliquer sur "Run" dans Android Studio

### 4.5 Build pour Play Store

```bash
cd android
./gradlew bundleRelease
```

Le fichier `.aab` sera dans `android/app/build/outputs/bundle/release/`

---

## 🔧 Étape 5 : Synchronisation du Code

### 5.1 Après chaque modification du code web

```bash
# 1. Build Next.js
cd apps/web
npm run build

# 2. Synchroniser avec Capacitor
cd ../..
npx cap sync

# 3. Ouvrir dans Xcode/Android Studio
npx cap open ios    # Pour iOS
npx cap open android # Pour Android
```

### 5.2 Scripts Utiles

Ajoutez dans `package.json` (racine) :

```json
{
  "scripts": {
    "build:web": "cd apps/web && npm run build",
    "sync:ios": "npm run build:web && npx cap sync ios",
    "sync:android": "npm run build:web && npx cap sync android",
    "open:ios": "npx cap open ios",
    "open:android": "npx cap open android"
  }
}
```

---

## 📝 Étape 6 : Préparation pour les Stores

### 6.1 Apple App Store

#### Informations Requises :
- **Nom de l'app** : AniReserve
- **Sous-titre** : Réservation professionnels en Israël
- **Description** : 
  ```
  AniReserve est la plateforme de réservation dédiée à la communauté francophone en Israël. 
  Trouvez et réservez facilement des professionnels vérifiés : coiffeurs, esthéticiennes, 
  médecins, avocats et bien plus. Tous nos professionnels parlent français et sont titulaires 
  d'un Essek au minimum Patour.
  ```
- **Mots-clés** : réservation, professionnels, Israël, français, booking
- **Catégorie** : Business / Lifestyle
- **Prix** : Gratuit
- **Captures d'écran** : Minimum 6.5" et 5.5" (iPhone)
- **Icône** : 1024x1024 PNG

#### Checklist de Soumission :
- [ ] Compte développeur Apple actif
- [ ] App ID configuré
- [ ] Certificats de distribution créés
- [ ] Profil de provisioning configuré
- [ ] Archive créée et validée
- [ ] Captures d'écran préparées
- [ ] Description et métadonnées complètes
- [ ] Politique de confidentialité (obligatoire)
- [ ] Conditions d'utilisation

### 6.2 Google Play Store

#### Informations Requises :
- **Nom de l'app** : AniReserve
- **Description courte** : Réservation professionnels en Israël
- **Description complète** : (même que pour iOS)
- **Catégorie** : Business / Lifestyle
- **Prix** : Gratuit
- **Captures d'écran** : Minimum 2 (téléphone et tablette)
- **Icône** : 512x512 PNG
- **Bannière** : 1024x500 PNG (optionnel)

#### Checklist de Soumission :
- [ ] Compte développeur Google Play créé
- [ ] Application signée avec une clé de release
- [ ] Fichier .aab généré
- [ ] Captures d'écran préparées
- [ ] Description et métadonnées complètes
- [ ] Politique de confidentialité (obligatoire)
- [ ] Classification de contenu (PEGI/ESRB)
- [ ] Données collectées déclarées

---

## 🔐 Étape 7 : Sécurité et Permissions

### 7.1 Permissions iOS (Info.plist)

```xml
<key>NSCameraUsageDescription</key>
<string>Nous utilisons la caméra pour prendre des photos de profil</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Nous accédons à votre bibliothèque photo pour sélectionner des images</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Nous utilisons votre localisation pour trouver des professionnels près de vous</string>
```

### 7.2 Permissions Android (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

---

## 📦 Étape 8 : Build et Distribution

### 8.1 Build iOS pour App Store

```bash
# Dans Xcode
# 1. Product → Clean Build Folder (Cmd+Shift+K)
# 2. Product → Archive
# 3. Window → Organizer
# 4. Sélectionner l'archive → Distribute App
# 5. App Store Connect → Upload
```

### 8.2 Build Android pour Play Store

```bash
cd android
./gradlew bundleRelease

# Le fichier .aab sera dans :
# android/app/build/outputs/bundle/release/app-release.aab
```

### 8.3 Upload sur les Stores

#### Apple App Store Connect :
1. Aller sur [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Créer une nouvelle app
3. Remplir toutes les informations
4. Uploader l'archive via Xcode
5. Soumettre pour révision

#### Google Play Console :
1. Aller sur [play.google.com/console](https://play.google.com/console)
2. Créer une nouvelle app
3. Remplir toutes les informations
4. Uploader le fichier .aab
5. Publier en production

---

## 🎨 Étape 9 : Créer les Assets Visuels

### 9.1 Icônes Requises

**iOS** :
- 1024x1024 (App Store)
- 20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5 (iPhone/iPad)

**Android** :
- 512x512 (Play Store)
- 48x48, 72x72, 96x96, 144x144, 192x192 (différentes densités)

### 9.2 Captures d'Écran

**iOS** :
- iPhone 6.7" (1290x2796) - Minimum 1
- iPhone 6.5" (1242x2688) - Minimum 1
- iPad Pro 12.9" (2048x2732) - Optionnel

**Android** :
- Téléphone (1080x1920) - Minimum 2
- Tablette (1200x1920) - Optionnel

### 9.3 Outils Recommandés

- [App Store Screenshot Generator](https://www.appstorescreenshot.com/)
- [Screenshot.rocks](https://screenshot.rocks/)
- [Figma Templates](https://www.figma.com/community)

---

## 🔄 Workflow de Développement

### Après chaque modification :

```bash
# 1. Modifier le code web
# 2. Build
cd apps/web
npm run build

# 3. Synchroniser avec Capacitor
cd ../..
npx cap sync

# 4. Tester sur simulateur/émulateur
npx cap open ios
# ou
npx cap open android

# 5. Build pour production
# (voir étapes 8.1 et 8.2)
```

---

## 📚 Ressources Utiles

### Documentation Officielle
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

### Outils
- [Capacitor Assets](https://github.com/ionic-team/capacitor-assets)
- [App Icon Generator](https://www.appicon.co/)
- [PWA Builder](https://www.pwabuilder.com/)

---

## ⚠️ Points Importants

1. **Politique de Confidentialité** : Obligatoire pour les deux stores
2. **Conditions d'Utilisation** : Recommandé
3. **Données Collectées** : Doivent être déclarées (Google Play)
4. **Permissions** : Justifier chaque permission demandée
5. **Contenu** : Respecter les guidelines de chaque store
6. **Tests** : Tester sur de vrais appareils avant soumission

---

## 🎯 Prochaines Étapes

1. ✅ Installer Capacitor
2. ✅ Créer les icônes et splash screens
3. ✅ Configurer iOS et Android
4. ✅ Tester sur simulateurs/émulateurs
5. ✅ Tester sur de vrais appareils
6. ✅ Préparer les assets visuels
7. ✅ Créer les comptes développeur
8. ✅ Soumettre aux stores

---

**Note** : Le processus de révision peut prendre 1-7 jours pour Apple et quelques heures à 3 jours pour Google.








