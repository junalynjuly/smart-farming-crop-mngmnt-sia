const db = require('../config/db');

async function log({ user_id = null, action, table_name, record_id = null, details = null }) {
  await db.query(
    'INSERT INTO audit_logs (user_id, action, table_name, record_id, details) VALUES (?, ?, ?, ?, ?)',
    [user_id, action, table_name, record_id, details]
  );
}

async function getAll() {
  const [rows] = await db.query('SELECT * FROM audit_logs ORDER BY log_id DESC');
  return rows;
}

module.exports = { log, getAll };
