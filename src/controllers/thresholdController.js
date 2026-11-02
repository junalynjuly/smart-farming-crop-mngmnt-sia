const thresholdModel = require('../models/thresholdModel');

const allowedMetrics = [
    'soil_moisture',
    'temperature',
    'ph'
];

function validateThreshold(data) {
    const cropId = Number(data.crop_id);
    const minValue = Number(data.min_value);
    const maxValue = Number(data.max_value);

    if (
        data.crop_id === undefined ||
        data.crop_id === null ||
        data.crop_id === '' ||
        !Number.isInteger(cropId) ||
        cropId <= 0
    ) {
        return 'Crop ID must be a positive whole number.';
    }

    if (!allowedMetrics.includes(data.metric)) {
        return 'Please select a valid metric.';
    }

    if (
        data.min_value === undefined ||
        data.min_value === null ||
        data.min_value === '' ||
        !Number.isFinite(minValue) ||
        Math.abs(minValue) >= 10000
    ) {
        return 'Minimum value must be a valid number.';
    }

    if (
        data.max_value === undefined ||
        data.max_value === null ||
        data.max_value === '' ||
        !Number.isFinite(maxValue) ||
        Math.abs(maxValue) >= 10000
    ) {
        return 'Maximum value must be a valid number.';
    }

    if (minValue > maxValue) {
        return 'Minimum value cannot be greater than maximum value.';
    }

    return null;
}

async function getAllThresholds(req, res) {
    try {
        const results = await thresholdModel.getAllThresholds();

        res.status(200).json({
            success: true,
            data: results
        });
         } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve crop thresholds.',
            error: err.message
        });
    }
}

async function createThreshold(req, res) {
    const error = validateThreshold(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error
        });
    }

    try {
        const result = await thresholdModel.createThreshold({
            crop_id: Number(req.body.crop_id),
            metric: req.body.metric,
            min_value: Number(req.body.min_value),
            max_value: Number(req.body.max_value)
        });

        res.status(201).json({
            success: true,
            message: 'Crop threshold created successfully.',
            threshold_id: result.insertId
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to create crop threshold.',
            error: err.message
        });
    }
}

async function updateThreshold(req, res) {
    const thresholdId = Number(req.params.id);

    if (!Number.isInteger(thresholdId) || thresholdId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid threshold ID.'
        });
    }

    const error = validateThreshold(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error
        });
    }

    try {
        const result = await thresholdModel.updateThreshold(thresholdId, {
            crop_id: Number(req.body.crop_id),
            metric: req.body.metric,
            min_value: Number(req.body.min_value),
            max_value: Number(req.body.max_value)
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Crop threshold not found or unchanged.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Crop threshold updated successfully.'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update crop threshold.',
            error: err.message
        });
    }
}

async function deleteThreshold(req, res) {
    const thresholdId = Number(req.params.id);

    if (!Number.isInteger(thresholdId) || thresholdId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid threshold ID.'
        });
    }

    try {
        const result = await thresholdModel.deleteThreshold(thresholdId);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Crop threshold not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Crop threshold deleted successfully.'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete crop threshold.',
            error: err.message
        });
    }
}

module.exports = {
    getAllThresholds,
    createThreshold,
    updateThreshold,
    deleteThreshold
};