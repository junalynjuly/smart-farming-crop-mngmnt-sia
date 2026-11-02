const pool = require('../config/dbPool');

const BASE = `SELECT h.harvest_id, h.planting_id, f.field_name, c.crop_name,
  DATE_FORMAT(h.harvest_date, '%Y-%m-%d') AS harvest_date, h.quantity_kg, h.quality_grade
  FROM harvests h
  JOIN plantings p ON h.planting_id = p.planting_id
  JOIN fields f ON p.field_id = f.field_id
  JOIN crops c ON p.crop_id = c.crop_id`;

async function getAll() {
  const [rows] = await pool.query(BASE + ' ORDER BY h.harvest_id');
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(BASE + ' WHERE h.harvest_id = ?', [id]);
  return rows[0] || null;
}

// One transaction: insert harvest, mark planting Harvested, free the field.
async function create(d) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [p] = await conn.query(
      'SELECT field_id, status FROM plantings WHERE planting_id = ? FOR UPDATE', [d.planting_id]);
    if (!p.length) throw new Error('PLANTING_NOT_FOUND');
    if (p[0].status !== 'Active') throw new Error('NOT_ACTIVE');
    const [r] = await conn.query(
      `INSERT INTO harvests (planting_id, harvest_date, quantity_kg, quality_grade, recorded_by)
       VALUES (?, ?, ?, ?, ?)`,
      [d.planting_id, d.harvest_date, d.quantity_kg, d.quality_grade, d.recorded_by || null]);
    await conn.query("UPDATE plantings SET status = 'Harvested' WHERE planting_id = ?", [d.planting_id]);
    await conn.query("UPDATE fields SET status = 'Available' WHERE field_id = ?", [p[0].field_id]);
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
