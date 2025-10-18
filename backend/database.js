const { Pool } = require('pg');
require('dotenv').config();

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test de connexion
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erreur de connexion à PostgreSQL:', err.message);
    process.exit(1);
  }
  console.log('✅ Connecté à la base de données PostgreSQL');
  release();
});

// Fonction pour exécuter des requêtes avec promesse (retourne une seule ligne)
const dbGet = async (sql, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows[0];
  } finally {
    client.release();
  }
};

// Fonction pour exécuter des requêtes qui ne renvoient pas de résultats
const dbRun = async (sql, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    // Si la requête contient RETURNING, retourner l'ID de la première ligne
    // Sinon, retourner null pour lastID
    return { 
      lastID: result.rows && result.rows.length > 0 ? result.rows[0].id : null, 
      changes: result.rowCount 
    };
  } finally {
    client.release();
  }
};

// Fonction pour exécuter des requêtes qui renvoient plusieurs lignes
const dbAll = async (sql, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
};

// Fonction pour initialiser la base de données
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Créer les tables séquentiellement avec syntaxe PostgreSQL
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        passwordHash VARCHAR(255) NOT NULL
      )
    `);
    console.log('✅ Table admin_users vérifiée/créée');

    await client.query(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        attemptTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        success INTEGER DEFAULT 0
      )
    `);
    console.log('✅ Table login_attempts vérifiée/créée');

    await client.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        age INTEGER NOT NULL,
        phone VARCHAR(50) NOT NULL,
        isStudent VARCHAR(10) NOT NULL,
        studentLevel VARCHAR(100),
        studentLocation VARCHAR(255),
        church VARCHAR(255) NOT NULL,
        hasSnack VARCHAR(10) NOT NULL,
        snackDetail TEXT,
        addedToGroup INTEGER DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table registrations vérifiée/créée');

    // Vérifier et créer un admin par défaut si nécessaire
    const adminResult = await client.query('SELECT * FROM admin_users WHERE username = $1', ['admin']);
    if (adminResult.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await client.query(
        'INSERT INTO admin_users (username, passwordHash) VALUES ($1, $2)',
        ['admin', hashedPassword]
      );
      console.log('✅ Compte admin créé par défaut (username: admin, password: admin123)');
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  } finally {
    client.release();
  }
}

// Exécuter l'initialisation
initializeDatabase().catch(console.error);

module.exports = {
  pool,
  dbGet,
  dbRun,
  dbAll
};