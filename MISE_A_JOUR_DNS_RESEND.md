# 🔄 Mise à Jour des Enregistrements DNS Resend

## ⚠️ Action Requise

Les valeurs DNS ont changé sur Resend. Vous devez **mettre à jour** les enregistrements dans Hostinger.

## 📝 Enregistrements à Mettre à Jour dans Hostinger

Connectez-vous à votre panneau Hostinger et allez dans **DNS** pour le domaine `anireserve.com`.

### 🔴 1. DKIM (TXT) - À METTRE À JOUR

**Ancienne valeur (à supprimer ou remplacer) :**
```
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9KJJKjGwWQaRNGhOcpRN6jFPtpwEUM+fqoOiLIl8//qyq0tF1y9weuc60WxcOwyeU0M5fv1OQWsKhfYHZgmKk6wZ/QZp3ADC2Qpe4/agqvWE0A5FbeugjbcsAWADkRN5O/NmhbwlRLOxRBiBrhJhFu+q2uDNKk7B/TBYF8qpgdQIDAQAB
```

**Nouvelle valeur (à ajouter) :**
- **Type :** `TXT`
- **Nom :** `resend._domainkey`
- **Valeur :** `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCweuRDKz9ShnlvlU0mfZlvBLSuzG2jrZaC6jDWO6mC8c4tTHb9GzbuzXe8VC3ho/Wdfogc/LrLBb6N/MWrQV6Eu7jb0b/1AN9QQIx4bhmEOG1oU3JxhvLmQg2LLUW8/hOQDTEhBueue8qLAR2+i0MphUTlJBY2Azpro1faUZxlCQIDAQAB`
- **TTL :** `3600` (ou Auto)

### ✅ 2. SPF (TXT) - DÉJÀ CORRECT

- **Type :** `TXT`
- **Nom :** `send`
- **Valeur :** `v=spf1 include:amazonses.com ~all`
- **TTL :** `3600` (ou Auto)

**✅ Cet enregistrement est déjà correct, pas besoin de le modifier.**

### 🔴 3. MX - À METTRE À JOUR

**Ancienne valeur (à supprimer ou remplacer) :**
```
feedback-smtp.us-east-1.amazonses.com
```

**Nouvelle valeur (à ajouter) :**
- **Type :** `MX`
- **Nom :** `send`
- **Valeur :** `feedback-smtp.eu-west-1.amazonses.com`
- **Priorité :** `10`
- **TTL :** `3600` (ou Auto)

**⚠️ Note :** La région a changé de `us-east-1` à `eu-west-1`.

## 📋 Résumé des Changements

| Enregistrement | Statut | Action |
|----------------|--------|--------|
| DKIM (TXT) | 🔴 À mettre à jour | Remplacer la valeur |
| SPF (TXT) | ✅ Correct | Aucune action |
| MX | 🔴 À mettre à jour | Remplacer `us-east-1` par `eu-west-1` |

## 🔍 Vérification après Mise à Jour

Après avoir mis à jour les enregistrements, attendez **5-10 minutes** pour la propagation DNS, puis vérifiez :

```bash
# Vérifier le nouveau DKIM
dig TXT resend._domainkey.anireserve.com +short

# Vérifier le SPF (déjà correct)
dig TXT send.anireserve.com +short

# Vérifier le nouveau MX
dig MX send.anireserve.com +short
```

Vous devriez voir :
- DKIM : La nouvelle valeur (commence par `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCweuRDKz9ShnlvlU0mfZlvBLSuzG2jrZaC6jDWO6mC8c4tTHb9GzbuzXe8VC3ho/Wdfogc/LrLBb6N/MWrQV6Eu7jb0b/1AN9QQIx4bhmEOG1oU3JxhvLmQg2LLUW8/hOQDTEhBueue8qLAR2+i0MphUTlJBY2Azpro1faUZxlCQIDAQAB`)
- SPF : `v=spf1 include:amazonses.com ~all`
- MX : `10 feedback-smtp.eu-west-1.amazonses.com.`

## ✅ Vérification sur Resend

Après la propagation DNS, relancez la vérification :

```bash
cd ~/Desktop/aniresa/AniReserve
npm run manage:domains verify 633d2d3f-3787-4bb8-94b4-73d1181ed560
```

Puis vérifiez le statut :

```bash
npm run check:domain
```

Le statut devrait passer à `"verified"` une fois les DNS correctement mis à jour.

## 🆘 Si ça ne fonctionne pas

1. **Vérifiez que vous avez bien supprimé les anciens enregistrements** (surtout pour le DKIM)
2. **Vérifiez les noms exacts** (sensible à la casse)
3. **Vérifiez qu'il n'y a pas d'espaces** dans les valeurs
4. **Attendez plus longtemps** (jusqu'à 48h pour la propagation complète)
5. **Vérifiez avec `dig`** que les nouveaux enregistrements sont visibles

---

**Une fois les DNS mis à jour et vérifiés, vos emails seront automatiquement envoyés depuis `noreply@anireserve.com` !** 🎉







