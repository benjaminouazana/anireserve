# 🚀 Guide Installation PWA & Google Analytics

## 📦 Installation Dépendances

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve/apps/web

# PWA Support
npm install next-pwa

# Analytics (optionnel, déjà configuré)
# Installation nécessaire que si tu veux d'autres packages analytics
```

---

## 🔧 Configuration Google Analytics

### 1. Obtenir un ID Google Analytics

1. Va sur https://analytics.google.com
2. Crée un compte/propriété
3. Récupère ton ID (format: `G-XXXXXXXXXX`)

### 2. Ajouter aux variables d'environnement

**Dans `.env` (local) :**
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Sur le serveur VPS :**
```bash
ssh root@72.61.103.149
nano /var/www/anireserve/.env

# Ajoute:
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sauvegarde et redémarre
pm2 restart anireserve
```

### 3. Ajouter le composant dans Layout

**Dans `apps/web/src/app/layout.tsx` :**
```typescript
import { GoogleAnalytics } from '@/components/GoogleAnalytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <GoogleAnalytics /> {/* Ajoute cette ligne */}
        {/* ... le reste */}
      </body>
    </html>
  );
}
```

---

## 🌐 Configuration PWA

### 1. Installer next-pwa

```bash
npm install next-pwa
```

### 2. Mettre à jour next.config.js

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // ... ta config existante
});
```

### 3. Vérifier manifest.json

Le fichier `public/manifest.json` existe déjà. Vérifie qu'il contient:
```json
{
  "name": "AniReserve",
  "short_name": "AniReserve",
  "description": "Réservation de professionnels en Israël",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#18223b",
  "theme_color": "#2FB190",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🎨 Créer les Icons PWA

**Option 1 - Utiliser un générateur:**
https://realfavicongenerator.net

Upload ton logo, génère toutes les tailles.

**Option 2 - Manuel:**
Crée dans `public/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `apple-touch-icon.png` (180x180)

---

## ✅ Tester PWA

### Développement Local
```bash
npm run build
npm start  # Pas npm run dev
```

Ouvre Chrome DevTools → Application → Service Workers

### Production
1. Deploy sur https://anireserve.com
2. Ouvre le site sur mobile (Chrome/Safari)
3. Attends le popup "Ajouter à l'écran d'accueil"

---

## 📊 Vérifier Analytics

1. Attends 24-48h après installation
2. Va sur Google Analytics
3. Tu verras les stats en temps réel

---

## 🚀 Deploy Sur VPS

Une fois configuré localement:

```bash
# Build
cd /Users/macbookpro/Desktop/aniresa/AniReserve/apps/web
npm run build

# Deploy
cd ..
./update-vps.sh
```

---

**Note:** PWA fonctionne seulement avec HTTPS (tu l'as déjà ✅)
