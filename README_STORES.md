# 📱 Publication sur Apple App Store et Google Play Store

## 🚀 Démarrage Rapide

### 1. Installation de Capacitor

```bash
npm run setup:capacitor
```

Ou manuellement :

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npm install @capacitor/app @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard
npx cap init
npx cap add ios
npx cap add android
```

### 2. Génération des Icônes

1. Créez une icône source de **1024x1024px** et nommez-la `icon-source.png` à la racine
2. Exécutez :

```bash
npm run generate:icons
```

Ou utilisez [Capacitor Assets](https://github.com/ionic-team/capacitor-assets) :

```bash
npm install -D @capacitor/assets
npx capacitor-assets generate
```

### 3. Build et Synchronisation

```bash
# Build Next.js
npm run build:web

# Synchroniser avec iOS
npm run sync:ios

# Synchroniser avec Android
npm run sync:android
```

### 4. Ouvrir dans les IDEs

```bash
# iOS (nécessite Mac + Xcode)
npm run open:ios

# Android (nécessite Android Studio)
npm run open:android
```

---

## 📚 Documentation Complète

Consultez le guide détaillé : **[GUIDE_PUBLICATION_STORES.md](./GUIDE_PUBLICATION_STORES.md)**

---

## ✅ Checklist de Publication

### Préparation
- [ ] Capacitor installé et configuré
- [ ] Icônes générées (toutes les tailles)
- [ ] Splash screens créés
- [ ] Service Worker fonctionnel
- [ ] Manifest.json complet
- [ ] Application testée sur simulateurs/émulateurs
- [ ] Application testée sur de vrais appareils

### Apple App Store
- [ ] Compte développeur Apple (99$/an)
- [ ] Xcode installé et configuré
- [ ] Certificats de distribution créés
- [ ] Archive créée et validée
- [ ] Captures d'écran préparées (6.5" et 5.5")
- [ ] Description et métadonnées complètes
- [ ] Politique de confidentialité
- [ ] Conditions d'utilisation

### Google Play Store
- [ ] Compte développeur Google Play (25$)
- [ ] Android Studio installé
- [ ] Application signée avec clé de release
- [ ] Fichier .aab généré
- [ ] Captures d'écran préparées
- [ ] Description et métadonnées complètes
- [ ] Politique de confidentialité
- [ ] Classification de contenu

---

## 🔧 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm run setup:capacitor` | Installe et configure Capacitor |
| `npm run generate:icons` | Génère toutes les icônes PWA |
| `npm run build:web` | Build l'application Next.js |
| `npm run sync:ios` | Build + synchronise avec iOS |
| `npm run sync:android` | Build + synchronise avec Android |
| `npm run open:ios` | Ouvre le projet dans Xcode |
| `npm run open:android` | Ouvre le projet dans Android Studio |

---

## 📝 Fichiers Importants

- `capacitor.config.ts` - Configuration Capacitor
- `apps/web/public/manifest.json` - Manifest PWA
- `apps/web/public/sw.js` - Service Worker
- `GUIDE_PUBLICATION_STORES.md` - Guide complet

---

## 🆘 Support

En cas de problème, consultez :
- [Documentation Capacitor](https://capacitorjs.com/docs)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)






