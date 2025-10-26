# 🐘 Configuration PostgreSQL pour Render

## ✅ Votre Base de Données PostgreSQL

Vous avez déjà créé une base de données PostgreSQL sur Render :

```
Internal Database URL:
postgresql://women_event_user:8PSZBQ7Jya2Kehgmh5hF2jeIAjaVMYV2@dpg-d3pl4d8dl3ps73b98pjg-a/women_event
```

## 🎯 Le Code est Maintenant Compatible !

J'ai adapté le code pour supporter **automatiquement** :
- ✅ **SQLite** en local (développement)
- ✅ **PostgreSQL** en production (Render)

### Comment ça marche ?

Le code détecte automatiquement l'environnement :
- Si `DATABASE_URL` commence par `postgresql://` → Utilise PostgreSQL
- Sinon → Utilise SQLite (local)

## 🚀 Déploiement sur Render

### 1. Variables d'Environnement à Configurer

Dans le dashboard Render, ajoutez ces variables :

#### **DATABASE_URL**
```
postgresql://women_event_user:8PSZBQ7Jya2Kehgmh5hF2jeIAjaVMYV2@dpg-d3pl4d8dl3ps73b98pjg-a/women_event
```

#### **NODE_ENV**
```
production
```

#### **JWT_SECRET**
Générez une clé aléatoire :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Exemple de résultat : `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

### 2. Configuration du Service Render

**Build Command:**
```bash
npm run install-all && npm run build
```

**Start Command:**
```bash
cd backend && npm start
```

**Environment:** Node

**Instance Type:** Free

## 📋 Checklist de Déploiement

- [ ] Base de données PostgreSQL créée sur Render ✅ (déjà fait)
- [ ] Code poussé sur GitHub
- [ ] Service Web créé sur Render
- [ ] Variable `DATABASE_URL` configurée
- [ ] Variable `NODE_ENV=production` configurée
- [ ] Variable `JWT_SECRET` générée et configurée
- [ ] Build Command configuré
- [ ] Start Command configuré
- [ ] Déploiement lancé

## 🔄 Workflow de Développement

### En Local (SQLite)
```bash
# Pas besoin de DATABASE_URL
npm start
```
→ Utilise automatiquement SQLite (`backend/db.sqlite`)

### En Production (PostgreSQL)
```bash
# Render configure automatiquement DATABASE_URL
# L'application détecte PostgreSQL et l'utilise
```

## 🎨 Fonctionnalités Supportées

Tout fonctionne avec PostgreSQL :
- ✅ Authentification admin
- ✅ Création d'inscriptions
- ✅ Modification d'inscriptions
- ✅ Suppression d'inscriptions
- ✅ Statistiques
- ✅ Export CSV
- ✅ Gestion groupe WhatsApp
- ✅ Tampon "Inscriptions terminées"

## 📊 Structure de la Base de Données

Les tables sont créées automatiquement au démarrage :

### Table `admin_users`
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL
)
```

### Table `login_attempts`
```sql
CREATE TABLE login_attempts (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  attemptTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success INTEGER DEFAULT 0
)
```

### Table `registrations`
```sql
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  phone VARCHAR(50) NOT NULL,
  isStudent VARCHAR(10) NOT NULL,
  studentLevel VARCHAR(100),
  studentLocation VARCHAR(255),
  church VARCHAR(255),
  hasSnack VARCHAR(10) NOT NULL,
  snackDetail TEXT,
  addedToGroup INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## 🔐 Compte Admin par Défaut

Au premier démarrage, un compte admin est créé automatiquement :

```
Username: admin
Password: admin123
```

⚠️ **Changez ce mot de passe après le premier déploiement !**

## 🧪 Tester en Local avec PostgreSQL (Optionnel)

Si vous voulez tester PostgreSQL en local :

1. **Créez un fichier `.env` dans `backend/`:**
```env
DATABASE_URL=postgresql://women_event_user:8PSZBQ7Jya2Kehgmh5hF2jeIAjaVMYV2@dpg-d3pl4d8dl3ps73b98pjg-a/women_event
NODE_ENV=production
```

2. **Démarrez l'application:**
```bash
npm start
```

## 🔧 Fichiers Modifiés

1. **`backend/database.js`** - Détection auto SQLite/PostgreSQL
2. **`backend/db-helper.js`** - Helper pour requêtes unifiées (nouveau)
3. **`backend/auth.js`** - Support PostgreSQL
4. **`backend/routes/registrations.js`** - Support PostgreSQL
5. **`backend/.env.example`** - Template de configuration (nouveau)

## 💡 Avantages de PostgreSQL

- ✅ **Données persistantes** (pas de perte lors des redémarrages)
- ✅ **Scalabilité** (peut gérer beaucoup d'inscriptions)
- ✅ **Backups automatiques** sur Render
- ✅ **Accès externe** possible (pour outils d'administration)
- ✅ **Gratuit** sur Render (plan Free)

## 🚨 Important

### Différences SQLite vs PostgreSQL

**SQLite (Local):**
- Placeholders: `?`
- Types: `INTEGER`, `TEXT`, `DATETIME`
- Auto-increment: `AUTOINCREMENT`

**PostgreSQL (Production):**
- Placeholders: `$1`, `$2`, `$3`
- Types: `SERIAL`, `VARCHAR`, `TIMESTAMP`
- Auto-increment: `SERIAL`
- Colonnes retournées en **minuscules**

Le code gère automatiquement ces différences ! 🎉

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs Render** (onglet "Logs")
2. **Vérifiez que `DATABASE_URL` est bien configurée**
3. **Vérifiez que les tables sont créées** (logs au démarrage)
4. **Testez la connexion** à la base de données

## 🎉 Prêt pour le Déploiement !

Votre application est maintenant compatible avec PostgreSQL sur Render !

**Prochaines étapes:**
1. Committez les changements
2. Poussez sur GitHub
3. Configurez les variables d'environnement sur Render
4. Déployez !

---

**Bon déploiement ! 🚀**
