# 🎯 Gestion des Inscriptions

## Fermer/Ouvrir les inscriptions

### 📍 Méthode Simple (Recommandée)

Pour **fermer** ou **ouvrir** les inscriptions, modifiez le fichier de configuration :

**Fichier:** `frontend/src/config.js`

```javascript
export const APP_CONFIG = {
  // Mettre à false pour fermer les inscriptions
  REGISTRATIONS_OPEN: false,  // ← Changez cette valeur
  
  // ... autres configurations
};
```

### 🔴 Fermer les inscriptions

1. Ouvrez `frontend/src/config.js`
2. Changez `REGISTRATIONS_OPEN: true` en `REGISTRATIONS_OPEN: false`
3. Sauvegardez le fichier
4. Redémarrez l'application ou rebuild :
   ```bash
   npm run build
   npm start
   ```

**Résultat :**
- ✅ Un grand tampon rouge "INSCRIPTIONS TERMINÉES" apparaît sur le formulaire
- ✅ Tous les champs du formulaire sont désactivés (grisés)
- ✅ Le bouton de soumission est désactivé
- ✅ Les utilisateurs ne peuvent plus s'inscrire
- ✅ **L'admin garde son accès complet au dashboard**

### 🟢 Réouvrir les inscriptions

1. Ouvrez `frontend/src/config.js`
2. Changez `REGISTRATIONS_OPEN: false` en `REGISTRATIONS_OPEN: true`
3. Sauvegardez le fichier
4. Redémarrez l'application ou rebuild

**Résultat :**
- ✅ Le tampon rouge disparaît
- ✅ Le formulaire redevient actif
- ✅ Les utilisateurs peuvent à nouveau s'inscrire

## 🎨 Apparence du tampon "Inscriptions terminées"

Le tampon rouge stylé comprend :
- **Grand tampon rouge** avec rotation de -12°
- **Animation d'apparition** (effet "stamp")
- **Fond semi-transparent** avec effet de flou
- **Message bilingue** (FR/EN)
- **Icône X** animée
- **Design responsive** (adapté mobile et desktop)

## 🔐 Accès Admin

**Important :** Même quand les inscriptions sont fermées :
- ✅ L'admin peut toujours se connecter
- ✅ L'admin peut accéder au dashboard
- ✅ L'admin peut voir toutes les inscriptions
- ✅ L'admin peut modifier/supprimer des inscriptions
- ✅ L'admin peut exporter les données en CSV

**Seul le formulaire public est désactivé.**

## 📝 Traductions

Les messages du tampon sont traduits automatiquement :

**Français :**
- Titre : "INSCRIPTIONS TERMINÉES"
- Message : "Nous avons atteint le nombre maximal de participantes."
- Remerciement : "Merci pour votre intérêt !"

**Anglais :**
- Titre : "REGISTRATIONS CLOSED"
- Message : "We have reached the maximum number of participants."
- Remerciement : "Thank you for your interest!"

## 🚀 Déploiement

### En production (Render)

Après avoir modifié `REGISTRATIONS_OPEN` :

```bash
# 1. Committez les changements
git add frontend/src/config.js
git commit -m "Fermer les inscriptions"

# 2. Poussez sur GitHub
git push

# 3. Render redéploiera automatiquement
```

### En local

```bash
# Rebuild et redémarrage
npm run build
npm start
```

## 🎯 Cas d'usage

### Scénario 1 : Capacité maximale atteinte
```javascript
// frontend/src/config.js
REGISTRATIONS_OPEN: false
```
→ Affiche le tampon rouge

### Scénario 2 : Événement terminé
```javascript
// frontend/src/config.js
REGISTRATIONS_OPEN: false
```
→ Affiche le tampon rouge

### Scénario 3 : Nouvelle édition de l'événement
```javascript
// frontend/src/config.js
REGISTRATIONS_OPEN: true
```
→ Réactive le formulaire

## 💡 Conseils

1. **Avant de fermer les inscriptions :**
   - Exportez les données en CSV depuis le dashboard admin
   - Vérifiez le nombre total d'inscrites
   - Sauvegardez la base de données

2. **Communication :**
   - Informez les participantes via le groupe WhatsApp
   - Mettez à jour vos réseaux sociaux

3. **Backup :**
   - Gardez une copie de `backend/db.sqlite` avant de fermer

## 🔧 Personnalisation avancée

### Modifier le message du tampon

Éditez `frontend/src/lang.json` :

```json
{
  "fr": {
    "closed": {
      "title": "VOTRE TITRE ICI",
      "message": "Votre message personnalisé",
      "thankYou": "Votre remerciement"
    }
  }
}
```

### Modifier le style du tampon

Éditez `frontend/src/components/ClosedStamp.jsx` pour changer :
- Couleurs (actuellement rouge)
- Taille
- Animation
- Position

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que le fichier `config.js` est bien sauvegardé
2. Vérifiez que l'application a été rebuild
3. Videz le cache du navigateur (Ctrl+Shift+R)
4. Consultez les logs du serveur

---

**Fait avec ❤️ pour faciliter la gestion de votre événement**
