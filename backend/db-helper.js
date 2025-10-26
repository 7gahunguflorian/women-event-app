const { db, pool, isProduction } = require('./database');

// Fonction helper pour exécuter des requêtes GET (une seule ligne)
async function dbGet(sql, params = []) {
  if (isProduction) {
    // PostgreSQL - remplacer ? par $1, $2, etc.
    const pgSql = sql.replace(/\?/g, (_, i) => `$${params.indexOf(_) + 1}`);
    let paramIndex = 1;
    const pgSqlFinal = sql.replace(/\?/g, () => `$${paramIndex++}`);
    
    const client = await pool.connect();
    try {
      const result = await client.query(pgSqlFinal, params);
      return result.rows[0];
    } finally {
      client.release();
    }
  } else {
    // SQLite
    return db.prepare(sql).get(...params);
  }
}

// Fonction helper pour exécuter des requêtes ALL (plusieurs lignes)
async function dbAll(sql, params = []) {
  if (isProduction) {
    // PostgreSQL
    let paramIndex = 1;
    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    
    const client = await pool.connect();
    try {
      const result = await client.query(pgSql, params);
      return result.rows;
    } finally {
      client.release();
    }
  } else {
    // SQLite
    return db.prepare(sql).all(...params);
  }
}

// Fonction helper pour exécuter des requêtes RUN (INSERT, UPDATE, DELETE)
async function dbRun(sql, params = []) {
  if (isProduction) {
    // PostgreSQL
    let paramIndex = 1;
    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    
    const client = await pool.connect();
    try {
      const result = await client.query(pgSql, params);
      return {
        lastID: result.rows && result.rows.length > 0 ? result.rows[0].id : null,
        changes: result.rowCount
      };
    } finally {
      client.release();
    }
  } else {
    // SQLite
    const result = db.prepare(sql).run(...params);
    return {
      lastID: result.lastInsertRowid,
      changes: result.changes
    };
  }
}

module.exports = { dbGet, dbAll, dbRun };
