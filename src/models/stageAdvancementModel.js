const db = require('../config/db');

async function advanceStages() {
    const [plantings] = await db.query(`
        SELECT
            p.planting_id,
            p.crop_id,
            p.planting_date,
            c.days_to_maturity,
            DATEDIFF(CURDATE(), p.planting_date) AS days_growing
        FROM plantings p
        INNER JOIN crops c
            ON p.crop_id = c.crop_id
        WHERE p.status = 'Active'
    `);

    const results = [];

    for (const planting of plantings) {
        const [stages] = await db.query(`
            SELECT stage_id, stage_name, stage_order
            FROM crop_growth_stages
            WHERE crop_id = ?
              AND start_day <= ?
              AND end_day >= ?
            ORDER BY stage_order
            LIMIT 1
        `, [
            planting.crop_id,
            planting.days_growing,
            planting.days_growing
        ]);

        const [prediction] = await db.query(`
            SELECT DATE_ADD(?, INTERVAL ? DAY)
                AS predicted_harvest_date
        `, [
            planting.planting_date,
            planting.days_to_maturity
        ]);

        if (stages.length > 0) {
            await db.query(`
                UPDATE plantings
                SET current_stage_id = ?,
                    expected_harvest_date = ?
                WHERE planting_id = ?
                  AND status = 'Active'
            `, [
                stages[0].stage_id,
                prediction[0].predicted_harvest_date,
                planting.planting_id
            ]);
        } else {
            await db.query(`
                UPDATE plantings
                SET expected_harvest_date = ?
                WHERE planting_id = ?
                  AND status = 'Active'
            `, [
                prediction[0].predicted_harvest_date,
                planting.planting_id
            ]);
        }

        results.push({
            planting_id: planting.planting_id,
            days_growing: planting.days_growing,
            current_stage: stages.length > 0
                ? stages[0].stage_name
                : null,
            predicted_harvest_date:
                prediction[0].predicted_harvest_date,
            stage_configured: stages.length > 0
        });
    }

    return results;
}

module.exports = { advanceStages };