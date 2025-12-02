# ⚡ Déploiement Rapide - AniReserve

Guide ultra-rapide pour mettre le site en ligne en 10 minutes.

## 🚀 Étapes Rapides

### 1. Préparer le code (2 min)

```bash
cd /Users/macbookpro/Desktop/aniresa/AniReserve
git add .
git commit -m "Prêt pour production"
git push origin main
```

### 2. Créer les services (5 min)

#### A. Base de données (Supabase - Gratuit)
1. Va sur https://supabase.com → Créer un compte
2. Nouveau projet → Note le nom
3. Settings → Database → Copie la "Connection string"
4. Format : `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

#### B. Supabase Storage (pour fichiers)
1. Dans le même projet Supabase
2. Storage → Créer un bucket `documents` (public)
3. Settings → API → Copie :
   - Project URL
   - anon public key
   - service_role key (⚠️ SECRET)

#### C. Resend (pour emails)
1. Va sur https://resend.com → Créer un compte
2. API Keys → Créer une clé
3. Copie la clé (commence par `re_`)

### 3. Déployer sur Vercel (3 min)

1. Va sur https://vercel.com → Connecte-toi avec GitHub
2. "Add New Project" → Importe `AniReserve`
3. **Configuration** :
   - Root Directory : `apps/web` (ou laisse vide)
   - Build Command : `cd apps/web && npx prisma generate && npm run build`
   - Output Directory : `.next`
   - Install Command : `npm install`

4. **Variables d'environnement** (Settings → Environment Variables) :
   ```
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ... (SECRET)
   RESEND_API_KEY=re_...
   NEXT_PUBLIC_BASE_URL=https://ton-domaine.vercel.app
   ```

5. Clique sur "Deploy"

### 4. Appliquer les migrations (1 min)

Une fois déployé, dans Vercel :
1. Va dans "Deployments"
2. Clique sur le dernier déploiement
3. Va dans "Functions" → Ouvre une console
4. Exécute :
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

**OU** depuis ton terminal local (si tu as accès) :
```bash
DATABASE_URL="ton-url" npx prisma migrate deploy
```

### 5. Créer le compte admin (1 min)

Une fois le site déployé, crée le compte admin :

**Option A : Via l'API**
```bash
curl -X POST https://ton-site.vercel.app/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ton-domaine.com",
    "password": "TonMotDePasse123!",
    "name": "Admin"
  }'
```

**Option B : Via Supabase SQL Editor**
```sql
-- Génère d'abord le hash bcrypt (utilise un outil en ligne ou Node.js)
-- Puis insère :
INSERT INTO "Admin" (email, password, name, "createdAt")
VALUES (
  'admin@ton-domaine.com',
  '$2a$10$...', -- Hash bcrypt
  'Admin',
  NOW()
);
```

### 6. Configurer le nom de domaine (optionnel)

1. Dans Vercel → Settings → Domains
2. Ajoute ton domaine
3. Configure les DNS selon les instructions Vercel
4. Attends la propagation (5 min - 48h)

## ✅ Vérification Rapide

- [ ] Site accessible sur l'URL Vercel
- [ ] Page d'accueil s'affiche
- [ ] Connexion admin fonctionne
- [ ] Création de réservation testée

## 🆘 Problèmes Courants

**Build échoue** → Vérifie que `npx prisma generate` est dans le build command

**Erreur base de données** → Vérifie que `DATABASE_URL` contient `?sslmode=require`

**Erreur 500** → Vérifie les logs Vercel dans "Deployments" > "Functions"

**Emails ne partent pas** → Vérifie `RESEND_API_KEY` dans Resend > Logs

## 📞 Besoin d'aide ?

Consulte `GUIDE_DEPLOIEMENT_COMPLET.md` pour plus de détails.






