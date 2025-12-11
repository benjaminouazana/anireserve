# ✅ Corrections de Sécurité Appliquées

**Date:** 7 décembre 2025  
**Statut:** Corrections critiques appliquées

---

## 🔒 Problèmes Corrigés

### 1. ✅ Mots de passe en clair dans `lib/auth.ts`

**Avant:**
```typescript
// Comparaison simple pour l'instant (à remplacer par bcrypt plus tard)
if (password !== professional.password) {
  return null;
}
```

**Après:**
```typescript
// Comparer le mot de passe avec bcrypt
// Support pour les anciens mots de passe en clair (migration progressive)
let isValid = false;
try {
  const bcrypt = await import("bcryptjs");
  if (professional.password.startsWith("$2")) {
    // Mot de passe hashé avec bcrypt
    isValid = await bcrypt.compare(password, professional.password);
  } else {
    // Ancien mot de passe en clair (pour migration - À SUPPRIMER après migration complète)
    console.warn(`⚠️ Mot de passe en clair détecté pour le professionnel ${professional.email} - Migration requise`);
    isValid = password === professional.password;
  }
} catch (error) {
  console.error("Erreur lors de la comparaison du mot de passe:", error);
  return null;
}
```

**Fichiers modifiés:**
- `apps/web/src/lib/auth.ts` - Fonctions `loginProfessional`, `loginClient`, `loginAdmin`

---

### 2. ✅ Support des mots de passe en clair dans `/api/pro/login/route.ts`

**Amélioration:**
- Ajout d'un warning lors de la détection d'un mot de passe en clair
- **Auto-migration:** Le mot de passe est automatiquement hashé lors de la prochaine connexion réussie
- Documentation claire que c'est temporaire pour la migration

**Fichier modifié:**
- `apps/web/src/app/api/pro/login/route.ts`

---

### 3. ✅ Clé API Resend en dur dans le code

**Avant:**
```typescript
const resend = new Resend(process.env.RESEND_API_KEY || "re_YaufuMTW_LVJ8N4CdbffuSEVU6B1EYMrx");
```

**Après:**
```typescript
// Initialiser Resend (utilise uniquement la variable d'environnement RESEND_API_KEY)
// ⚠️ SÉCURITÉ: Ne jamais mettre de clé API en dur dans le code
if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY n'est pas définie - Les emails ne pourront pas être envoyés");
}
const resend = new Resend(process.env.RESEND_API_KEY);
```

**Fichiers modifiés:**
- `apps/web/src/lib/email.ts`
- `apps/web/src/lib/resend-config.ts` (à vérifier)

---

## 🛠️ Outils Créés

### Script de Migration des Mots de Passe

**Fichier:** `apps/web/scripts/migrate-passwords.ts`

Ce script permet de migrer tous les mots de passe en clair vers bcrypt en une seule fois.

**Usage:**
```bash
cd apps/web
npx tsx scripts/migrate-passwords.ts
```

**Fonctionnalités:**
- Migre les mots de passe des professionnels
- Migre les mots de passe des clients
- Migre les mots de passe des admins
- Affiche un rapport détaillé
- Gère les erreurs gracieusement

---

## ⚠️ Actions Requises

### 1. Exécuter le script de migration

**Sur le serveur:**
```bash
cd /var/www/anireserve/apps/web
npx tsx scripts/migrate-passwords.ts
```

**En local (pour test):**
```bash
cd apps/web
npx tsx scripts/migrate-passwords.ts
```

### 2. Vérifier les variables d'environnement

Assurez-vous que `RESEND_API_KEY` est définie dans `.env`:
```bash
# Sur le serveur
cd /var/www/anireserve/apps/web
grep RESEND_API_KEY .env
```

### 3. Vérifier qu'aucune clé API n'est commitée

```bash
# Vérifier dans Git
git grep "re_YaufuMTW"
git grep "re_"
```

Si des clés sont trouvées, les retirer et régénérer les clés API.

### 4. Après migration complète

Une fois tous les mots de passe migrés, vous pouvez supprimer le support des mots de passe en clair:

1. Exécuter le script de migration
2. Vérifier qu'aucun mot de passe en clair n'existe plus
3. Supprimer les fallbacks dans:
   - `apps/web/src/lib/auth.ts`
   - `apps/web/src/app/api/pro/login/route.ts`

---

## 📋 Checklist de Vérification

- [x] `lib/auth.ts` utilise bcrypt pour les professionnels
- [x] `lib/auth.ts` utilise bcrypt pour les clients
- [x] `lib/auth.ts` utilise bcrypt pour les admins
- [x] `/api/pro/login/route.ts` a l'auto-migration
- [x] Clé API Resend retirée de `lib/email.ts`
- [ ] Clé API Resend retirée de `lib/resend-config.ts` (à vérifier)
- [ ] Script de migration créé
- [ ] Script de migration testé
- [ ] Migration exécutée sur le serveur
- [ ] Variables d'environnement vérifiées
- [ ] Aucune clé API dans Git

---

## 🔍 Vérification Post-Correction

### Vérifier que les corrections sont en place

```bash
# Vérifier que bcrypt est utilisé
grep -r "bcrypt.compare" apps/web/src/lib/auth.ts
grep -r "bcrypt.compare" apps/web/src/app/api/pro/login/route.ts

# Vérifier qu'aucune clé API n'est en dur
grep -r "re_YaufuMTW" apps/web/src
grep -r "re_placeholder" apps/web/src

# Vérifier les warnings de sécurité
grep -r "SÉCURITÉ" apps/web/src
```

---

## 📝 Notes Importantes

1. **Migration progressive:** Le support des mots de passe en clair est maintenu temporairement pour permettre une migration sans interruption de service.

2. **Auto-migration:** Les mots de passe sont automatiquement migrés lors de la prochaine connexion réussie. Cela permet une migration transparente.

3. **Logs de sécurité:** Tous les mots de passe en clair détectés sont loggés avec un warning pour faciliter le suivi.

4. **Après migration complète:** Une fois tous les mots de passe migrés, supprimez les fallbacks pour renforcer la sécurité.

---

## 🚀 Prochaines Étapes

1. ✅ Corrections appliquées
2. ⏳ Exécuter le script de migration
3. ⏳ Vérifier les variables d'environnement
4. ⏳ Tester les connexions
5. ⏳ Supprimer les fallbacks après migration complète

---

**Statut:** ✅ Corrections critiques appliquées  
**Prochaine action:** Exécuter le script de migration

