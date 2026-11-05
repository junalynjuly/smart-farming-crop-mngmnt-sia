const db = require('../config/db');

async function getAllCareTasks() {
    const [rows] = await db.query(`
        SELECT
            task_id,
            planting_id,
            task_type,
            due_date,
            status,
            source,
            skip_reason,
            assigned_to,
            created_at
        FROM care_tasks
        ORDER BY due_date, task_id
    `);

    return rows;
}

async function createCareTask(data) {
    const [result] = await db.query(`
        INSERT INTO care_tasks
            (planting_id, task_type, due_date, status, source, skip_reason, assigned_to)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
        data.planting_id,
        data.task_type,
        data.due_date,
        data.status,
        data.source,
        data.skip_reason,
        data.assigned_to
    ]);

    return result;
}

async function updateCareTask(taskId, data) {
    const [result] = await db.query(`
        UPDATE care_tasks
        SET planting_id = ?,
            task_type = ?,
            due_date = ?,
            status = ?,
            source = ?,
            skip_reason = ?,
            assigned_to = ?
        WHERE task_id = ?
    `, [
        data.planting_id,
        data.task_type,
        data.due_date,
        data.status,
        data.source,
        data.skip_reason,
        data.assigned_to,
        taskId
    ]);

    return result;
}

async function deleteCareTask(taskId) {
    const [result] = await db.query(`
        DELETE FROM care_tasks
        WHERE task_id = ?
    `, [taskId]);

    return result;
}

module.exports = {
    getAllCareTasks,
    createCareTask,
    updateCareTask,
    deleteCareTask
};