# 📋 Enregistrements DNS à Ajouter pour anireserve.com

## 🎯 Objectif

Configurer les enregistrements DNS pour que Resend puisse envoyer des emails depuis `noreply@anireserve.com`.

## 📝 Enregistrements à Ajouter dans Hostinger

Connectez-vous à votre panneau Hostinger et allez dans **DNS** pour le domaine `anireserve.com`.

### 1. Enregistrement DKIM (TXT)

- **Type :** `TXT`
- **Nom :** `resend._domainkey`
- **Valeur :** `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9KJJKjGwWQaRNGhOcpRN6jFPtpwEUM+fqoOiLIl8//qyq0tF1y9weuc60WxcOwyeU0M5fv1OQWsKhfYHZgmKk6wZ/QZp3ADC2Qpe4/agqvWE0A5FbeugjbcsAWADkRN5O/NmhbwlRLOxRBiBrhJhFu+q2uDNKk7B/TBYF8qpgdQIDAQAB`
- **TTL :** `3600` (ou Auto)

### 2. Enregistrement SPF (TXT)

- **Type :** `TXT`
- **Nom :** `send`
- **Valeur :** `v=spf1 include:amazonses.com ~all`
- **TTL :** `3600` (ou Auto)

### 3. Enregistrement MX pour l'envoi

- **Type :** `MX`
- **Nom :** `send`
- **Valeur :** `feedback-smtp.us-east-1.amazonses.com`
- **Priorité :** `10`
- **TTL :** `3600` (ou Auto)

## 🔍 Vérification après Ajout

Après avoir ajouté ces enregistrements, attendez **5-10 minutes** pour la propagation DNS, puis vérifiez :

### Depuis votre Mac :

```bash
# Vérifier le DKIM
dig TXT resend._domainkey.anireserve.com

# Vérifier le SPF
dig TXT send.anireserve.com

# Vérifier le MX
dig MX send.anireserve.com
```

### Depuis Resend :

```bash
cd ~/Desktop/aniresa/AniReserve
npm run manage:domains verify 633d2d3f-3787-4bb8-94b4-73d1181ed560
```

Puis vérifiez le statut :

```bash
npm run manage:domains get 633d2d3f-3787-4bb8-94b4-73d1181ed560
```

Le statut devrait passer de `"failed"` à `"verified"` une fois les DNS correctement configurés.

## 📸 Exemple dans Hostinger

Dans le panneau DNS de Hostinger, vous devriez voir quelque chose comme :

```
Type    Nom                    Valeur                                    TTL
TXT     resend._domainkey      p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBg...  3600
TXT     send                   v=spf1 include:amazonses.com ~all         3600
MX      send                   feedback-smtp.us-east-1.amazonses.com      3600
```

## ⚠️ Notes Importantes

1. **Le nom exact est important** : `resend._domainkey` (avec le point)
2. **Pas d'espaces** dans les valeurs
3. **Attendez la propagation** : 5-10 minutes minimum, parfois jusqu'à 48h
4. **Vérifiez régulièrement** avec `dig` ou `nslookup`

## ✅ Checklist

- [ ] Enregistrement DKIM ajouté (`resend._domainkey`)
- [ ] Enregistrement SPF ajouté (`send` TXT)
- [ ] Enregistrement MX ajouté (`send` MX)
- [ ] Attendu 5-10 minutes pour la propagation
- [ ] Vérifié avec `dig` que les enregistrements sont visibles
- [ ] Relancé la vérification sur Resend
- [ ] Statut du domaine passé à `"verified"`

## 🆘 Si ça ne fonctionne pas

1. **Vérifiez les noms exacts** (sensible à la casse)
2. **Vérifiez qu'il n'y a pas d'espaces** dans les valeurs
3. **Attendez plus longtemps** (jusqu'à 48h)
4. **Vérifiez avec `dig`** que les DNS sont propagés
5. **Contactez le support Hostinger** si les enregistrements n'apparaissent pas

---

**Une fois le domaine vérifié, vos emails seront automatiquement envoyés depuis `noreply@anireserve.com` !** 🎉

