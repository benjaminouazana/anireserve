import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anireserve.app',
  appName: 'AniReserve',
  webDir: 'apps/web/.next',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'anireserve.com',
    url: 'https://anireserve.com',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#f0f9f7',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#2FB190',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#f0f9f7',
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
    webContentsDebuggingEnabled: false,
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    preferredContentMode: 'mobile',
  },
};

export default config;



