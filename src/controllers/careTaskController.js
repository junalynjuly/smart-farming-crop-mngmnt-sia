const careTaskModel = require('../models/careTaskModel');

const allowedTaskTypes = [
    'Irrigation',
    'Fertilizing',
    'Pest control',
    'Weeding',
    'Other'
];

const allowedStatuses = [
    'Pending',
    'Done',
    'Skipped',
    'Overdue'
];

const allowedSources = ['Manual', 'Auto'];

function validateCareTask(data) {
    const plantingId = Number(data.planting_id);

    if (
        data.planting_id === undefined ||
        data.planting_id === null ||
        data.planting_id === '' ||
        !Number.isInteger(plantingId) ||
        plantingId <= 0
    ) {
        return 'Planting ID must be a positive whole number.';
    }

    if (!allowedTaskTypes.includes(data.task_type)) {
        return 'Please select a valid task type.';
    }

    if (
        typeof data.due_date !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data.due_date) ||
        Number.isNaN(Date.parse(data.due_date))
    ) {
        return 'Due date must use YYYY-MM-DD format.';
    }

    if (!allowedStatuses.includes(data.status)) {
        return 'Please select a valid task status.';
    }

    if (!allowedSources.includes(data.source)) {
        return 'Source must be Manual or Auto.';
    }

    const skipReason = String(data.skip_reason ?? '').trim();

    if (data.status === 'Skipped' && !skipReason) {
        return 'A reason is required when a task is skipped.';
    }

    if (skipReason.length > 255) {
        return 'Skip reason cannot exceed 255 characters.';
    }

    let assignedTo = null;

    if (
        data.assigned_to !== undefined &&
        data.assigned_to !== null &&
        data.assigned_to !== ''
    ) {
        assignedTo = Number(data.assigned_to);

        if (!Number.isInteger(assignedTo) || assignedTo <= 0) {
            return 'Assigned user ID must be a positive whole number.';
        }
    }

    return null;
}

function prepareCareTask(data) {
    return {
        planting_id: Number(data.planting_id),
        task_type: data.task_type,
        due_date: data.due_date,
        status: data.status,
        source: data.source,
        skip_reason: String(data.skip_reason ?? '').trim() || null,
        assigned_to:
            data.assigned_to === undefined ||
            data.assigned_to === null ||
            data.assigned_to === ''
                ? null
                : Number(data.assigned_to)
    };
}

async function getAllCareTasks(req, res) {
    try {
        const results = await careTaskModel.getAllCareTasks();

        return res.status(200).json({
            success: true,
            data: results
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve care tasks.'
        });
    }
}

async function createCareTask(req, res) {
    const error = validateCareTask(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error
        });
    }

    try {
        const result = await careTaskModel.createCareTask(
            prepareCareTask(req.body)
        );

        return res.status(201).json({
            success: true,
            message: 'Care task created successfully.',
            task_id: result.insertId
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create care task.'
        });
    }
}

async function updateCareTask(req, res) {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid care task ID.'
        });
    }

    const error = validateCareTask(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error
        });
    }

    try {
        const result = await careTaskModel.updateCareTask(
            taskId,
            prepareCareTask(req.body)
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Care task not found or unchanged.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Care task updated successfully.'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update care task.'
        });
    }
}

async function deleteCareTask(req, res) {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid care task ID.'
        });
    }

    try {
        const result = await careTaskModel.deleteCareTask(taskId);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Care task not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Care task deleted successfully.'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete care task.'
        });
    }
}

module.exports = {
    getAllCareTasks,
    createCareTask,
    updateCareTask,
    deleteCareTask
};