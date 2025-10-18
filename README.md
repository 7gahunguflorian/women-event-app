# 🎀 Application Événement Féminin Chrétien

Application web complète pour gérer les inscriptions à un événement féminin chrétien.

## 📋 Fonctionnalités

### 🌸 Page Publique
- **Formulaire d'inscription** avec validation complète
- **Informations sur l'événement** (lieu, date, horaire)
- **Design responsive** et moderne
- **Mode clair/sombre** avec toggle
- **Bilingue** (Français/Anglais)

### 👩‍💻 Tableau de bord Admin
- **Authentification sécurisée** avec blocage après 5 tentatives
- **Liste complète** des inscrites
- **Recherche et filtres** avancés
- **Édition et suppression** d'inscriptions
- **Statistiques en temps réel**
- **Export CSV** des données
- **Gestion du groupe WhatsApp** (checkbox)

## 🛠️ Stack Technique

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Base de données**: SQLite (better-sqlite3)
- **Styling**: Tailwind CSS
- **Icônes**: Lucide React
- **Sécurité**: bcryptjs pour le hashing

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 16+ installé
- npm ou yarn

### Installation rapide

```bash
# 1. Cloner ou télécharger le projet
cd women_event

# 2. Installer toutes les dépendances
npm run install-all

# 3. Build du frontend
npm run build

# 4. Démarrer l'application
npm start
```

L'application sera accessible sur **http://localhost:3000**

### Développement

Pour développer avec hot-reload :

```bash
# Terminal 1 - Backend
npm run dev-backend

# Terminal 2 - Frontend
npm run dev-frontend
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## 🔐 Authentification Admin

**Identifiants par défaut:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Changez ces identifiants en production !

### Sécurité
- Mot de passe hashé avec bcrypt
- Blocage après 5 tentatives échouées (30 minutes)
- Routes admin protégées par token

## 📁 Structure du Projet

```
women_event/
│
├── backend/
│   ├── server.js              # Serveur Express principal
│   ├── database.js            # Configuration SQLite
│   ├── auth.js                # Système d'authentification
│   ├── routes/
│   │   └── registrations.js   # Routes CRUD API
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Composant principal
│   │   ├── main.jsx           # Point d'entrée
│   │   ├── contexts/          # Contextes React
│   │   │   ├── LanguageContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── AuthContext.jsx
│   │   ├── components/        # Composants React
│   │   │   ├── RegistrationForm.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── InfoBox.jsx
│   │   │   ├── StatsBox.jsx
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── lang.json          # Traductions FR/EN
│   │   └── index.css          # Styles Tailwind
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json               # Scripts racine
├── .gitignore
└── README.md
```

## 🌐 API Endpoints

### Public
- `POST /api/registrations` - Créer une inscription

### Protégé (Admin)
- `GET /api/registrations` - Liste des inscriptions
- `GET /api/registrations/stats` - Statistiques
- `PUT /api/registrations/:id` - Modifier une inscription
- `DELETE /api/registrations/:id` - Supprimer une inscription
- `GET /api/registrations/export/csv` - Export CSV

### Auth
- `POST /api/auth/login` - Connexion admin

## 🎨 Design

### Couleurs
- **Primary**: Rose pastel (#ec4899)
- **Lavender**: Lavande (#a855f7)
- **Backgrounds**: Blanc, gris clair (mode clair) / Gris foncé (mode sombre)

### Polices
- **Poppins**: Texte principal
- **Quicksand**: Titres

## 📊 Base de Données

### Table `registrations`
- id, firstName, lastName, age, phone
- isStudent, studentLevel, studentLocation
- church, hasSnack, snackDetail
- addedToGroup, createdAt

### Table `admin_users`
- id, username, passwordHash

### Table `login_attempts`
- id, username, attemptTime, success

## 🚢 Déploiement sur Render

### Configuration

1. **Créer un nouveau Web Service sur Render**

2. **Build Command:**
```bash
npm run install-all && npm run build
```

3. **Start Command:**
```bash
cd backend && npm start
```

4. **Variables d'environnement:**
```
NODE_ENV=production
PORT=3000
```

5. Le backend servira automatiquement le frontend build

### Fichiers importants pour le déploiement
- Le `server.js` sert le frontend via `express.static`
- La base SQLite sera créée automatiquement
- Les fichiers sont dans `/backend/dist` après le build

## 📝 Utilisation

### Pour les utilisatrices
1. Remplir le formulaire d'inscription
2. Soumettre
3. Confirmation de l'inscription

### Pour l'admin
1. Cliquer sur "Admin" (icône profil)
2. Se connecter
3. Accéder au tableau de bord
4. Gérer les inscriptions (recherche, filtre, édition, suppression)
5. Marquer les personnes ajoutées au groupe WhatsApp
6. Exporter les données en CSV

## 🔧 Personnalisation

### Changer les identifiants admin
Modifier dans `backend/auth.js` la fonction `initializeAdmin()`:
```javascript
const hashedPassword = bcrypt.hashSync('VOTRE_NOUVEAU_MOT_DE_PASSE', 10);
db.prepare('INSERT INTO admin_users (username, passwordHash) VALUES (?, ?)')
  .run('VOTRE_USERNAME', hashedPassword);
```

### Ajouter une langue
1. Ajouter les traductions dans `frontend/src/lang.json`
2. Modifier le `LanguageContext.jsx` pour supporter la nouvelle langue

## 🐛 Dépannage

### Le serveur ne démarre pas
- Vérifier que le port 3000 est libre
- Vérifier que toutes les dépendances sont installées

### Erreur de base de données
- Supprimer `backend/db.sqlite` et redémarrer
- La base sera recréée automatiquement

### Problème d'authentification
- Vérifier les identifiants
- Attendre 30 minutes si le compte est bloqué
- Supprimer la base et redémarrer pour reset

## 📄 Licence

ISC

## 👥 Support

Pour toute question ou problème, contactez l'administrateur du projet.

---

**Fait avec ❤️ pour la communauté chrétienne féminine**
# women-event-app
