# ✅ Checklist de Déploiement sur Render

## Avant de commiter sur GitHub

### 1. Vérifier le .gitignore ✅
- [x] Le fichier `.gitignore` est configuré
- [x] Les fichiers sensibles sont ignorés :
  - `node_modules/`
  - `.env`
  - `*.db` et `*.sqlite`
  - Fichiers IDE

### 2. Créer .env.example ✅
- [x] Fichier `.env.example` créé avec les variables nécessaires
- [x] Aucune valeur sensible dans `.env.example`

### 3. Vérifier que .env n'est PAS commité
```bash
# Cette commande ne doit PAS montrer .env
git status
```

## Pousser sur GitHub

### 1. Initialiser Git (si pas déjà fait)
```bash
cd c:\Users\Floian Gahungu\Desktop\women_event
git init
git add .
git commit -m "Initial commit - Women's Event App"
```

### 2. Créer un repository sur GitHub
1. Allez sur https://github.com/new
2. Nom du repository : `women-event`
3. Visibilité : **Public** ou **Private** (votre choix)
4. **NE PAS** initialiser avec README, .gitignore ou license

### 3. Pousser le code
```bash
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/women-event.git
git push -u origin main
```

## Déployer sur Render

### 1. Créer un compte Render
- Allez sur https://render.com
- Inscrivez-vous (gratuit)
- Connectez votre compte GitHub

### 2. Créer un nouveau Web Service
1. Cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre repository `women-event`
3. Configurez :

**Settings:**
- **Name** : `women-event` (ou votre choix)
- **Region** : Choisissez la plus proche (ex: Frankfurt pour l'Europe)
- **Branch** : `main`
- **Runtime** : `Node`

**Build & Deploy:**
- **Build Command** :
  ```
  npm run install-all && npm run build
  ```
- **Start Command** :
  ```
  cd backend && npm start
  ```

**Instance Type:**
- Sélectionnez **"Free"**

### 3. ⚠️ IMPORTANT : Configurer les Variables d'Environnement

Dans l'onglet **"Environment"**, ajoutez :

#### Générer JWT_SECRET
Exécutez cette commande dans votre terminal :
```bash
node generate-jwt-secret.js
```
OU
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Ajouter les variables sur Render :

1. **JWT_SECRET**
   - Key : `JWT_SECRET`
   - Value : [Collez la clé générée ci-dessus]

2. **NODE_ENV**
   - Key : `NODE_ENV`
   - Value : `production`

3. **PORT** (optionnel)
   - Key : `PORT`
   - Value : `10000`

### 4. Déployer
- Cliquez sur **"Create Web Service"**
- Attendez 5-10 minutes que le déploiement se termine

### 5. Tester l'application
Une fois déployé, Render vous donnera une URL comme :
```
https://women-event.onrender.com
```

Testez :
- ✅ Page d'accueil s'affiche
- ✅ Formulaire d'inscription fonctionne
- ✅ Connexion admin fonctionne (admin/admin123)
- ✅ Dashboard admin accessible

## Après le déploiement

### 🔒 Sécurité

#### 1. Changer le mot de passe admin par défaut
Le mot de passe par défaut est `admin123`. **Changez-le immédiatement !**

**Option A : Via le dashboard admin**
1. Connectez-vous au dashboard
2. Allez dans "Utilisateurs"
3. Modifiez le mot de passe de l'admin

**Option B : Via le code**
1. Modifiez `backend/auth.js` ligne 13
2. Changez `'admin123'` par un mot de passe fort
3. Committez et poussez sur GitHub

#### 2. Sauvegarder vos variables d'environnement
- Notez votre `JWT_SECRET` dans un endroit sûr
- Ne le partagez JAMAIS publiquement

### 📊 Monitoring

#### Vérifier les logs
- Dashboard Render → Onglet "Logs"
- Surveillez les erreurs et l'activité

#### Base de données
- SQLite est utilisé (fichier sur le disque de Render)
- ⚠️ Sur le plan gratuit, les données peuvent être perdues lors des redémarrages
- Pour une solution permanente, considérez PostgreSQL

## Mises à jour futures

Pour mettre à jour l'application :

```bash
# Faire vos modifications
git add .
git commit -m "Description des changements"
git push
```

Render détectera automatiquement le push et redéploiera.

## 🆘 En cas de problème

### Le build échoue
- Vérifiez les logs dans Render
- Vérifiez que toutes les dépendances sont dans `package.json`

### L'application ne démarre pas
- Vérifiez que `PORT` est bien configuré dans les variables d'environnement
- Vérifiez les logs pour les erreurs

### Erreur 404 sur les routes
- Vérifiez que le `server.js` sert bien les fichiers statiques
- Vérifiez que le build du frontend s'est bien passé

### Base de données vide
- Normal au premier démarrage
- L'admin par défaut sera créé automatiquement

## 📞 Support

- Documentation Render : https://render.com/docs
- Testez localement d'abord : `npm run dev`

---

**Bon déploiement ! 🚀**
