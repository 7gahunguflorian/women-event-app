const express = require('express');
const router = express.Router();
const { db, dbGet, dbRun, dbAll } = require('../database');
const { requireAuth } = require('../auth');

// GET - Récupérer toutes les inscriptions (protégé)
router.get('/', requireAuth, async (req, res) => {
  try {
    const registrations = await dbAll('SELECT * FROM registrations ORDER BY createdAt DESC');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques (protégé)
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const total = await dbGet('SELECT COUNT(*) as count FROM registrations');
    const withSnack = await dbGet('SELECT COUNT(*) as count FROM registrations WHERE hasSnack = "oui"');
    const students = await dbGet('SELECT COUNT(*) as count FROM registrations WHERE isStudent = "oui"');
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
    const existingPhone = await dbGet('SELECT * FROM registrations WHERE phone = ?', [phone]);
    if (existingPhone) {
      return res.status(409).json({ error: 'Ce numéro de téléphone est déjà inscrit' });
    }

    // Insérer dans la base de données
    const result = await dbRun(
      `INSERT INTO registrations 
      (firstName, lastName, age, phone, isStudent, studentLevel, studentLocation, church, hasSnack, snackDetail)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    await dbRun(
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
       WHERE id = ?`,
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
        hasSnack === 'oui' ? snackDetail : null,
        addedToGroup ? 1 : 0,
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
    await dbRun('DELETE FROM registrations WHERE id = ?', [id]);
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
    
    // Créer le contenu CSV
    const headers = [
      'ID', 'Prénom', 'Nom', 'Âge', 'Téléphone', 'Étudiante', 
      'Niveau d\'études', 'Lieu d\'études', 'Église', 
      'Apporte un snack', 'Détail du snack', 'Ajouté(e) au groupe', 'Date d\'inscription'
    ];
    
    const rows = registrations.map(reg => [
      reg.id,
      `"${reg.firstName}"`,
      `"${reg.lastName}"`,
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
