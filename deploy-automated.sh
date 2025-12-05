#!/bin/bash

# 🚀 Script d'automatisation complète pour AniReserve
# Exécute toutes les étapes : install, build, git push

set -e  # Arrêter si erreur

PROJECT_DIR="/Users/macbookpro/Desktop/aniresa/AniReserve"

echo "🎯 AniReserve - Automatisation Complète"
echo "========================================"
echo ""

# Vérifier que le projet existe
if [ ! -d "$PROJECT_DIR" ]; then
  echo "❌ Erreur: Projet non trouvé à $PROJECT_DIR"
  exit 1
fi

cd "$PROJECT_DIR"
echo "📂 Dossier: $PROJECT_DIR"
echo ""

# ============================================
# ÉTAPE 1: INSTALLER DÉPENDANCES
# ============================================
echo "📦 ÉTAPE 1/5: Installation dépendances..."
cd apps/web
npm install zod --save
echo "✅ Zod installé"
echo ""

# ============================================
# ÉTAPE 2: GÉNÉRER PRISMA CLIENT
# ============================================
echo "🔧 ÉTAPE 2/5: Génération Prisma Client..."
cd "$PROJECT_DIR"
npx prisma generate
echo "✅ Prisma Client généré"
echo ""

# ============================================
# ÉTAPE 3: BUILD NEXT.JS
# ============================================
echo "🏗️  ÉTAPE 3/5: Build Next.js..."
cd apps/web
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build réussi!"
else
  echo "❌ Build échoué"
  exit 1
fi
echo ""

# ============================================
# ÉTAPE 4: GIT ADD
# ============================================
echo "📝 ÉTAPE 4/5: Git add..."
cd "$PROJECT_DIR"
git add .
echo "✅ Fichiers ajoutés"
echo ""

# ============================================
# ÉTAPE 5: GIT COMMIT & PUSH
# ============================================
echo "🚀 ÉTAPE 5/5: Git commit & push..."

# Commit
git commit -m "feat: iOS/Android ready + security + performance

🚀 Mobile: Capacitor configured for App/Play Store
🔒 Security: Rate limiting + CSRF + Zod validation  
⚡ Performance: Lazy loading + optimized images
📱 Ready for production deployment"

echo "✅ Commit créé"

# Push
echo ""
echo "📤 Push vers GitHub..."
git push origin main

if [ $? -eq 0 ]; then
  echo "✅ Push réussi sur GitHub!"
else
  echo "⚠️  Tentative avec master..."
  git push origin master
  
  if [ $? -eq 0 ]; then
    echo "✅ Push réussi sur GitHub (master)!"
  else
    echo "❌ Push échoué"
    echo "Essaye manuellement: git push origin <ta-branche>"
    exit 1
  fi
fi

echo ""
echo "============================================"
echo "🎉 TOUTES LES ÉTAPES COMPLÉTÉES !"
echo "============================================"
echo ""
echo "✅ Dépendances installées"
echo "✅ Prisma Client généré"
echo "✅ Build Next.js réussi"
echo "✅ Code committé et pushé sur GitHub"
echo ""
echo "📱 Prochaines étapes:"
echo "  1. Déployer backend (Vercel ou VPS)"
echo "  2. Tester sur iOS: npx cap open ios"
echo "  3. Tester sur Android: npx cap open android"
echo ""
echo "📚 Voir DEPLOYMENT_CHECKLIST.md pour plus de détails"
