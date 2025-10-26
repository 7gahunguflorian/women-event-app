# ⚡ Démarrage Rapide - Women's Event App

## 🎯 Tout est Prêt !

Votre application est maintenant **100% fonctionnelle** avec :
- ✅ Tampon rouge "Inscriptions terminées" stylé
- ✅ Formulaire désactivé pour les utilisateurs
- ✅ Accès admin fonctionnel
- ✅ Base de données SQLite configurée

## 🚀 Accéder à l'Application

**URL:** http://localhost:3000

## 🔐 Se Connecter en Admin

1. **Cliquez sur le bouton "Admin"** (en haut à droite)
2. **Entrez les identifiants:**
   ```
   Username: admin
   Password: admin123
   ```
3. **Cliquez sur "Se connecter"**
4. **Accédez au dashboard** ✅

## 🎨 État Actuel

### Inscriptions: **FERMÉES** 🔴

Le tampon rouge "INSCRIPTIONS TERMINÉES" est visible sur le formulaire.

**Ce que les utilisateurs voient:**
- Grand tampon rouge avec message
- Formulaire complètement désactivé (grisé)
- Impossible de soumettre de nouvelles inscriptions

**Ce que l'admin peut faire:**
- ✅ Se connecter au dashboard
- ✅ Voir toutes les inscriptions
- ✅ Modifier/supprimer des inscriptions
- ✅ Exporter les données en CSV
- ✅ Gérer le groupe WhatsApp

## 🟢 Réouvrir les Inscriptions

Pour réactiver le formulaire :

1. **Ouvrez:** `frontend/src/config.js`
2. **Changez:**
   ```javascript
   REGISTRATIONS_OPEN: false  // ← Mettre à true
   ```
3. **Rebuild:**
   ```bash
   npm run build
   npm start
   ```

## 🔧 Commandes Utiles

### Démarrer l'application
```bash
npm start
```

### Rebuild le frontend
```bash
npm run build
```

### Réinitialiser le compte admin
```bash
cd backend
node reset-admin.js
```

### Mode développement (avec hot-reload)
```bash
# Terminal 1 - Backend
npm run dev-backend

# Terminal 2 - Frontend
npm run dev-frontend
```

## 📊 Fonctionnalités du Dashboard Admin

Une fois connecté, vous pouvez :

1. **Voir les statistiques:**
   - Total d'inscrites
   - Nombre avec snack
   - Nombre d'étudiantes
   - Nombre ajoutées au groupe WhatsApp

2. **Rechercher et filtrer:**
   - Recherche par nom, téléphone, église
   - Filtre par snack (avec/sans)
   - Filtre par groupe WhatsApp (ajoutées/non ajoutées)

3. **Gérer les inscriptions:**
   - Modifier une inscription
   - Supprimer une inscription
   - Marquer comme "ajoutée au groupe WhatsApp"

4. **Exporter les données:**
   - Export CSV de toutes les inscriptions
   - Fichier prêt pour Excel/Google Sheets

## 🎨 Personnalisation

### Changer le message du tampon
Éditez `frontend/src/lang.json`:
```json
{
  "fr": {
    "closed": {
      "title": "VOTRE MESSAGE ICI",
      "message": "Votre texte personnalisé",
      "thankYou": "Merci !"
    }
  }
}
```

### Changer les couleurs
Éditez `frontend/src/components/ClosedStamp.jsx`

### Changer les infos de l'événement
Éditez `frontend/src/config.js`

## 🐛 Dépannage

### Problème de connexion admin
```bash
cd backend
node reset-admin.js
```

### Port 3000 déjà utilisé
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erreur de base de données
```bash
# Supprimer et recréer
rm backend/db.sqlite
npm start
```

## 📱 Tester sur Mobile

1. **Trouvez votre IP locale:**
   ```bash
   ipconfig
   ```
   Cherchez "IPv4 Address"

2. **Accédez depuis votre mobile:**
   ```
   http://VOTRE_IP:3000
   ```

## 🚀 Déployer sur Render

1. **Committez les changements:**
   ```bash
   git add .
   git commit -m "Application prête pour production"
   git push
   ```

2. **Render redéploiera automatiquement**

3. **Vérifiez que les variables d'environnement sont configurées:**
   - `NODE_ENV=production`
   - `JWT_SECRET=votre_secret`

## 📚 Documentation Complète

- **GESTION_INSCRIPTIONS.md** - Gérer les inscriptions
- **GUIDE_RAPIDE_FERMETURE.md** - Fermer/ouvrir rapidement
- **CORRECTION_AUTH.md** - Détails de la correction
- **README.md** - Documentation complète
- **DEPLOYMENT.md** - Guide de déploiement

## ✅ Checklist de Vérification

- [x] Serveur démarré sur http://localhost:3000
- [x] Tampon rouge visible sur le formulaire
- [x] Formulaire désactivé (champs grisés)
- [x] Connexion admin fonctionne (admin/admin123)
- [x] Dashboard admin accessible
- [x] Base de données SQLite créée
- [x] Compte admin créé automatiquement

## 🎉 Tout Fonctionne !

Votre application est maintenant prête à être utilisée !

**Prochaines étapes:**
1. Testez la connexion admin ✅
2. Explorez le dashboard ✅
3. Testez l'export CSV ✅
4. Changez le mot de passe admin ⚠️
5. Déployez sur Render 🚀

---

**Besoin d'aide ?** Consultez les fichiers de documentation dans le projet.

**Bon événement ! 🎀**
