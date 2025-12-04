# ✅ Prochaines Étapes : Configuration du Domaine Resend

## 📊 État Actuel

- ✅ Nouvelle clé API Resend créée et configurée
- ✅ Domaine `anireserve.com` existe sur Resend
- ✅ ID du domaine : `633d2d3f-3787-4bb8-94b4-73d1181ed560`
- ⏳ Statut : **"pending"** (en attente de configuration DNS)

## 🎯 Ce qu'il reste à faire

### Étape 1 : Ajouter les Enregistrements DNS dans Hostinger

1. **Connectez-vous à Hostinger**
   - Allez sur [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Connectez-vous à votre compte

2. **Accédez à la gestion DNS**
   - Allez dans **Domains** → **anireserve.com** → **DNS / Nameservers**
   - Ou directement dans **DNS Zone Editor**

3. **Ajoutez ces 3 enregistrements :**

#### Enregistrement 1 : DKIM (TXT)
```
Type : TXT
Nom : resend._domainkey
Valeur : p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9KJJKjGwWQaRNGhOcpRN6jFPtpwEUM+fqoOiLIl8//qyq0tF1y9weuc60WxcOwyeU0M5fv1OQWsKhfYHZgmKk6wZ/QZp3ADC2Qpe4/agqvWE0A5FbeugjbcsAWADkRN5O/NmhbwlRLOxRBiBrhJhFu+q2uDNKk7B/TBYF8qpgdQIDAQAB
TTL : 3600
```

#### Enregistrement 2 : SPF (TXT)
```
Type : TXT
Nom : send
Valeur : v=spf1 include:amazonses.com ~all
TTL : 3600
```

#### Enregistrement 3 : MX
```
Type : MX
Nom : send
Valeur : feedback-smtp.us-east-1.amazonses.com
Priorité : 10
TTL : 3600
```

### Étape 2 : Attendre la Propagation DNS

- ⏱️ **Temps d'attente :** 5-10 minutes minimum (parfois jusqu'à 48h)
- 🔍 **Vérifier la propagation :**

```bash
# Sur votre Mac, dans le Terminal
dig TXT resend._domainkey.anireserve.com
dig TXT send.anireserve.com
dig MX send.anireserve.com
```

Si vous voyez les valeurs que vous avez ajoutées, c'est bon !

### Étape 3 : Vérifier le Domaine sur Resend

Une fois les DNS propagés (après 5-10 minutes) :

```bash
cd ~/Desktop/aniresa/AniReserve

# Vérifier le domaine
npm run manage:domains verify 633d2d3f-3787-4bb8-94b4-73d1181ed560

# Vérifier le statut
npm run manage:domains get 633d2d3f-3787-4bb8-94b4-73d1181ed560
```

Le statut devrait passer de `"pending"` à `"verified"` ✅

## 📚 Guides Disponibles

- **`AJOUTER_ENREGISTREMENTS_DNS.md`** - Guide détaillé avec tous les enregistrements
- **`GUIDE_GESTION_DOMAINES_RESEND.md`** - Guide complet de gestion des domaines

## ✅ Checklist Finale

- [ ] Ajouté l'enregistrement DKIM (`resend._domainkey`)
- [ ] Ajouté l'enregistrement SPF (`send` TXT)
- [ ] Ajouté l'enregistrement MX (`send` MX)
- [ ] Attendu 5-10 minutes
- [ ] Vérifié avec `dig` que les DNS sont propagés
- [ ] Relancé la vérification sur Resend
- [ ] Statut passé à `"verified"`

## 🎉 Une fois Vérifié

Vos emails seront automatiquement envoyés depuis :
- `noreply@anireserve.com`
- `contact@anireserve.com`
- Ou toute autre adresse `@anireserve.com`

**Aucune modification de code nécessaire !** Le système utilisera automatiquement votre domaine une fois vérifié.

---

**Besoin d'aide ?** Consultez `AJOUTER_ENREGISTREMENTS_DNS.md` pour plus de détails.



