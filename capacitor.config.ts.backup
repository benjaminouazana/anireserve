import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anireserve.app',
  appName: 'AniReserve',
  webDir: 'apps/web/out', // Point vers le build statique (next export)
  server: {
    // Pour le développement, commenter url pour utiliser l'app en local
    // Pour la production, décommenter et mettre l'URL de prod
    // url: 'https://anireserve.com',
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'localhost', // Pour dev local
    cleartext: true, // Permettre HTTP en dev
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#18223b', // Couleur principale
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      iosSpinnerStyle: 'large',
      spinnerColor: '#2FB190', // Couleur accent
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
    webContentsDebuggingEnabled: true, // Activer pour debug
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    preferredContentMode: 'mobile',
    scheme: 'AniReserve', // Scheme personnalisé pour iOS
  },
};

export default config;




