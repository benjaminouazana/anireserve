# 📱 Guide de Build pour iOS et Android avec Capacitor

## 🎯 Architecture Hybride

L'app mobile AniReserve fonctionne en **mode hybride** :
- **Frontend mobile** : WebView (app iOS/Android)
- **Backend API** : Serveur Next.js (Supabase + Resend)

## 📦 Prérequis

```bash
# Installer Capacitor CLI globalement
npm install -g @capacitor/cli

# Installer les dépendances du projet
npm install

# Générer Prisma Client
npx prisma generate
```

## 🔨 Build pour Mobile

### Option 1: Mode Développement (Recommandé)

L'app mobile pointe vers votre serveur de dev local ou prod:

```bash
# 1. Démarrer le serveur Next.js
cd apps/web
npm run dev

# 2. Dans un autre terminal, synchroniser avec Capacitor
npx cap sync

# 3. Ouvrir dans Xcode (iOS)
npx cap open ios

# 4. Ouvrir dans Android Studio (Android)
npx cap open android
```

**Configuration dans `capacitor.config.ts`** :
```typescript
server: {
  // Pour dev local
  url: 'http://localhost:3000',
  cleartext: true,
  
  // OU pour prod
  // url: 'https://anireserve.com',
  // cleartext: false,
}
```

### Option 2: Build Statique (Limité)

⚠️ **Limitations** : Pas d'API routes, pas de server-side rendering

Cette option nécessite une architecture Backend séparée.

```bash
# 1. Build statique
cd apps/web
npm run build:mobile

# 2. Synchroniser
npx cap sync

# 3. Ouvrir l'IDE
npx cap open ios   # ou android
```

## 🍎 iOS - Préparer pour App Store

### 1. Configuration du Projet

Dans **Xcode** :
1. Ouvrir `ios/App/App.xcworkspace`
2. Sélectionner le projet → General
3. **Bundle Identifier** : `com.anireserve.app`
4. **Display Name** : AniReserve
5. **Version** : 1.0.0
6. **Build** : 1

### 2. Signing & Capabilities

1. **Team** : Sélectionner votre équipe de développement
2. **Signing** : Automatic
3. **Capabilities requi ses** :
   - Internet (activée par défaut)
   - Camera (si besoin pour photos profil)
   - Push Notifications (si activées)

### 3. Icons & Splash Screen

```bash
# Générer les icons depuis une image 1024x1024
npx @capacitor/assets generate --iconBackgroundColor '#18223b' --splashBackgroundColor '#18223b'
```

**Placer l'image source** :
- `resources/icon.png` (1024x1024, fond transparent)
- `resources/splash.png` (2732x2732, centré sur fond #18223b)

### 4. Build pour Distribution

1. Product → Archive
2. Distribute App → App Store Connect
3. Upload

## 🤖 Android - Préparer pour Play Store

### 1. Configuration du Projet

Dans **Android Studio** :
1. Ouvrir `android/`
2. Fichier `android/app/build.gradle` :

```gradle
android {
    defaultConfig {
        applicationId "com.anireserve.app"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

### 2. Générer Keystore (Release)

```bash
cd android/app
keytool -genkey -v -keystore anireserve-release.keystore \
  -alias anireserve -keyalg RSA -keysize 2048 -validity 10000

# Sauvegarder le mot de passe!
```

### 3. Configurer Signing

Créer `android/key.properties`:
```properties
storePassword=VOTRE_MOT_DE_PASSE
keyPassword=VOTRE_MOT_DE_PASSE
keyAlias=anireserve
storeFile=app/anireserve-release.keystore
```

⚠️ **Ajouter à `.gitignore`** :
```
android/key.properties
android/app/*.keystore
```

### 4. Build Release APK/AAB

```bash
cd android
./gradlew assembleRelease  # Pour APK
./gradlew bundleRelease    # Pour AAB (Play Store)
```

**Fichiers générés** :
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

## 🚀 Upload sur les Stores

### App Store (iOS)

1. **App Store Connect** : https://appstoreconnect.apple.com
2. Créer une nouvelle app
3. Upload via Xcode (Archive)
4. Compléter les métadonnées :
   - Screenshots (iPhone 6.7", 6.5", 5.5")
   - Description
   - Mots-clés
   - Catégorie : Voyages / Utilitaires
5. Soumettre pour review (~24-48h)

### Google Play Store (Android)

1. **Google Play Console** : https://play.google.com/console
2. Créer une nouvelle application
3. Upload AAB (Production → Releases)
4. Compléter les métadonnées :
   - Screenshots (phone, 7" tablet, 10" tablet)
   - Description courte et longue
   - Catégorie : Voyages et infos locales
5. Remplir le questionnaire contenu
6. Soumettre pour review (~quelques heures)

## ⚙️ Variables d'environnement

Pour l'app mobile, les variables doivent être définies **au build time** :

**Dans `apps/web/.env.production`** :
```bash
NEXT_PUBLIC_BASE_URL=https://anireserve.com
NEXT_PUBLIC_API_URL=https://anireserve.com/api
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
```

## 🔧 Troubleshooting

### Erreur "webDir not found"
```bash
# Créer le dossier manquant
mkdir -p apps/web/out
echo '<!DOCTYPE html><html><body>Building...</body></html>' > apps/web/out/index.html
npx cap sync
```

### iOS: "Untrusted Developer"
Sur l'iPhone : Réglages → Général → Gestion des appareils → Trust Developer

### Android: "App not installed"
- Désinstaller l'ancienne version
- Vérifier les permissions dans AndroidManifest.xml

## 📝 Checklist Pré-Upload

- [ ] Version et Build number mis à jour
- [ ] Icons et Splash screens générés
- [ ] Build testé sur device physique
- [ ] Screenshots prêts (différentes tailles)
- [ ] Description et mots-clés rédigés
- [ ] Politique de confidentialité publiée
- [ ] Conditions d'utilisation publiées
- [ ] Support email configuré
- [ ] Backend API en production stable

## 🔗 Ressources

- [Capacitor iOS](https://capacitorjs.com/docs/ios)
- [Capacitor Android](https://capacitorjs.com/docs/android)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Play Store Policies](https://play.google.com/about/developer-content-policy/)
