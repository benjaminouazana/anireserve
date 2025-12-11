import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anireserve.app',
  appName: 'AniReserve',
  webDir: 'apps/web/out',
  server: {
    url: 'https://anireserve.com',  // Backend production HTTPS
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





