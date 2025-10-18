# ⚡ Démarrage Rapide

## 🚀 En 3 étapes

### 1️⃣ Installer les dépendances

```bash
cd women_event
npm run install-all
```

Cette commande installe toutes les dépendances du backend et du frontend.

### 2️⃣ Builder le frontend

```bash
npm run build
```

Cette commande compile le frontend React en fichiers statiques.

### 3️⃣ Démarrer l'application

```bash
npm start
```

✅ **L'application est maintenant accessible sur http://localhost:3000**

## 🎯 Accès Admin

Pour accéder au tableau de bord admin:

1. Cliquez sur le bouton **"Admin"** en haut à droite
2. Connectez-vous avec:
   - **Username**: `admin`
   - **Password**: `admin123`

## 🛠️ Mode Développement

Pour développer avec hot-reload (rechargement automatique):

**Terminal 1 - Backend:**
```bash
npm run dev-backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev-frontend
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## 📱 Fonctionnalités Principales

### Page Publique
- ✅ Formulaire d'inscription
- 🌍 Changement de langue (FR/EN)
- 🌙 Mode sombre/clair
- 📱 Responsive design

### Tableau de bord Admin
- 📊 Statistiques en temps réel
- 🔍 Recherche et filtres
- ✏️ Édition des inscriptions
- 🗑️ Suppression
- ✅ Gestion groupe WhatsApp
- 📥 Export CSV

## 🔒 Sécurité

- Mot de passe hashé avec bcrypt
- Blocage après 5 tentatives (30 min)
- Routes admin protégées

## 📝 Structure des Données

### Formulaire d'inscription
- Nom et prénom
- Âge (minimum 15 ans)
- Téléphone
- Étudiante (oui/non)
  - Si oui: niveau + lieu
- Église
- Snack (oui/non)
  - Si oui: détail du snack

## 🎨 Personnalisation

### Couleurs
Modifiez `frontend/tailwind.config.js` pour changer les couleurs:
```javascript
colors: {
  primary: { ... },  // Rose pastel
  lavender: { ... }  // Lavande
}
```

### Traductions
Ajoutez ou modifiez les traductions dans `frontend/src/lang.json`

## 🐛 Problèmes Courants

### Port 3000 déjà utilisé
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou changez le port dans backend/.env
PORT=3001
```

### Base de données corrompue
```bash
# Supprimez la base et redémarrez
rm backend/db.sqlite
npm start
```

### Erreur "Cannot find module"
```bash
# Réinstallez les dépendances
npm run install-all
```

## 📚 Documentation Complète

- **README.md** - Documentation complète
- **DEPLOYMENT.md** - Guide de déploiement sur Render

## 💡 Conseils

1. **Changez le mot de passe admin** avant le déploiement
2. **Testez localement** avant de déployer
3. **Sauvegardez** régulièrement la base de données
4. **Utilisez Git** pour versionner votre code

## 🎉 C'est tout !

Votre application est prête à être utilisée. Bonne gestion d'événement ! 🎀

---

**Besoin d'aide ?** Consultez le README.md pour plus de détails.
