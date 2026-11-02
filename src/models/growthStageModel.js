
const db = require('../config/db');

// GET all growth stages
function getAllGrowthStages(callback) {
    const sql = `
        SELECT *
        FROM crop_growth_stages
        ORDER BY crop_id, stage_order
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return callback(err, null);
        }

        callback(null, results);
    });
}

// CREATE a new growth stage
function createGrowthStage(data, callback) {
    const sql = `
        INSERT INTO crop_growth_stages
        (crop_id, stage_name, stage_order, start_day, end_day)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        data.crop_id,
        data.stage_name,
        data.stage_order,
        data.start_day,
        data.end_day
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return callback(err, null);
        }

        callback(null, result);
    });
}

// UPDATE an existing growth stage
function updateGrowthStage(stageId, data, callback) {
    const sql = `
        UPDATE crop_growth_stages
        SET crop_id = ?,
            stage_name = ?,
            stage_order = ?,
            start_day = ?,
            end_day = ?
        WHERE stage_id = ?
    `;

    const values = [
        data.crop_id,
        data.stage_name,
        data.stage_order,
        data.start_day,
        data.end_day,
        stageId
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return callback(err, null);
        }

        callback(null, result);
    });
}

// DELETE an existing growth stage
function deleteGrowthStage(stageId, callback) {
    const sql = `
        DELETE FROM crop_growth_stages
        WHERE stage_id = ?
    `;

    db.query(sql, [stageId], (err, result) => {
        if (err) {
            return callback(err, null);
        }

        callback(null, result);
    });
}

module.exports = {
    getAllGrowthStages,
    createGrowthStage,
    updateGrowthStage,
    deleteGrowthStage
};
