# 🚀 Guide de Déploiement sur Render

Ce guide vous explique comment déployer l'application sur Render gratuitement.

## 📋 Prérequis

1. Compte GitHub (pour héberger le code)
2. Compte Render (gratuit) - https://render.com

## 🔧 Préparation

### 1. Pousser le code sur GitHub

```bash
cd women_event
git init
git add .
git commit -m "Initial commit - Women Event App"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/women-event.git
git push -u origin main
```

## 🌐 Déploiement sur Render

### 1. Créer un nouveau Web Service

1. Connectez-vous sur https://render.com
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre repository GitHub
4. Sélectionnez le repository `women-event`

### 2. Configuration du Service

**Paramètres de base:**
- **Name**: `women-event` (ou votre choix)
- **Region**: Choisissez la région la plus proche
- **Branch**: `main`
- **Root Directory**: Laisser vide

**Build & Deploy:**
- **Runtime**: `Node`
- **Build Command**:
  ```bash
  npm run install-all && npm run build
  ```
- **Start Command**:
  ```bash
  cd backend && npm start
  ```

**Plan:**
- Sélectionnez **"Free"** (gratuit)

### 3. Variables d'Environnement ⚠️ IMPORTANT

Ajoutez ces variables dans l'onglet "Environment":

**Variables obligatoires:**

1. **JWT_SECRET** (TRÈS IMPORTANT pour la sécurité)
   - Générez une clé aléatoire avec cette commande:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   - Copiez le résultat et ajoutez-le comme valeur de `JWT_SECRET`
   - Exemple de résultat: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

2. **NODE_ENV**
   ```
   NODE_ENV=production
   ```

3. **PORT** (optionnel, Render le définit automatiquement)
   ```
   PORT=10000
   ```

**Variables optionnelles:**

4. **DB_PATH**
   ```
   DB_PATH=./backend/db.sqlite
   ```

⚠️ **SÉCURITÉ**: Ne commitez JAMAIS votre fichier `.env` sur GitHub. Utilisez uniquement `.env.example` comme référence.

### 4. Déployer

1. Cliquez sur **"Create Web Service"**
2. Render va automatiquement:
   - Cloner votre repository
   - Installer les dépendances
   - Builder le frontend
   - Démarrer le serveur

Le déploiement prend environ 5-10 minutes.

## ✅ Vérification

Une fois le déploiement terminé:

1. Render vous donnera une URL: `https://women-event.onrender.com`
2. Visitez cette URL pour voir votre application
3. Testez l'inscription
4. Testez la connexion admin (admin/admin123)

## 🔒 Sécurité Post-Déploiement

### Changer le mot de passe admin

**Option 1: Via le code (recommandé)**

1. Modifiez `backend/auth.js`:
```javascript
// Ligne ~15
const hashedPassword = bcrypt.hashSync('VOTRE_NOUVEAU_MOT_DE_PASSE_FORT', 10);
```

2. Committez et poussez:
```bash
git add backend/auth.js
git commit -m "Update admin password"
git push
```

3. Render redéploiera automatiquement

**Option 2: Via la base de données**

Si vous avez accès à la base SQLite en production, vous pouvez exécuter:
```sql
UPDATE admin_users 
SET passwordHash = '$2a$10$NOUVEAU_HASH' 
WHERE username = 'admin';
```

## 🔄 Mises à jour

Pour mettre à jour l'application:

```bash
# Faire vos modifications
git add .
git commit -m "Description des changements"
git push
```

Render détectera automatiquement le push et redéploiera.

## 📊 Monitoring

### Logs
- Accédez aux logs via le dashboard Render
- Onglet "Logs" pour voir les erreurs et l'activité

### Base de données
- La base SQLite est stockée sur le disque de Render
- ⚠️ **Important**: Sur le plan gratuit, les données peuvent être perdues lors des redémarrages
- Pour une solution permanente, considérez PostgreSQL (aussi gratuit sur Render)

## 🔧 Dépannage

### Le build échoue

**Erreur: "npm install failed"**
- Vérifiez que tous les `package.json` sont corrects
- Vérifiez les versions de Node.js (Render utilise Node 18 par défaut)

**Solution**: Ajoutez un fichier `.node-version` à la racine:
```
18
```

### L'application ne démarre pas

**Erreur: "Port already in use"**
- Vérifiez que le `server.js` utilise `process.env.PORT`
- Ligne dans `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Les routes ne fonctionnent pas

**Erreur 404 sur les routes React**
- Vérifiez que le `server.js` a bien:
```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
```

### La base de données est vide après redémarrage

**Solution**: Migrer vers PostgreSQL

1. Créer une base PostgreSQL gratuite sur Render
2. Modifier `database.js` pour utiliser PostgreSQL au lieu de SQLite
3. Installer `pg` au lieu de `better-sqlite3`

## 💡 Optimisations

### 1. Activer le cache

Dans `vite.config.js`:
```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
```

### 2. Compression

Installer et utiliser compression dans Express:
```bash
npm install compression
```

Dans `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Variables d'environnement pour l'admin

Au lieu de hardcoder les identifiants, utilisez des variables d'environnement:

```javascript
// backend/auth.js
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
```

Puis ajoutez dans Render:
```
ADMIN_USERNAME=votre_username
ADMIN_PASSWORD=votre_password_fort
```

## 🌟 Alternatives à Render

Si vous rencontrez des problèmes avec Render, voici d'autres options gratuites:

1. **Vercel** (frontend uniquement, nécessite serverless pour le backend)
2. **Railway** (similaire à Render)
3. **Fly.io** (gratuit avec limites)
4. **Heroku** (payant maintenant, mais très stable)

## 📞 Support

Si vous rencontrez des problèmes:
1. Consultez les logs Render
2. Vérifiez la documentation Render: https://render.com/docs
3. Testez localement d'abord avec `NODE_ENV=production npm start`

---

**Bon déploiement ! 🚀**
