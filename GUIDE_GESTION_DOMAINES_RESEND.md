# 📧 Guide de Gestion des Domaines Resend

Ce guide vous explique comment gérer vos domaines Resend pour envoyer des emails depuis votre propre domaine (ex: `noreply@anireserve.com`).

## 🎯 Pourquoi configurer un domaine personnalisé ?

- ✅ Emails envoyés depuis votre domaine (`noreply@anireserve.com` au lieu de `noreply@resend.dev`)
- ✅ Meilleure délivrabilité (réputation de domaine)
- ✅ Professionnalisme accru
- ✅ Suivi des ouvertures et clics

## 📋 Prérequis

1. **Clé API Resend** : Déjà configurée dans `apps/web/src/lib/resend-config.ts`
2. **Accès DNS** : Vous devez pouvoir modifier les enregistrements DNS de votre domaine
3. **Domaine** : `anireserve.com` (ou un sous-domaine comme `mail.anireserve.com`)

## 🚀 Configuration rapide

### Option 1 : Utiliser le script de gestion (Recommandé)

```bash
# Configuration complète automatique
npm run manage:domains setup anireserve.com

# Ou directement avec node
node scripts/manage-resend-domains.js setup anireserve.com
```

Cette commande va :
1. Créer le domaine sur Resend
2. Configurer le suivi des clics (activé) et ouvertures (désactivé)
3. Vous donner les enregistrements DNS à ajouter

### Option 2 : Configuration manuelle étape par étape

#### Étape 1 : Lister les domaines existants

```bash
npm run manage:domains list
```

#### Étape 2 : Créer un nouveau domaine

```bash
npm run manage:domains create anireserve.com
```

**Résultat attendu :**
```json
{
  "id": "5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d",
  "name": "anireserve.com",
  "created_at": "2024-01-01T00:00:00.000Z",
  "status": "pending",
  "region": "us-east-1",
  "records": [
    {
      "name": "_resend",
      "type": "TXT",
      "value": "resend-verification=abc123..."
    },
    {
      "name": "@",
      "type": "SPF",
      "value": "v=spf1 include:resend.com ~all"
    },
    {
      "name": "@",
      "type": "DKIM",
      "value": "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3..."
    },
    {
      "name": "@",
      "type": "DMARC",
      "value": "v=DMARC1; p=none; rua=mailto:dmarc@anireserve.com"
    }
  ]
}
```

#### Étape 3 : Ajouter les enregistrements DNS

**Important :** Vous devez ajouter ces enregistrements dans votre panneau DNS (Hostinger, Cloudflare, etc.)

1. **TXT Record pour vérification** :
   - Nom : `_resend`
   - Valeur : `resend-verification=abc123...` (fourni par Resend)

2. **SPF Record** :
   - Nom : `@` (ou `anireserve.com`)
   - Type : `TXT`
   - Valeur : `v=spf1 include:resend.com ~all`

3. **DKIM Record** :
   - Nom : `resend._domainkey` (ou similaire)
   - Type : `TXT`
   - Valeur : `v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3...` (fourni par Resend)

4. **DMARC Record** (optionnel mais recommandé) :
   - Nom : `_dmarc`
   - Type : `TXT`
   - Valeur : `v=DMARC1; p=none; rua=mailto:dmarc@anireserve.com`

#### Étape 4 : Attendre la propagation DNS

La propagation DNS peut prendre de **quelques minutes à 48 heures**. Vérifiez avec :

```bash
# Vérifier les enregistrements DNS
dig TXT _resend.anireserve.com
dig TXT anireserve.com
```

#### Étape 5 : Vérifier le domaine

Une fois les DNS propagés, vérifiez le domaine :

```bash
# Récupérer l'ID du domaine d'abord
npm run manage:domains list

# Puis vérifier (remplacez par l'ID réel)
npm run manage:domains verify 5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d
```

## 🔧 Commandes disponibles

### Lister tous les domaines

```bash
npm run manage:domains list
```

### Obtenir les détails d'un domaine

```bash
npm run manage:domains get <domain-id>
```

Exemple :
```bash
npm run manage:domains get 5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d
```

### Créer un nouveau domaine

```bash
npm run manage:domains create <domain-name>
```

Exemple :
```bash
npm run manage:domains create anireserve.com
```

### Vérifier un domaine

```bash
npm run manage:domains verify <domain-id>
```

### Mettre à jour les paramètres d'un domaine

```bash
npm run manage:domains update <domain-id> [--open-tracking] [--click-tracking]
```

Exemples :
```bash
# Activer le suivi des clics uniquement
npm run manage:domains update 5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d --click-tracking

# Activer le suivi des ouvertures et clics
npm run manage:domains update 5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d --open-tracking --click-tracking

# Désactiver le suivi des ouvertures (par défaut)
npm run manage:domains update 5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d
```

### Supprimer un domaine

```bash
npm run manage:domains remove <domain-id>
```

⚠️ **Attention :** Cette action est irréversible !

## 💻 Utilisation dans le code

Vous pouvez aussi utiliser les fonctions directement dans votre code TypeScript :

```typescript
import * as domainUtils from '@/lib/resend-domains';

// Lister les domaines
const domains = await domainUtils.listDomains();

// Créer un domaine
const newDomain = await domainUtils.createDomain('anireserve.com');

// Vérifier un domaine
await domainUtils.verifyDomain('5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d');

// Mettre à jour les paramètres
await domainUtils.updateDomain('5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d', {
  openTracking: false,
  clickTracking: true,
});
```

Ou utiliser directement l'instance Resend :

```typescript
import { resend } from '@/lib/resend-config';

// Toutes les opérations disponibles
const domains = await resend.domains.list();
const domain = await resend.domains.get('domain-id');
const newDomain = await resend.domains.create({ name: 'anireserve.com' });
await resend.domains.verify('domain-id');
await resend.domains.update({ id: 'domain-id', clickTracking: true });
await resend.domains.remove('domain-id');
```

## 📧 Envoyer des emails depuis votre domaine

Une fois le domaine configuré et vérifié, vous pouvez envoyer des emails depuis votre domaine :

```typescript
import { resend } from '@/lib/resend-config';

await resend.emails.send({
  from: 'AniReserve <noreply@anireserve.com>', // Utilisez votre domaine !
  to: 'client@example.com',
  subject: 'Bienvenue sur AniReserve',
  html: '<p>Bonjour !</p>',
});
```

## 🔍 Vérification du statut

Le statut d'un domaine peut être :
- `pending` : En attente de vérification DNS
- `verified` : Vérifié et prêt à l'emploi
- `failed` : Échec de vérification (vérifiez vos DNS)

Pour vérifier le statut :

```bash
npm run manage:domains get <domain-id>
```

## ❓ Problèmes courants

### Erreur : "Domain already exists"

Le domaine existe déjà. Utilisez `list` pour trouver l'ID, puis `get` pour voir les détails.

### Erreur : "DNS records not found"

Les enregistrements DNS ne sont pas encore propagés. Attendez quelques heures et réessayez.

### Erreur : "Invalid API key"

Vérifiez que votre clé API est correctement configurée dans `apps/web/src/lib/resend-config.ts`.

### Le domaine reste en "pending"

1. Vérifiez que tous les enregistrements DNS sont correctement ajoutés
2. Attendez la propagation DNS (peut prendre jusqu'à 48h)
3. Vérifiez avec `dig` ou `nslookup` que les enregistrements sont visibles

## 📚 Ressources

- [Documentation Resend - Domaines](https://resend.com/docs/dashboard/domains/introduction)
- [Guide DNS Resend](https://resend.com/docs/dashboard/domains/verify-domain)
- [API Resend - Domaines](https://resend.com/docs/api-reference/domains)

## ✅ Checklist de configuration

- [ ] Clé API Resend configurée
- [ ] Domaine créé sur Resend
- [ ] Enregistrements DNS ajoutés (TXT, SPF, DKIM, DMARC)
- [ ] Propagation DNS vérifiée
- [ ] Domaine vérifié sur Resend
- [ ] Test d'envoi d'email réussi
- [ ] Paramètres de tracking configurés

---

**Note :** Une fois le domaine configuré, tous vos emails seront automatiquement envoyés depuis `noreply@anireserve.com` (ou l'adresse que vous configurez) au lieu de `noreply@resend.dev`.

