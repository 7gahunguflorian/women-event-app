# 🚀 Configuration pour Render.com

## Variables d'environnement à configurer sur Render

Lors du déploiement sur Render, ajoutez ces variables d'environnement dans le dashboard :

### Variables obligatoires :

1. **JWT_SECRET**
   - Valeur : Générez une clé aléatoire sécurisée
   - Comment générer : Exécutez cette commande dans votre terminal :
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Exemple : `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

2. **PORT**
   - Valeur : `3000`
   - Note : Render peut aussi utiliser son propre port automatiquement

3. **NODE_ENV**
   - Valeur : `production`

### Variables optionnelles :

4. **DB_PATH**
   - Valeur : `./backend/db.sqlite`
   - Note : La base de données sera créée automatiquement

## 📝 Instructions de déploiement

### 1. Sur Render.com

1. Créez un nouveau **Web Service**
2. Connectez votre dépôt GitHub
3. Configurez :
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
   - **Environment** : `Node`

### 2. Ajoutez les variables d'environnement

Dans l'onglet "Environment" de votre service Render :
- Cliquez sur "Add Environment Variable"
- Ajoutez chaque variable listée ci-dessus

### 3. Déployez

- Cliquez sur "Create Web Service"
- Render va automatiquement déployer votre application

## ⚠️ Important

- **Ne commitez JAMAIS** votre fichier `.env` sur GitHub
- **Générez toujours** une nouvelle clé JWT_SECRET pour la production
- **Sauvegardez** vos variables d'environnement dans un endroit sûr

## 🔒 Sécurité

✅ Le fichier `.env` est dans `.gitignore`
✅ Le fichier `.env.example` montre les variables nécessaires sans valeurs sensibles
✅ Les secrets sont configurés directement sur Render

## 📦 Base de données

La base de données SQLite sera créée automatiquement au premier démarrage.
Les données seront persistées sur le disque de Render.

**Note** : Pour une application en production avec beaucoup d'utilisateurs, 
considérez PostgreSQL (gratuit sur Render) au lieu de SQLite.
