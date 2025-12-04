# 📧 Instructions Terminal : Gestion des Domaines Resend

## 🖥️ Depuis votre Mac (pas besoin de se connecter au serveur)

### Étape 1 : Ouvrir le terminal sur votre Mac

Ouvrez l'application **Terminal** (ou iTerm) sur votre Mac.

### Étape 2 : Aller dans le dossier du projet

```bash
cd ~/Desktop/aniresa/AniReserve
```

### Étape 3 : Vérifier que vous êtes au bon endroit

```bash
pwd
# Devrait afficher : /Users/macbookpro/Desktop/aniresa/AniReserve
```

### Étape 4 : Lister les domaines existants (optionnel)

Pour voir si vous avez déjà des domaines configurés :

```bash
npm run manage:domains list
```

### Étape 5 : Configurer votre domaine

**Option A : Configuration complète automatique (RECOMMANDÉ)**

```bash
npm run manage:domains setup anireserve.com
```

Cette commande va :
- ✅ Créer le domaine `anireserve.com` sur Resend
- ✅ Configurer le suivi des clics (activé)
- ✅ Configurer le suivi des ouvertures (désactivé)
- ✅ Vous afficher les enregistrements DNS à ajouter

**Option B : Créer le domaine manuellement**

```bash
# 1. Créer le domaine
npm run manage:domains create anireserve.com
```

Vous obtiendrez quelque chose comme :
```json
{
  "id": "5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d",
  "name": "anireserve.com",
  "records": [
    {
      "name": "_resend",
      "type": "TXT",
      "value": "resend-verification=abc123..."
    },
    // ... autres enregistrements
  ]
}
```

**⚠️ IMPORTANT : Notez l'ID du domaine** (ex: `5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d`)

### Étape 6 : Ajouter les enregistrements DNS

1. **Connectez-vous à votre panneau DNS** (Hostinger, Cloudflare, etc.)
2. **Ajoutez les enregistrements** affichés par la commande précédente :
   - TXT record pour `_resend`
   - SPF record
   - DKIM record
   - DMARC record (optionnel)

### Étape 7 : Attendre la propagation DNS

La propagation peut prendre de **quelques minutes à 48 heures**.

Vérifier la propagation :
```bash
# Sur votre Mac
dig TXT _resend.anireserve.com
```

### Étape 8 : Vérifier le domaine sur Resend

Une fois les DNS propagés :

```bash
# Remplacez par l'ID réel de votre domaine
npm run manage:domains verify 5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d
```

## 🔧 Autres commandes utiles

### Mettre à jour les paramètres d'un domaine

```bash
# Activer le suivi des clics uniquement
npm run manage:domains update <domain-id> --click-tracking

# Activer les deux
npm run manage:domains update <domain-id> --open-tracking --click-tracking
```

### Obtenir les détails d'un domaine

```bash
npm run manage:domains get <domain-id>
```

## 🖥️ Si vous devez vous connecter au serveur (pour autre chose)

### Se connecter au serveur VPS

```bash
ssh root@72.61.103.149
```

Ou avec votre clé SSH :
```bash
ssh -i ~/.ssh/votre_cle root@72.61.103.149
```

### Une fois connecté au serveur

**⚠️ Note :** La gestion des domaines Resend se fait depuis votre Mac, PAS depuis le serveur.

Cependant, si vous voulez mettre à jour le code sur le serveur après avoir configuré les domaines :

```bash
# Sur le serveur
cd ~/anireserve
git pull origin main
cd apps/web
npm install
npm run build
pm2 restart all
```

## 📋 Checklist complète

- [ ] Terminal ouvert sur votre Mac
- [ ] Aller dans le dossier du projet : `cd ~/Desktop/aniresa/AniReserve`
- [ ] Exécuter : `npm run manage:domains setup anireserve.com`
- [ ] Noter l'ID du domaine créé
- [ ] Noter les enregistrements DNS à ajouter
- [ ] Ajouter les enregistrements DNS dans Hostinger/Cloudflare
- [ ] Attendre la propagation DNS (vérifier avec `dig`)
- [ ] Vérifier le domaine : `npm run manage:domains verify <domain-id>`
- [ ] (Optionnel) Mettre à jour le code sur le serveur si nécessaire

## ❓ Questions fréquentes

### Q: Dois-je me connecter au serveur ?
**R:** Non, la gestion des domaines Resend se fait depuis votre Mac via l'API Resend.

### Q: Pourquoi ça ne marche pas ?
**R:** Vérifiez que :
- Vous êtes dans le bon dossier (`~/Desktop/aniresa/AniReserve`)
- La clé API Resend est correcte dans `apps/web/src/lib/resend-config.ts`
- Vous avez installé les dépendances : `npm install`

### Q: Comment savoir si les DNS sont propagés ?
**R:** Utilisez :
```bash
dig TXT _resend.anireserve.com
dig TXT anireserve.com
```

Si vous voyez les valeurs attendues, c'est bon !

### Q: Le domaine reste en "pending", que faire ?
**R:** 
1. Vérifiez que tous les enregistrements DNS sont correctement ajoutés
2. Attendez plus longtemps (jusqu'à 48h)
3. Vérifiez avec `dig` que les DNS sont visibles

---

**Résumé :** Tout se fait depuis votre Mac, pas besoin de se connecter au serveur pour gérer les domaines Resend ! 🎉



