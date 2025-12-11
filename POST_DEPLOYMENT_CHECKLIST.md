# ⚡ CHECKLIST POST-DÉPLOIEMENT

## ✅ STATUT ACTUEL

- [x] Code sur GitHub
- [x] Backend déployé sur VPS (72.61.103.149)
- [x] App accessible: http://72.61.103.149
- [x] PM2 configuré
- [x] Nginx configuré

---

## 🔐 1. SÉCURITÉ & SSL (Priorité Haute)

### Option A: Avec Domaine (Recommandé)

**Prérequis:** Avoir un nom de domaine

**1. Configure DNS:**
```
Type A: @ → 72.61.103.149
Type A: www → 72.61.103.149
```

**2. Installe Certbot:**
```bash
ssh root@72.61.103.149
apt install -y certbot python3-certbot-nginx
certbot --nginx -d tondomaine.com -d www.tondomaine.com
```

**3. Teste renouvellement:**
```bash
certbot renew --dry-run
```

**4. Update .env:**
```bash
nano /var/www/anireserve/.env
# Change: NEXT_PUBLIC_BASE_URL="https://tondomaine.com"
pm2 restart anireserve
```

### Option B: Sans Domaine

Continue avec HTTP (pas idéal pour production mais fonctionne)

---

## 📱 2. TEST APP MOBILE (30min)

### iOS

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve

# Update capacitor.config.ts avec l'URL serveur
nano capacitor.config.ts
# server.url = "http://72.61.103.149"

npx cap sync
npx cap open ios
```

**Dans Xcode:** Run sur simulateur

### Android

```bash
npx cap sync
npx cap open android
```

**Dans Android Studio:** Run sur émulateur

### Checklist Tests
- [ ] Page d'accueil charge
- [ ] Recherche professionnels fonctionne
- [ ] Formulaire login accessible
- [ ] Formulaire inscription fonctionne
- [ ] Réservation fonctionnelle (si DB configurée)

---

## 🎨 3. PRÉPARATION STORES (2-3h)

### Screenshots

**iOS (requis):**
- iPhone 6.7" (1290x2796)
- iPhone 6.5" (1242x2688)
- iPhone 5.5" (1242x2208)

**Android (requis):**
- Phone (1080x1920)
- 7" Tablet (1200x1920)
- 10" Tablet (1600x2560)

**Outils:**
- Simulateurs iOS/Android
- Cmd+S (Xcode) ou Play button screenshot (Android Studio)

### Descriptions

**Titre:** AniReserve - Réservations Pro

**Description courte (80 chars):**
"Réservez facilement coiffeurs, médecins, dentistes en Israël 🇮🇱"

**Description longue:**
```
Trouvez et réservez des professionnels francophones en Israël.

✨ FONCTIONNALITÉS
• Recherche par ville et service
• Profils vérifiés
• Réservation en ligne
• Avis clients
• Disponibilités en temps réel

🎯 SERVICES
Coiffeurs, Médecins, Dentistes, Ostéo, Kiné, Psys, et plus!

🌍 VILLES
Tel Aviv, Jérusalem, Netanya, Ashdod, etc.

Rejoignez la communauté francophone! 🇫🇷🇮🇱
```

### Documents Légaux

**Privacy Policy & Terms:**
- Crée une page simple sur ton domaine
- Ou utilise un générateur gratuit
- Lien requis pour stores

---

## 🍎 4. SOUMISSION APP STORE (2-3h)

### Prérequis
- [ ] Compte Apple Developer (99$/an)
- [ ] Xcode installé
- [ ] App ID créé
- [ ] Provisioning profiles

### Étapes

**1. App Store Connect:**
- Crée nouvelle app
- Bundle ID: `com.anireserve.app`
- Nom: AniReserve

**2. Xcode:**
```bash
npx cap open ios
```
- Product → Archive
- Distribute App
- App Store Connect
- Upload

**3. App Store Connect:**
- Upload screenshots
- Description
- Mots-clés: réservation,professionnel,israël,francophone
- Catégorie: Utilitaires / Voyages
- Privacy Policy URL
- Submit for Review

**Temps review:** 1-2 jours

---

## 🤖 5. SOUMISSION PLAY STORE (2-3h)

### Prérequis
- [ ] Compte Google Play Developer (25$ one-time)
- [ ] Android Studio installé
- [ ] Keystore créé

### Étapes

**1. Génère Keystore:**
```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve/android/app
keytool -genkey -v -keystore anireserve.keystore \
  -alias anireserve -keyalg RSA -keysize 2048 -validity 10000
```

**2. Build AAB:**
```bash
npx cap open android
# Build → Generate Signed Bundle/APK → AAB
```

**3. Play Console:**
- Crée nouvelle app
- Upload AAB (Production → Create release)
- Screenshots
- Description
- Catégorie: Voyages et infos locales
- Privacy Policy
- Submit for Review

**Temps review:** Quelques heures

---

## 📊 6. MONITORING (Optionnel)

### Analytics

**Suggestions:**
- Google Analytics
- Mixpanel
- Amplitude

### Error Tracking

**Suggestions:**
- Sentry
- LogRocket
- Bugsnag

---

## ✅ CHECKLIST FINALE

**Avant lancement:**
- [ ] SSL configuré (si domaine)
- [ ] App testée iOS
- [ ] App testée Android
- [ ] Screenshots préparés
- [ ] Descriptions rédigées
- [ ] Privacy Policy publiée
- [ ] App Store soumise
- [ ] Play Store soumis
- [ ] Monitoring configuré

**Après validation:**
- [ ] Annonce sur réseaux sociaux
- [ ] Email communauté
- [ ] Ads (optionnel)
- [ ] SEO web

---

**Temps total estimé:** 6-10h jusqu'au lancement
**Timeline:** 1-2 semaines avec review stores

🚀 **Bon courage !**
