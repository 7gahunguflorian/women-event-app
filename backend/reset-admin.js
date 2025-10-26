const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Ouvrir la base de données
const dbPath = path.join(__dirname, 'db.sqlite');
const db = new Database(dbPath);

console.log('🔧 Réinitialisation du compte admin...\n');

try {
  // Supprimer l'ancien admin s'il existe
  const deleteStmt = db.prepare('DELETE FROM admin_users WHERE username = ?');
  const deleteResult = deleteStmt.run('admin');
  
  if (deleteResult.changes > 0) {
    console.log('✅ Ancien compte admin supprimé');
  }
  
  // Créer un nouveau compte admin
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  const insertStmt = db.prepare('INSERT INTO admin_users (username, passwordHash) VALUES (?, ?)');
  const insertResult = insertStmt.run('admin', hashedPassword);
  
  console.log('✅ Nouveau compte admin créé avec succès!\n');
  console.log('📋 Identifiants:');
  console.log('   Username: admin');
  console.log('   Password: admin123\n');
  
  // Vérifier que le compte existe
  const checkStmt = db.prepare('SELECT * FROM admin_users WHERE username = ?');
  const admin = checkStmt.get('admin');
  
  if (admin) {
    console.log('✅ Vérification: Le compte admin existe dans la base de données');
    console.log('   ID:', admin.id);
    console.log('   Username:', admin.username);
    console.log('   PasswordHash:', admin.passwordHash.substring(0, 20) + '...\n');
  }
  
  // Nettoyer les tentatives de connexion
  const cleanStmt = db.prepare('DELETE FROM login_attempts');
  const cleanResult = cleanStmt.run();
  console.log(`✅ ${cleanResult.changes} tentative(s) de connexion supprimée(s)\n`);
  
  console.log('🎉 Réinitialisation terminée avec succès!');
  console.log('💡 Vous pouvez maintenant vous connecter avec admin/admin123\n');
  
} catch (error) {
  console.error('❌ Erreur lors de la réinitialisation:', error.message);
  process.exit(1);
} finally {
  db.close();
}
