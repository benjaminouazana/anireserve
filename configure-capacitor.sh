#!/bin/bash

# 📱 Configuration Capacitor pour le backend déployé

set -e

PROJECT_DIR="/Users/macbookpro/Desktop/aniresa/AniReserve"
SERVER_URL="https://anireserve.com"  # Production HTTPS

echo "⚙️  Configuration Capacitor"
echo "=========================="
echo ""
echo "URL backend: $SERVER_URL"
echo ""

cd "$PROJECT_DIR"

# Backup de la config actuelle
cp capacitor.config.ts capacitor.config.ts.backup

# Update la config
cat > capacitor.config.ts << EOF
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anireserve.app',
  appName: 'AniReserve',
  webDir: 'apps/web/out',
  server: {
    url: '$SERVER_URL',  // Backend production HTTPS
    cleartext: false,     // false pour HTTPS
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#18223b',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      iosSpinnerStyle: 'large',
      spinnerColor: '#2FB190',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#18223b',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    preferredContentMode: 'mobile',
    scheme: 'AniReserve',
  },
};

export default config;
EOF

echo "✅ capacitor.config.ts mis à jour"
echo ""
echo "📱 Prochaine étape - Test iOS:"
echo "   npx cap sync"
echo "   npx cap open ios"
echo ""
echo "🤖 Prochaine étape - Test Android:"
echo "   npx cap sync"
echo "   npx cap open android"
