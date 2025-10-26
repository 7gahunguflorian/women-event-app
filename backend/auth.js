const bcrypt = require('bcryptjs');
const { db, pool, isProduction } = require('./database');

// Map pour stocker les verrouillages en mémoire
const loginLocks = new Map();

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
    if (isProduction) {
      const client = await pool.connect();
      try {
        await client.query('INSERT INTO login_attempts (username, success) VALUES ($1, $2)', [username, success ? 1 : 0]);
      } finally {
        client.release();
      }
    } else {
      db.prepare('INSERT INTO login_attempts (username, success) VALUES (?, ?)').run(username, success ? 1 : 0);
    }
    
    if (!success) {
      // Compter les tentatives échouées dans les 30 dernières minutes
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      
      let result;
      if (isProduction) {
        const client = await pool.connect();
        try {
          const res = await client.query(
            'SELECT COUNT(*) as count FROM login_attempts WHERE username = $1 AND success = 0 AND attemptTime > $2',
            [username, thirtyMinutesAgo]
          );
          result = res.rows[0];
        } finally {
          client.release();
        }
      } else {
        result = db.prepare(
          'SELECT COUNT(*) as count FROM login_attempts WHERE username = ? AND success = 0 AND attemptTime > ?'
        ).get(username, thirtyMinutesAgo);
      }
      
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
    let user;
    if (isProduction) {
      const client = await pool.connect();
      try {
        const res = await client.query('SELECT * FROM admin_users WHERE username = $1', [username]);
        user = res.rows[0];
      } finally {
        client.release();
      }
    } else {
      user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
    }
    
    if (!user) {
      const attemptResult = await recordAttempt(username, false);
      return {
        success: false,
        message: 'Identifiants incorrects',
        ...attemptResult
      };
    }
    
    // PostgreSQL retourne les colonnes en minuscules, SQLite en camelCase
    const passwordHash = user.passwordhash || user.passwordHash;
    
    if (!passwordHash) {
      console.error('❌ Pas de passwordHash trouvé pour l\'utilisateur:', user);
      return {
        success: false,
        message: 'Erreur de configuration du compte'
      };
    }
    
    const passwordMatch = await bcrypt.compare(password, passwordHash);
    
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
