const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { dbGet, dbRun, dbAll } = require('../database');
const { requireAuth } = require('../auth');

// GET - Récupérer tous les utilisateurs (protégé)
router.get('/', requireAuth, async (req, res) => {
  try {
    const users = await dbAll('SELECT id, username FROM admin_users ORDER BY username');
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST - Créer un nouvel utilisateur (protégé)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await dbGet('SELECT * FROM admin_users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(409).json({ error: 'Ce nom d\'utilisateur existe déjà' });
    }

    // Hasher le mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insérer dans la base de données
    const result = await dbRun(
      'INSERT INTO admin_users (username, passwordHash) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({ 
      message: 'Utilisateur créé avec succès',
      id: result.lastID,
      username 
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE - Supprimer un utilisateur (protégé)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Empêcher la suppression du dernier admin
    const userCount = await dbGet('SELECT COUNT(*) as count FROM admin_users');
    if (userCount.count <= 1) {
      return res.status(400).json({ error: 'Impossible de supprimer le dernier administrateur' });
    }

    await dbRun('DELETE FROM admin_users WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
