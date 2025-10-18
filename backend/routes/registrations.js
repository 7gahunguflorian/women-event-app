const express = require('express');
const router = express.Router();
const { pool, dbGet, dbRun, dbAll } = require('../database');
const { requireAuth } = require('../auth');

// Fonction pour normaliser les noms de colonnes PostgreSQL (minuscules -> camelCase)
const normalizeRegistration = (reg) => {
  if (!reg) return null;
  return {
    id: reg.id,
    firstName: reg.firstname || reg.firstName,
    lastName: reg.lastname || reg.lastName,
    age: reg.age,
    phone: reg.phone,
    isStudent: reg.isstudent || reg.isStudent,
    studentLevel: reg.studentlevel || reg.studentLevel,
    studentLocation: reg.studentlocation || reg.studentLocation,
    church: reg.church,
    hasSnack: reg.hassnack || reg.hasSnack,
    snackDetail: reg.snackdetail || reg.snackDetail,
    addedToGroup: reg.addedtogroup !== undefined ? reg.addedtogroup : reg.addedToGroup,
    createdAt: reg.createdat || reg.createdAt
  };
};

// GET - Récupérer toutes les inscriptions (protégé)
router.get('/', requireAuth, async (req, res) => {
  try {
    const registrations = await dbAll('SELECT * FROM registrations ORDER BY createdAt DESC');
    const normalized = registrations.map(normalizeRegistration);
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques (protégé)
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const total = await dbGet('SELECT COUNT(*) as count FROM registrations');
    const withSnack = await dbGet('SELECT COUNT(*) as count FROM registrations WHERE hasSnack = \'oui\'');
    const students = await dbGet('SELECT COUNT(*) as count FROM registrations WHERE isStudent = \'oui\'');
    const addedToGroup = await dbGet('SELECT COUNT(*) as count FROM registrations WHERE addedToGroup = 1');
    
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
    const existingPhone = await dbGet('SELECT * FROM registrations WHERE phone = $1', [phone]);
    if (existingPhone) {
      return res.status(409).json({ error: 'Ce numéro de téléphone est déjà inscrit' });
    }

    // Insérer dans la base de données
    const result = await dbRun(
      `INSERT INTO registrations 
      (firstName, lastName, age, phone, isStudent, studentLevel, studentLocation, church, hasSnack, snackDetail)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [
        firstName, 
        lastName, 
        age, 
        phone, 
        isStudent, 
        isStudent === 'oui' ? studentLevel : null, 
        isStudent === 'oui' ? studentLocation : null, 
        church, 
        hasSnack, 
        hasSnack === 'oui' ? snackDetail : null
      ]
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

    await dbRun(
      `UPDATE registrations 
       SET firstName = $1, 
           lastName = $2, 
           age = $3, 
           phone = $4, 
           isStudent = $5, 
           studentLevel = $6, 
           studentLocation = $7, 
           church = $8, 
           hasSnack = $9, 
           snackDetail = $10,
           addedToGroup = $11
       WHERE id = $12`,
      [
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
      ]
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
    await dbRun('DELETE FROM registrations WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET - Export CSV (protégé)
router.get('/export/csv', requireAuth, async (req, res) => {
  try {
    const registrations = await dbAll('SELECT * FROM registrations ORDER BY lastName, firstName');
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
