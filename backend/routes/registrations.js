const express = require('express');
const router = express.Router();
const db = require('../database');
const { requireAuth } = require('../auth');

// SQLite retourne les colonnes telles quelles (pas besoin de normalisation)
const normalizeRegistration = (reg) => {
  if (!reg) return null;
  return reg;
};

// GET - Récupérer toutes les inscriptions (protégé)
router.get('/', requireAuth, async (req, res) => {
  try {
    const registrations = db.prepare('SELECT * FROM registrations ORDER BY createdAt DESC').all();
    const normalized = registrations.map(normalizeRegistration);
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques (protégé)
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM registrations').get();
    const withSnack = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE hasSnack = \'oui\'').get();
    const students = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE isStudent = \'oui\'').get();
    const addedToGroup = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE addedToGroup = 1').get();
    
    res.json({
      total: total.count,
      withSnack: withSnack.count,
      students: students.count,
      addedToGroup: addedToGroup.count,
      snackPercentage: total.count > 0 ? Math.round((withSnack.count / total.count) * 100) : 0
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST - Créer une nouvelle inscription (public)
router.post('/', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      age, 
      phone, 
      isStudent, 
      studentLevel, 
      studentLocation, 
      church, 
      hasSnack, 
      snackDetail 
    } = req.body;

    // Validation simple
    if (!firstName || !lastName || !age || !phone || !hasSnack) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Vérifier l'âge minimum (15 ans)
    if (parseInt(age) < 15) {
      return res.status(400).json({ error: 'L\'âge minimum requis est de 15 ans' });
    }

    // Vérifier si le numéro de téléphone existe déjà
    const existingPhone = db.prepare('SELECT * FROM registrations WHERE phone = ?').get(phone);
    if (existingPhone) {
      return res.status(409).json({ error: 'Ce numéro de téléphone est déjà inscrit' });
    }

    // Insérer dans la base de données
    const result = db.prepare(
      `INSERT INTO registrations 
      (firstName, lastName, age, phone, isStudent, studentLevel, studentLocation, church, hasSnack, snackDetail)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      firstName, 
      lastName, 
      age, 
      phone, 
      isStudent, 
      isStudent === 'oui' ? studentLevel : null, 
      isStudent === 'oui' ? studentLocation : null, 
      church || '', 
      hasSnack, 
      hasSnack === 'oui' ? snackDetail : null
    );

    res.status(201).json({ 
      message: 'Inscription enregistrée avec succès',
      id: result.lastID 
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de l\'inscription' });
  }
});

// PUT - Mettre à jour une inscription (protégé)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      firstName, 
      lastName, 
      age, 
      phone, 
      isStudent, 
      studentLevel, 
      studentLocation, 
      church, 
      hasSnack, 
      snackDetail,
      addedToGroup
    } = req.body;

    // Normaliser les données entrantes (gérer camelCase et lowercase)
    const normalizedData = {
      firstName: firstName || req.body.firstname,
      lastName: lastName || req.body.lastname,
      age: age,
      phone: phone,
      isStudent: isStudent || req.body.isstudent,
      studentLevel: studentLevel || req.body.studentlevel,
      studentLocation: studentLocation || req.body.studentlocation,
      church: church,
      hasSnack: hasSnack || req.body.hassnack,
      snackDetail: snackDetail || req.body.snackdetail,
      addedToGroup: addedToGroup !== undefined ? addedToGroup : (req.body.addedtogroup !== undefined ? req.body.addedtogroup : 0)
    };

    db.prepare(
      `UPDATE registrations 
       SET firstName = ?, 
           lastName = ?, 
           age = ?, 
           phone = ?, 
           isStudent = ?, 
           studentLevel = ?, 
           studentLocation = ?, 
           church = ?, 
           hasSnack = ?, 
           snackDetail = ?,
           addedToGroup = ?
       WHERE id = ?`
    ).run(
      normalizedData.firstName,
      normalizedData.lastName,
      normalizedData.age,
      normalizedData.phone,
      normalizedData.isStudent,
      normalizedData.isStudent === 'oui' ? normalizedData.studentLevel : null,
      normalizedData.isStudent === 'oui' ? normalizedData.studentLocation : null,
      normalizedData.church,
      normalizedData.hasSnack,
      normalizedData.hasSnack === 'oui' ? normalizedData.snackDetail : null,
      normalizedData.addedToGroup ? 1 : 0,
      id
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE - Supprimer une inscription (protégé)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM registrations WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET - Export CSV (protégé)
router.get('/export/csv', requireAuth, async (req, res) => {
  try {
    const registrations = db.prepare('SELECT * FROM registrations ORDER BY lastName, firstName').all();
    const normalized = registrations.map(normalizeRegistration);
    
    // Créer le contenu CSV
    const headers = [
      'ID', 'Prénom', 'Nom', 'Âge', 'Téléphone', 'Étudiante', 
      'Niveau d\'études', 'Lieu d\'études', 'Église', 
      'Apporte un snack', 'Détail du snack', 'Ajouté(e) au groupe', 'Date d\'inscription'
    ];
    
    const rows = normalized.map(reg => [
      reg.id,
      `"${reg.firstName || ''}"`,
      `"${reg.lastName || ''}"`,
      reg.age,
      `"${reg.phone}"`,
      reg.isStudent,
      `"${reg.studentLevel || ''}"`,
      `"${reg.studentLocation || ''}"`,
      `"${reg.church}"`,
      reg.hasSnack,
      `"${reg.snackDetail || ''}"`,
      reg.addedToGroup ? 'Oui' : 'Non',
      `"${new Date(reg.createdAt).toLocaleString('fr-FR')}"`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Envoyer le fichier
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inscriptions.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error);
    res.status(500).json({ error: 'Erreur lors de l\'export' });
  }
});

module.exports = router;
