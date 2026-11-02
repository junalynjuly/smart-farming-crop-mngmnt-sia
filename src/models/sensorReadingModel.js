const db = require('../config/db');

const METRICS = ['soil_moisture', 'temperature', 'ph'];

async function getAll() {
  const [rows] = await db.query('SELECT * FROM sensor_readings ORDER BY reading_time DESC');
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM sensor_readings WHERE reading_id = ?', [id]);
  return rows[0];
}

async function create({ field_id, metric, value, reading_time }) {
  const [result] = await db.query(
    'INSERT INTO sensor_readings (field_id, metric, value, reading_time) VALUES (?, ?, ?, ?)',
    [field_id, metric, value, reading_time || new Date()]
  );
  return getById(result.insertId);
}

module.exports = { METRICS, getAll, getById, create };
