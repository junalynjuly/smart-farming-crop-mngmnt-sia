
const db = require('../config/db');

async function getAllGrowthStages() {
    try {
        const [rows] = await db.query(
            'SELECT * FROM crop_growth_stages ORDER BY crop_id, stage_order'
        );
        return rows;
    } catch (err) {
        if (err.code === 'ER_NO_SUCH_TABLE') {
            return [];
        }
        throw err;
    }
}

async function createGrowthStage(data) {
    const [result] = await db.query(`
        INSERT INTO crop_growth_stages
        (crop_id, stage_name, stage_order, start_day, end_day)
        VALUES (?, ?, ?, ?, ?)
    `, [
        data.crop_id,
        data.stage_name,
        data.stage_order,
        data.start_day,
        data.end_day
    ]);
    return result;
}

async function updateGrowthStage(stageId, data) {
    const [result] = await db.query(`
        UPDATE crop_growth_stages
        SET crop_id = ?,
            stage_name = ?,
            stage_order = ?,
            start_day = ?,
            end_day = ?
        WHERE stage_id = ?
    `, [
        data.crop_id,
        data.stage_name,
        data.stage_order,
        data.start_day,
        data.end_day,
        stageId
    ]);
    return result;
}

async function deleteGrowthStage(stageId) {
    const [result] = await db.query(`
        DELETE FROM crop_growth_stages
        WHERE stage_id = ?
    `, [stageId]);
    return result;
}

module.exports = {
    getAllGrowthStages,
    createGrowthStage,
    updateGrowthStage,
    deleteGrowthStage
};
