# 🔑 Créer une Clé API Resend avec Permissions Complètes

## ❌ Problème actuel

Votre clé API actuelle (`re_YaufuMTW_LVJ8N4CdbffuSEVU6B1EYMrx`) est **restreinte** et ne peut que :
- ✅ Envoyer des emails
- ❌ Gérer les domaines (créer, vérifier, mettre à jour)

## ✅ Solution : Créer une nouvelle clé API

### Étape 1 : Se connecter à Resend

1. Allez sur [https://resend.com](https://resend.com)
2. Connectez-vous à votre compte
3. Allez dans **Settings** → **API Keys** (ou directement [https://resend.com/api-keys](https://resend.com/api-keys))

### Étape 2 : Créer une nouvelle clé API

1. Cliquez sur **"Create API Key"** ou **"Add API Key"**
2. Donnez un nom à votre clé (ex: `AniReserve - Full Access`)
3. **IMPORTANT :** Assurez-vous que les permissions incluent :
   - ✅ **Send emails** (déjà activé)
   - ✅ **Manage domains** (à activer)
   - ✅ **Full access** (recommandé pour simplifier)

4. Cliquez sur **"Create"** ou **"Add"**

### Étape 3 : Copier la nouvelle clé API

⚠️ **ATTENTION :** La clé ne sera affichée qu'une seule fois ! Copiez-la immédiatement.

La clé ressemblera à : `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Étape 4 : Mettre à jour la clé dans le projet

Une fois que vous avez la nouvelle clé, vous avez deux options :

#### Option A : Mettre à jour via variable d'environnement (RECOMMANDÉ)

1. Créez ou modifiez le fichier `.env.local` dans `apps/web/` :

```bash
cd ~/Desktop/aniresa/AniReserve/apps/web
nano .env.local
```

2. Ajoutez ou modifiez :

```env
RESEND_API_KEY=re_VOTRE_NOUVELLE_CLE_ICI
```

3. Sauvegardez (Ctrl+O, puis Ctrl+X dans nano)

#### Option B : Mettre à jour directement dans le code (temporaire)

Modifiez `apps/web/src/lib/resend-config.ts` :

```typescript
const resend = new Resend('re_VOTRE_NOUVELLE_CLE_ICI');
```

Et `scripts/manage-resend-domains.js` :

```javascript
const resendApiKey = process.env.RESEND_API_KEY || 're_VOTRE_NOUVELLE_CLE_ICI';
```

### Étape 5 : Tester la nouvelle clé

```bash
cd ~/Desktop/aniresa/AniReserve
npm run manage:domains list
```

Si ça fonctionne, vous verrez la liste des domaines (ou une liste vide si c'est la première fois).

### Étape 6 : Configurer le domaine

```bash
npm run manage:domains setup anireserve.com
```

## 🔒 Sécurité

### Bonnes pratiques

1. **Ne commitez JAMAIS la clé API dans Git**
   - Utilisez `.env.local` (déjà dans `.gitignore`)
   - Ne partagez pas la clé publiquement

2. **Utilisez des clés différentes pour dev/prod**
   - Clé de développement : pour tester
   - Clé de production : pour le serveur

3. **Limitez les permissions si possible**
   - En production, créez une clé avec seulement les permissions nécessaires
   - En développement, vous pouvez utiliser "Full access" pour simplifier

## 📋 Checklist

- [ ] Connecté à Resend.com
- [ ] Créé une nouvelle clé API avec permissions complètes
- [ ] Copié la nouvelle clé (commence par `re_`)
- [ ] Ajouté la clé dans `apps/web/.env.local`
- [ ] Testé avec `npm run manage:domains list`
- [ ] Configuré le domaine avec `npm run manage:domains setup anireserve.com`

## ❓ Questions fréquentes

### Q: Puis-je utiliser la même clé pour envoyer des emails ET gérer les domaines ?
**R:** Oui, créez simplement une clé avec "Full access" ou activez les deux permissions.

### Q: Dois-je supprimer l'ancienne clé ?
**R:** Non, vous pouvez la garder. Mais si vous ne l'utilisez plus, vous pouvez la supprimer pour la sécurité.

### Q: La clé fonctionne pour envoyer des emails mais pas pour les domaines ?
**R:** C'est exactement votre problème actuel. Créez une nouvelle clé avec les permissions complètes.

### Q: Comment savoir quelles permissions a ma clé ?
**R:** Allez sur [https://resend.com/api-keys](https://resend.com/api-keys) et regardez les détails de votre clé.

---

**Une fois la nouvelle clé configurée, réessayez :**
```bash
npm run manage:domains setup anireserve.com
```



