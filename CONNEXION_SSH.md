# Guide : Connexion SSH au Serveur VPS

## 🔐 Connexion de Base

### Commande SSH Standard

```bash
ssh root@72.61.103.149
```

**Explication** :
- `ssh` : commande de connexion sécurisée
- `root` : nom d'utilisateur (administrateur)
- `@72.61.103.149` : adresse IP du serveur

### Première Connexion

Lors de la première connexion, vous verrez un message comme :

```
The authenticity of host '72.61.103.149' can't be established.
ECDSA key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no)?
```

Tapez **`yes`** et appuyez sur Entrée.

### Entrer le Mot de Passe

Après avoir tapé la commande, vous serez invité à entrer le mot de passe root du serveur.

**Note** : Le mot de passe ne s'affichera pas pendant que vous tapez (c'est normal pour la sécurité).

## 🔑 Connexion avec Clé SSH (Recommandé)

### Générer une Clé SSH (si vous n'en avez pas)

```bash
ssh-keygen -t ed25519 -C "votre_email@example.com"
```

Appuyez sur Entrée pour accepter l'emplacement par défaut (`~/.ssh/id_ed25519`).

### Copier la Clé Publique sur le Serveur

```bash
ssh-copy-id root@72.61.103.149
```

Ou manuellement :

```bash
cat ~/.ssh/id_ed25519.pub | ssh root@72.61.103.149 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Connexion Sans Mot de Passe (après avoir copié la clé)

Une fois la clé copiée, vous pourrez vous connecter sans entrer le mot de passe à chaque fois :

```bash
ssh root@72.61.103.149
```

## 📝 Commandes Utiles Une Fois Connecté

### Vérifier l'État des Services

```bash
# Vérifier Nginx
sudo systemctl status nginx

# Vérifier PM2 (Next.js)
pm2 status

# Vérifier les logs PM2
pm2 logs anireserve

# Vérifier l'espace disque
df -h

# Vérifier la mémoire
free -h
```

### Navigation

```bash
# Aller dans le dossier du projet
cd /root/anireserve

# Voir les fichiers
ls -la

# Voir les logs Nginx
sudo tail -f /var/log/nginx/anireserve_error.log
```

### Redémarrer les Services

```bash
# Redémarrer Nginx
sudo systemctl restart nginx

# Redémarrer l'application Next.js
pm2 restart anireserve

# Redémarrer tout PM2
pm2 restart all
```

## 🚪 Déconnexion

Pour vous déconnecter du serveur, tapez simplement :

```bash
exit
```

Ou appuyez sur `Ctrl + D`

## ⚠️ Problèmes Courants

### "Connection refused" ou "Connection timed out"

- Vérifiez que le serveur est en ligne : `ping 72.61.103.149`
- Vérifiez votre connexion internet
- Vérifiez que le port 22 (SSH) n'est pas bloqué par un firewall

### "Permission denied"

- Vérifiez que vous utilisez le bon mot de passe
- Vérifiez que l'utilisateur `root` est autorisé à se connecter

### "Host key verification failed"

Si vous avez changé de serveur ou réinstallé :

```bash
ssh-keygen -R 72.61.103.149
```

Puis reconnectez-vous.

## 🔒 Sécurité

### Changer le Port SSH (Optionnel)

Pour plus de sécurité, vous pouvez changer le port SSH (par exemple, port 2222) :

```bash
# Sur le serveur, éditer :
sudo nano /etc/ssh/sshd_config

# Changer la ligne :
Port 22
# En :
Port 2222

# Redémarrer SSH
sudo systemctl restart sshd
```

Puis connectez-vous avec :

```bash
ssh -p 2222 root@72.61.103.149
```

---

**IP du Serveur** : `72.61.103.149`  
**Utilisateur** : `root`  
**Port** : `22` (par défaut)








