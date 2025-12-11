# 🐾 AniReserve - Plateforme de Réservation Professionnels

> Application mobile et web pour réserver des services professionnels en Israël (Coiffeurs, Médecins, Dentistes, etc.)

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-6-blue)](https://capacitorjs.com/)
[![iOS](https://img.shields.io/badge/iOS-Ready-success)](https://developer.apple.com/app-store/)
[![Android](https://img.shields.io/badge/Android-Ready-success)](https://play.google.com/)

---

## 📱 Plateformes Supportées

- ✅ **iOS** (App Store ready)
- ✅ **Android** (Play Store ready)
- ✅ **Web** (Progressive Web App)

---

## 🚀 Quick Start

### Prérequis

- Node.js 18+
- npm ou yarn
- PostgreSQL (ou Supabase)
- Compte Resend (emails)

### Installation

```bash
# Clone le repo
git clone https://github.com/ton-username/AniReserve.git
cd AniReserve

# Installe les dépendances
npm install

# Configure les variables d'environnement
cp .env.example .env
# Édite .env avec tes clés

# Génère Prisma Client
npx prisma generate

# Lance le serveur dev
cd apps/web
npm run dev
```

**Ouvre:** `http://localhost:3000`

---

## 🏗️ Architecture

```
anireserve/
├── apps/
│   └── web/                 # Application Next.js 15
│       ├── src/
│       │   ├── app/         # App Router (pages & API)
│       │   ├── components/  # Composants React
│       │   └── lib/         # Utils & configs
│       └── package.json
├── prisma/
│   └── schema.prisma        # Database schema
├── capacitor.config.ts      # Config mobile iOS/Android
└── MOBILE_BUILD_GUIDE.md    # Guide déploiement stores
```

### Stack Technique

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL / Supabase
- Resend (emails)

**Mobile:**
- Capacitor 6
- iOS & Android support

**Sécurité:**
- Rate Limiting (5 APIs)
- CSRF Protection
- Zod Validation
- bcrypt (passwords)

---

## 📚 Documentation

- **[MOBILE_BUILD_GUIDE.md](./MOBILE_BUILD_GUIDE.md)** - Déploiement iOS/Android
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Checklist déploiement
- **[walkthrough.md](./walkthrough.md)** - Améliorations récentes

---

## 🔐 Variables d'Environnement

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/anireserve"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Email
RESEND_API_KEY="re_***"

# Optional
STRIPE_SECRET_KEY="sk_***"
```

---

## 📱 Build Mobile

### iOS (App Store)

```bash
# Sync Capacitor
npx cap sync

# Ouvre Xcode
npx cap open ios

# Build & Archive dans Xcode
```

**Voir:** `MOBILE_BUILD_GUIDE.md` pour détails complets

### Android (Play Store)

```bash
# Sync Capacitor
npx cap sync

# Ouvre Android Studio
npx cap open android

# Build AAB dans Android Studio
```

---

## 🧪 Tests

```bash
# Tests unitaires (à venir)
npm test

# Build production
npm run build
```

---

## 🚀 Déploiement

### Backend (Vercel - Recommandé)

1. Push sur GitHub ✅
2. Import sur [Vercel](https://vercel.com)
3. Configure env vars
4. Deploy automatique

### Backend (VPS)

Voir `MOBILE_BUILD_GUIDE.md` section VPS

---

## 🔒 Sécurité

- ✅ Rate Limiting (login, register, booking)
- ✅ CSRF Protection (mobile-compatible)
- ✅ Input Validation (Zod schemas)
- ✅ Password Hashing (bcrypt)
- ✅ SQL Injection Protection (Prisma)

---

## ⚡ Performance

- ✅ Images optimisées (AVIF, WebP, cache 30j)
- ✅ Lazy loading composants
- ✅ Code splitting automatique
- ✅ Prisma queries optimisées
- ✅ HTTP caching configuré

---

## 🤝 Contribution

Les contributions sont bienvenues !

1. Fork le projet
2. Crée une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvre une Pull Request

---

## 📄 License

MIT License - Voir fichier LICENSE

---

## 🙏 Remerciements

- Next.js Team
- Capacitor Team
- Supabase
- Resend

---

## 📞 Support

- Email: support@anireserve.com
- Documentation: [Voir MOBILE_BUILD_GUIDE.md]
- Issues: [GitHub Issues](https://github.com/ton-username/AniReserve/issues)

---

**Créé avec ❤️ pour la communauté française en Israël**
