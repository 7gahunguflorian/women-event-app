const Database = require('better-sqlite3');
const path = require('path');

// Créer ou ouvrir la base de données SQLite
const dbPath = path.join(__dirname, 'db.sqlite');
const db = new Database(dbPath);

console.log('✅ Base de données SQLite connectée:', dbPath);

// Activer les clés étrangères
db.pragma('foreign_keys = ON');

// Créer les tables si elles n'existent pas
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

console.log('✅ Tables vérifiées/créées');

module.exports = db;