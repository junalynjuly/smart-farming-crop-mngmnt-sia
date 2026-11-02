const db = require('../config/db');

async function getCurrentStages() {
    const [rows] = await db.query(`
        SELECT
            p.planting_id,
            f.field_name,
            c.crop_name,
            p.planting_date,
            p.expected_harvest_date,
            s.stage_name AS current_stage,
            s.stage_order
        FROM plantings p
        INNER JOIN fields f
            ON p.field_id = f.field_id
        INNER JOIN crops c
            ON p.crop_id = c.crop_id
        INNER JOIN crop_growth_stages s
            ON p.current_stage_id = s.stage_id
            AND p.crop_id = s.crop_id
        WHERE p.status = 'Active'
        ORDER BY p.planting_id
    `);

    return rows;
}

module.exports = { getCurrentStages };