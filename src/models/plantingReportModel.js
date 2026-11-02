const pool = require('../config/dbPool');

// LEFT JOIN: every planting is kept, even with no harvest yet.
async function plantingsWithHarvests() {
  const [rows] = await pool.query(
    `SELECT p.planting_id, f.field_name, c.crop_name, p.status,
            DATE_FORMAT(h.harvest_date, '%Y-%m-%d') AS harvest_date,
            h.quantity_kg, h.quality_grade
     FROM plantings p
     INNER JOIN fields f ON p.field_id = f.field_id
     INNER JOIN crops c ON p.crop_id = c.crop_id
     LEFT JOIN harvests h ON h.planting_id = p.planting_id
     ORDER BY p.planting_id, h.harvest_date`);
  return rows;
}

module.exports = { plantingsWithHarvests };
