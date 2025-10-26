# ⚡ Guide Rapide - Fermer/Ouvrir les Inscriptions

## 🔴 Pour FERMER les inscriptions

### Étape 1: Modifier le fichier de configuration
Ouvrez le fichier: `frontend/src/config.js`

```javascript
export const APP_CONFIG = {
  REGISTRATIONS_OPEN: false,  // ← Changez true en false
  // ...
};
```

### Étape 2: Rebuild et redémarrer

**En local:**
```bash
npm run build
npm start
```

**En production (Render):**
```bash
git add frontend/src/config.js
git commit -m "Fermer les inscriptions"
git push
```
Render redéploiera automatiquement.

### ✅ Résultat
- Grand tampon rouge "INSCRIPTIONS TERMINÉES" visible
- Formulaire complètement désactivé
- Admin garde son accès complet

---

## 🟢 Pour RÉOUVRIR les inscriptions

### Étape 1: Modifier le fichier de configuration
Ouvrez le fichier: `frontend/src/config.js`

```javascript
export const APP_CONFIG = {
  REGISTRATIONS_OPEN: true,  // ← Changez false en true
  // ...
};
```

### Étape 2: Rebuild et redémarrer

**En local:**
```bash
npm run build
npm start
```

**En production (Render):**
```bash
git add frontend/src/config.js
git commit -m "Réouvrir les inscriptions"
git push
```

### ✅ Résultat
- Tampon rouge disparaît
- Formulaire redevient actif
- Nouvelles inscriptions possibles

---

## 📍 Fichier à modifier

**Chemin:** `frontend/src/config.js`

**Ligne à changer:**
```javascript
REGISTRATIONS_OPEN: false,  // false = fermé, true = ouvert
```

---

## ⚠️ Important

- L'admin peut TOUJOURS accéder au dashboard
- L'admin peut TOUJOURS gérer les inscriptions
- Seul le formulaire public est affecté

---

## 🎯 État Actuel

**REGISTRATIONS_OPEN = false**
→ Inscriptions **FERMÉES** ✅

Pour voir l'application: http://localhost:3000

---

**C'est tout ! Simple et efficace 🚀**
