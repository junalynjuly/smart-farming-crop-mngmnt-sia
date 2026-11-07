const growthStageModel = require('../models/growthStageModel');

async function getAllGrowthStages(req, res) {
    try {
        const results = await growthStageModel.getAllGrowthStages();
        res.status(200).json({
            success: true,
            data: results
        });} catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(200).json({ success: true, data: [] });
    }
    res.status(500).json({
        success: false,
        message: 'Failed to retrieve growth stages.',
        error: err.message
    });
}
}

async function createGrowthStage(req, res) {
    const { crop_id, stage_name, stage_order, start_day, end_day } = req.body;

    if (
        !crop_id || !stage_name || !stage_order ||
        start_day === undefined || end_day === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: 'All growth stage fields are required.'
        });
    }

    if (
        !Number.isInteger(Number(crop_id)) ||
        !Number.isInteger(Number(stage_order)) ||
        !Number.isInteger(Number(start_day)) ||
        !Number.isInteger(Number(end_day)) ||
        Number(crop_id) <= 0 ||
        Number(stage_order) <= 0 ||
        Number(start_day) < 0 ||
        Number(end_day) < 0
    ) {
        return res.status(400).json({
            success: false,
            message: 'Growth stage values must be valid numbers.'
        });
    }

    if (Number(start_day) > Number(end_day)) {
        return res.status(400).json({
            success: false,
            message: 'Start day cannot be greater than end day.'
        });
    }


    try {
        const result = await growthStageModel.createGrowthStage({
            crop_id, stage_name, stage_order, start_day, end_day
        });

        res.status(201).json({
            success: true,
            message: 'Growth stage created successfully.',
            stage_id: result.insertId
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to create growth stage.',
            error: err.message
        });
    }
}

async function updateGrowthStage(req, res) {
    const stageId = req.params.id;
    const { crop_id, stage_name, stage_order, start_day, end_day } = req.body;

    if (
        !crop_id || !stage_name || !stage_order ||
        start_day === undefined || end_day === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: 'All growth stage fields are required.'
        });
    }

    if (
        !Number.isInteger(Number(crop_id)) ||
        !Number.isInteger(Number(stage_order)) ||
        !Number.isInteger(Number(start_day)) ||
        !Number.isInteger(Number(end_day)) ||
        Number(crop_id) <= 0 ||
        Number(stage_order) <= 0 ||
        Number(start_day) < 0 ||
        Number(end_day) < 0
    ) {
        return res.status(400).json({
            success: false,
            message: 'Growth stage values must be valid numbers.'
        });
    }

    if (Number(start_day) > Number(end_day)) {
        return res.status(400).json({
            success: false,
            message: 'Start day cannot be greater than end day.'
        });
    }

    try {
        const result = await growthStageModel.updateGrowthStage(stageId, {
            crop_id, stage_name, stage_order, start_day, end_day
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Growth stage not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Growth stage updated successfully.'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update growth stage.',
            error: err.message
        });
    }
}

async function deleteGrowthStage(req, res) {
    const stageId = req.params.id;

    if (!Number.isInteger(Number(stageId)) || Number(stageId) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid growth stage ID.'
        });
    }

    try {
        const result = await growthStageModel.deleteGrowthStage(stageId);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Growth stage not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Growth stage deleted successfully.'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete growth stage.',
            error: err.message
        });
    }
}

module.exports = {
    getAllGrowthStages,
    createGrowthStage,
    updateGrowthStage,
    deleteGrowthStage
};