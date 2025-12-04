# 🔄 Mise à Jour Rapide de la Clé API Resend

## 🚀 Instructions rapides

### 1. Créer une nouvelle clé sur Resend

1. Allez sur [https://resend.com/api-keys](https://resend.com/api-keys)
2. Cliquez sur **"Create API Key"**
3. Nom : `AniReserve - Full Access`
4. Permissions : **Full access** (ou au minimum : Send emails + Manage domains)
5. **Copiez la clé** (elle commence par `re_`)

### 2. Mettre à jour dans le projet

```bash
# Aller dans le dossier web
cd ~/Desktop/aniresa/AniReserve/apps/web

# Créer/modifier le fichier .env.local
nano .env.local
```

Ajoutez ou modifiez cette ligne :
```env
RESEND_API_KEY=re_VOTRE_NOUVELLE_CLE_ICI
```

Sauvegardez : `Ctrl+O` puis `Entrée`, puis `Ctrl+X`

### 3. Tester

```bash
# Retourner à la racine
cd ~/Desktop/aniresa/AniReserve

# Tester la nouvelle clé
npm run manage:domains list
```

Si ça fonctionne, vous verrez soit une liste de domaines, soit `{ "data": [] }` (liste vide).

### 4. Configurer le domaine

```bash
npm run manage:domains setup anireserve.com
```

---

**C'est tout !** 🎉



