const bcrypt = require('bcryptjs');
const { db, dbGet, dbRun } = require('./database');

// Map pour stocker les verrouillages en mémoire
const loginLocks = new Map();

// Initialiser un admin par défaut si aucun n'existe
async function initializeAdmin() {
  try {
    const checkAdmin = await dbGet('SELECT * FROM admin_users WHERE username = ?', ['admin']);
    
    if (!checkAdmin) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await dbRun('INSERT INTO admin_users (username, passwordHash) VALUES (?, ?)', ['admin', hashedPassword]);
      console.log('✅ Admin par défaut créé: username=admin, password=admin123');
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'admin:', error);
  }
}

// Appeler initializeAdmin au démarrage
initializeAdmin().catch(console.error);

// Vérifier si un utilisateur est verrouillé
function isLocked(username) {
  const lock = loginLocks.get(username);
  if (!lock) return false;
  
  // Vérifier si le verrou est toujours valide (30 minutes)
  if (Date.now() < lock.lockedUntil) {
    return true;
  }
  
  // Supprimer le verrou s'il a expiré
  loginLocks.delete(username);
  return false;
}

// Obtenir le temps restant de verrouillage
function getLockTimeRemaining(username) {
  const lock = loginLocks.get(username);
  if (!lock) return 0;
  
  const remaining = Math.ceil((lock.lockedUntil - Date.now()) / 1000 / 60);
  return remaining > 0 ? remaining : 0;
}

// Enregistrer une tentative de connexion
async function recordAttempt(username, success) {
  try {
    await dbRun('INSERT INTO login_attempts (username, success) VALUES (?, ?)', [username, success ? 1 : 0]);
    
    if (!success) {
      // Compter les tentatives échouées dans les 30 dernières minutes
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      
      const result = await dbGet(
        'SELECT COUNT(*) as count FROM login_attempts WHERE username = ? AND success = 0 AND attemptTime > ?',
        [username, thirtyMinutesAgo]
      );
      
      if (result && result.count >= 5) {
        // Verrouiller pour 30 minutes
        const lockedUntil = Date.now() + 30 * 60 * 1000;
        loginLocks.set(username, { lockedUntil, attempts: result.count });
        return { locked: true, remainingMinutes: 30 };
      }
    }
    
    return { locked: false };
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la tentative de connexion:', error);
    return { locked: false };
  }
}

// Authentifier un utilisateur
async function authenticate(username, password) {
  try {
    // Vérifier si le compte est verrouillé
    if (isLocked(username)) {
      const remainingMinutes = getLockTimeRemaining(username);
      return {
        success: false,
        message: `Trop de tentatives échouées. Veuillez réessayer dans ${remainingMinutes} minutes.`,
        locked: true
      };
    }
    
    // Vérifier les identifiants
    const user = await dbGet('SELECT * FROM admin_users WHERE username = ?', [username]);
    
    if (!user) {
      const attemptResult = await recordAttempt(username, false);
      return {
        success: false,
        message: 'Identifiants incorrects',
        ...attemptResult
      };
    }
    
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!passwordMatch) {
      const attemptResult = await recordAttempt(username, false);
      return {
        success: false,
        message: 'Identifiants incorrects',
        ...attemptResult
      };
    }
    
    // Connexion réussie
    await recordAttempt(username, true);
    
    // Générer un token simple (dans une vraie app, utiliser JWT)
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    
    return {
      success: true,
      message: 'Connexion réussie',
      token,
      username: user.username
    };
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    return {
      success: false,
      message: 'Une erreur est survenue lors de l\'authentification'
    };
  }
}

// Middleware pour vérifier l'authentification
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authentification requise' });
    }
    
    // Vérifier le token (dans une vraie app, vérifier un JWT)
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token invalide' });
    }
    
    // Ici, on vérifie simplement si le token est présent
    // Dans une vraie app, on vérifierait la validité du JWT
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification de l\'authentification' });
  }
}


module.exports = {
  authenticate,
  requireAuth,
  isLocked,
  getLockTimeRemaining
};
