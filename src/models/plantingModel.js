const db = require('../config/dbPool');
const pool = typeof db.promise === 'function' ? db.promise() : db;

const BASE = `SELECT p.planting_id, p.field_id, f.field_name, p.crop_id, c.crop_name,
  p.planted_by, DATE_FORMAT(p.planting_date, '%Y-%m-%d') AS planting_date,
  DATE_FORMAT(p.expected_harvest_date, '%Y-%m-%d') AS expected_harvest_date, p.status
  FROM plantings p
  JOIN fields f ON p.field_id = f.field_id
  JOIN crops c ON p.crop_id = c.crop_id`;

async function withTx(fn) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

async function getAll() {
  const [rows] = await pool.query(BASE + ' ORDER BY p.planting_id');
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(BASE + ' WHERE p.planting_id = ?', [id]);
  return rows[0] || null;
}

function create(d) {
  return withTx(async (conn) => {
    const [f] = await conn.query('SELECT status FROM fields WHERE field_id = ? FOR UPDATE', [d.field_id]);
    if (!f.length) throw new Error('FIELD_NOT_FOUND');
    if (f[0].status === 'Planted') throw new Error('FIELD_BUSY');
    const [c] = await conn.query('SELECT growth_duration_days FROM crops WHERE crop_id = ?', [d.crop_id]);
    if (!c.length) throw new Error('CROP_NOT_FOUND');
    const [r] = await conn.query(
      `INSERT INTO plantings (field_id, crop_id, planted_by, planting_date, expected_harvest_date, status)
       VALUES (?, ?, ?, ?, DATE_ADD(?, INTERVAL ? DAY), 'Active')`,
      [d.field_id, d.crop_id, d.planted_by || null, d.planting_date, d.planting_date, c[0].growth_duration_days]);
    await conn.query("UPDATE fields SET status = 'Planted' WHERE field_id = ?", [d.field_id]);
    return r.insertId;
  });
}

function update(id, d) {
  return withTx(async (conn) => {
    const [rows] = await conn.query('SELECT field_id FROM plantings WHERE planting_id = ? FOR UPDATE', [id]);
    if (!rows.length) throw new Error('NOT_FOUND');
    await conn.query(
      `UPDATE plantings SET crop_id = ?, planting_date = ?, expected_harvest_date = ?, status = ?
       WHERE planting_id = ?`,
      [d.crop_id, d.planting_date, d.expected_harvest_date || null, d.status, id]);
    await conn.query('UPDATE fields SET status = ? WHERE field_id = ?',
      [d.status === 'Active' ? 'Planted' : 'Available', rows[0].field_id]);
    return true;
  });
}

function remove(id) {
  return withTx(async (conn) => {
    const [rows] = await conn.query('SELECT field_id, status FROM plantings WHERE planting_id = ? FOR UPDATE', [id]);
    if (!rows.length) throw new Error('NOT_FOUND');
    await conn.query('DELETE FROM plantings WHERE planting_id = ?', [id]);
    if (rows[0].status === 'Active') {
      await conn.query("UPDATE fields SET status = 'Available' WHERE field_id = ?", [rows[0].field_id]);
    }
    return true;
  });
}

module.exports = { getAll, getById, create, update, remove };

module.exports.getOptions = async () => {
  const [fields] = await pool.query('SELECT field_id, field_name, status FROM fields ORDER BY field_name');
  const [crops] = await pool.query('SELECT crop_id, crop_name, growth_duration_days FROM crops ORDER BY crop_name');
  return { fields, crops };
};
