# 🔧 Correction du Build Vercel

## ❌ Problème

L'erreur :
```
sh: line 1: cd: apps/web: No such file or directory
```

Cela signifie que Vercel ne trouve pas le dossier `apps/web`.

## ✅ Solution

### Option 1 : Vérifier le Root Directory (Recommandé)

Dans Vercel, vérifiez que le **Root Directory** est bien configuré :

1. Allez dans votre projet Vercel
2. **Settings** → **General**
3. Cherchez **"Root Directory"**
4. Il doit être : `apps/web`
5. Si ce n'est pas le cas, cliquez sur **"Edit"** et mettez : `apps/web`
6. Sauvegardez

### Option 2 : Modifier la Build Command

Si le Root Directory est déjà `apps/web`, alors Vercel est déjà dans ce dossier.

**Modifiez la Build Command** dans Vercel :

**Au lieu de :**
```
cd apps/web && npx prisma generate && npm run build
```

**Mettez :**
```
npx prisma generate && npm run build
```

### Option 3 : Build Command Complète (Si Root Directory = racine)

Si le Root Directory est à la racine du projet :

**Build Command :**
```
cd apps/web && npx prisma generate && npm run build
```

**Output Directory :**
```
apps/web/.next
```

**Install Command :**
```
npm install
```

---

## 🎯 Configuration Recommandée

### Dans Vercel :

**Root Directory :** `apps/web`

**Build Command :**
```
npx prisma generate && npm run build
```

**Output Directory :**
```
.next
```

**Install Command :**
```
npm install
```

---

## 📝 Étapes

1. Allez dans Vercel → Votre projet → **Settings** → **General**
2. Vérifiez/modifiez le **Root Directory** : `apps/web`
3. Allez dans **Settings** → **Build & Development Settings**
4. Modifiez la **Build Command** : `npx prisma generate && npm run build`
5. Vérifiez **Output Directory** : `.next`
6. **Redéployez** (ou faites un nouveau commit)

---

**Dernière mise à jour** : $(date)

