# Guide : Enregistrement DNS AAAA (IPv6)

## 🔍 Qu'est-ce qu'un AAAA ?

Un **enregistrement AAAA** est l'équivalent IPv6 d'un enregistrement **A** (IPv4).

- **A** : Pointe vers une adresse IPv4 (ex: `72.61.103.149`)
- **AAAA** : Pointe vers une adresse IPv6 (ex: `2a02:4780:28:a1a4::1`)

## 📋 Pourquoi c'est important ?

- **IPv4** : Format classique (4 nombres séparés par des points)
- **IPv6** : Format moderne (hexadécimal, plus d'adresses disponibles)

## ✅ Quelle adresse IPv6 utiliser ?

Vous avez deux adresses IPv6 différentes :

1. **Dans votre DNS actuel** : `2a02:4780:27:1089:0:217c:9e9d:10`
2. **Dans la recherche DNS inversée** : `2a02:4780:28:a1a4::1`

## 🔧 Comment vérifier la bonne adresse ?

### Option 1 : Vérifier sur le serveur VPS

Connectez-vous au serveur et vérifiez :

```bash
ssh root@72.61.103.149

# Voir toutes les adresses IP (IPv4 et IPv6)
ip addr show

# Ou plus simple
hostname -I
```

### Option 2 : Vérifier via Hostinger

Dans le panneau Hostinger, regardez les informations du serveur VPS pour voir l'adresse IPv6 assignée.

## 💡 Recommandation

**Utilisez l'adresse IPv6 qui correspond à votre serveur VPS actuel.**

Si la recherche DNS inversée montre `2a02:4780:28:a1a4::1`, c'est probablement la bonne.

## ⚠️ Important

- **L'enregistrement AAAA est optionnel** : Si vous n'avez pas d'IPv6 ou si vous n'êtes pas sûr, vous pouvez le laisser tel quel ou le supprimer.
- **L'enregistrement A (IPv4) est obligatoire** : C'est celui qui fait fonctionner votre site.
- **Les deux peuvent coexister** : Vous pouvez avoir à la fois A et AAAA.

## 🎯 Action recommandée

1. **Vérifiez sur le VPS** quelle est la vraie adresse IPv6
2. **Mettez à jour l'enregistrement AAAA** avec la bonne adresse
3. **Ou laissez-le tel quel** si vous n'êtes pas sûr (l'IPv4 fonctionnera quand même)

---

**Note** : Pour la plupart des sites, l'enregistrement A (IPv4) est suffisant. L'AAAA est un bonus pour les utilisateurs avec IPv6.



