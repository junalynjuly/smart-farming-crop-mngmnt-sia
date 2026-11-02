
const db = require('../config/db');

async function getAllThresholds() {
    const [rows] = await db.query(`
        SELECT threshold_id, crop_id, metric, min_value, max_value
        FROM crop_thresholds
        ORDER BY crop_id, metric
    `);

    return rows;
}

async function createThreshold(data) {
    const [result] = await db.query(`
        INSERT INTO crop_thresholds
        (crop_id, metric, min_value, max_value)
        VALUES (?, ?, ?, ?)
    `, [
        data.crop_id,
        data.metric,
        data.min_value,
        data.max_value
    ]);

    return result;
}

async function updateThreshold(thresholdId, data) {
    const [result] = await db.query(`
        UPDATE crop_thresholds
        SET crop_id = ?,
            metric = ?,
            min_value = ?,
            max_value = ?
        WHERE threshold_id = ?
    `, [
        data.crop_id,
        data.metric,
        data.min_value,
        data.max_value,
        thresholdId
    ]);

    return result;
}

async function deleteThreshold(thresholdId) {
    const [result] = await db.query(`
        DELETE FROM crop_thresholds
        WHERE threshold_id = ?
    `, [thresholdId]);

    return result;
}

module.exports = {
    getAllThresholds,
    createThreshold,
    updateThreshold,
    deleteThreshold
};
