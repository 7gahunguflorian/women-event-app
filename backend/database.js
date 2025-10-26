require('dotenv').config();
const path = require('path');

// Déterminer le type de base de données selon l'environnement
const DATABASE_URL = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production' || (DATABASE_URL && DATABASE_URL.startsWith('postgresql'));

let db, pool;

if (isProduction) {
  // PostgreSQL pour la production
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  console.log('✅ Base de données PostgreSQL connectée (Production)');
} else {
  // SQLite pour le développement local
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, 'db.sqlite');
  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  console.log('✅ Base de données SQLite connectée (Local):', dbPath);
}

// Fonction pour initialiser la base de données
async function initializeDatabase() {
  const bcrypt = require('bcryptjs');
  
  if (isProduction) {
    // PostgreSQL
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          passwordHash VARCHAR(255) NOT NULL
        )
      `);
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS login_attempts (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          attemptTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          success INTEGER DEFAULT 0
        )
      `);
      
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
          church VARCHAR(255),
          hasSnack VARCHAR(10) NOT NULL,
          snackDetail TEXT,
          addedToGroup INTEGER DEFAULT 0,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('✅ Tables PostgreSQL vérifiées/créées');
      
      // Créer l'admin par défaut
      const adminResult = await client.query('SELECT * FROM admin_users WHERE username = $1', ['admin']);
      if (adminResult.rows.length === 0) {
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        await client.query('INSERT INTO admin_users (username, passwordHash) VALUES ($1, $2)', ['admin', hashedPassword]);
        console.log('✅ Compte admin créé (username: admin, password: admin123)');
      } else {
        console.log('✅ Compte admin existe déjà');
      }
    } finally {
      client.release();
    }
  } else {
    // SQLite
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL
      )
    `);
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        attemptTime DATETIME DEFAULT CURRENT_TIMESTAMP,
        success INTEGER DEFAULT 0
      )
    `);
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        age INTEGER NOT NULL,
        phone TEXT NOT NULL,
        isStudent TEXT NOT NULL,
        studentLevel TEXT,
        studentLocation TEXT,
        church TEXT,
        hasSnack TEXT NOT NULL,
        snackDetail TEXT,
        addedToGroup INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Tables SQLite vérifiées/créées');
    
    // Créer l'admin par défaut
    const adminUser = db.prepare('SELECT * FROM admin_users WHERE username = ?').get('admin');
    if (!adminUser) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.prepare('INSERT INTO admin_users (username, passwordHash) VALUES (?, ?)').run('admin', hashedPassword);
      console.log('✅ Compte admin créé (username: admin, password: admin123)');
    } else {
      console.log('✅ Compte admin existe déjà');
    }
  }
}

// Initialiser la base de données
initializeDatabase().catch(console.error);

module.exports = { db, pool, isProduction };