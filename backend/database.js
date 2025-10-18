const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'db.sqlite');

// Créer une nouvelle connexion à la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
    process.exit(1);
  }
  console.log('Connecté à la base de données SQLITE');
});

// Fonction pour exécuter des requêtes avec promesse
const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Fonction pour exécuter des requêtes qui ne renvoient pas de résultats
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// Fonction pour exécuter des requêtes qui renvoient plusieurs lignes
const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Fonction pour initialiser la base de données
async function initializeDatabase() {
  try {
    // Désactiver le mode synchrone pour améliorer les performances
    await dbRun('PRAGMA journal_mode = WAL');
    
    // Créer les tables séquentiellement
    await dbRun(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL
      )
    `);
    console.log('Table admin_users vérifiée/créée');

    await dbRun(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        attemptTime DATETIME DEFAULT CURRENT_TIMESTAMP,
        success INTEGER DEFAULT 0
      )
    `);
    console.log('Table login_attempts vérifiée/créée');

    await dbRun(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        age INTEGER NOT NULL,
        phone TEXT NOT NULL,
        isStudent TEXT NOT NULL,
        studentLevel TEXT,
        studentLocation TEXT,
        church TEXT NOT NULL,
        hasSnack TEXT NOT NULL,
        snackDetail TEXT,
        addedToGroup INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table registrations vérifiée/créée');

    // Vérifier et créer un admin par défaut si nécessaire
    const admin = await dbGet('SELECT * FROM admin_users WHERE username = ?', ['admin']);
    if (!admin) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await dbRun(
        'INSERT INTO admin_users (username, passwordHash) VALUES (?, ?)',
        ['admin', hashedPassword]
      );
      console.log('✅ Compte admin créé par défaut (username: admin, password: admin123)');
    }

  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

// Exécuter l'initialisation
initializeDatabase().catch(console.error);

module.exports = {
  db,
  dbGet,
  dbRun,
  dbAll
};