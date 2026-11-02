const db = require('../config/db');

const SEVERITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Open', 'Acknowledged', 'Resolved'];

async function getAll() {
  const [rows] = await db.query('SELECT * FROM alerts ORDER BY alert_id DESC');
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM alerts WHERE alert_id = ?', [id]);
  return rows[0];
}

async function create({ field_id, reading_id = null, threshold_id = null, task_id = null, severity, message, status = 'Open' }) {
  const [result] = await db.query(
    `INSERT INTO alerts (field_id, reading_id, threshold_id, task_id, severity, message, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [field_id, reading_id, threshold_id, task_id, severity, message, status]
  );
  return getById(result.insertId);
}

async function update(id, { severity, message, status }) {
  const [result] = await db.query(
    `UPDATE alerts SET severity = COALESCE(?, severity),
                       message = COALESCE(?, message),
                       status = COALESCE(?, status)
     WHERE alert_id = ?`,
    [severity ?? null, message ?? null, status ?? null, id]
  );
  if (result.affectedRows === 0) return null;
  return getById(id);
}

async function remove(id) {
  const [result] = await db.query('DELETE FROM alerts WHERE alert_id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { SEVERITIES, STATUSES, getAll, getById, create, update, remove };
