const pool = require('../config/dbPool');

const BASE = `SELECT u.usage_id, u.planting_id, f.field_name, i.input_name, i.unit,
  u.quantity_used, DATE_FORMAT(u.usage_date, '%Y-%m-%d') AS usage_date
  FROM input_usage u
  JOIN plantings p ON u.planting_id = p.planting_id
  JOIN fields f ON p.field_id = f.field_id
  JOIN farm_inputs i ON u.input_id = i.input_id`;

async function getAll() {
  const [rows] = await pool.query(BASE + ' ORDER BY u.usage_id');
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(BASE + ' WHERE u.usage_id = ?', [id]);
  return rows[0] || null;
}

// One transaction: check stock, insert the usage, subtract the stock.
async function create(d) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [p] = await conn.query('SELECT planting_id FROM plantings WHERE planting_id = ?', [d.planting_id]);
    if (!p.length) throw new Error('PLANTING_NOT_FOUND');
    const [i] = await conn.query('SELECT quantity FROM farm_inputs WHERE input_id = ? FOR UPDATE', [d.input_id]);
    if (!i.length) throw new Error('INPUT_NOT_FOUND');
    const stock = parseFloat(i[0].quantity);
    if (d.quantity_used > stock) { const err = new Error('NOT_ENOUGH'); err.stock = stock; throw err; }
    const [r] = await conn.query(
      `INSERT INTO input_usage (planting_id, input_id, quantity_used, usage_date, used_by)
       VALUES (?, ?, ?, ?, ?)`,
      [d.planting_id, d.input_id, d.quantity_used, d.usage_date, d.used_by || null]);
    await conn.query('UPDATE farm_inputs SET quantity = quantity - ? WHERE input_id = ?', [d.quantity_used, d.input_id]);
    await conn.commit();
    return r.insertId;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

module.exports = { getAll, getById, create };
