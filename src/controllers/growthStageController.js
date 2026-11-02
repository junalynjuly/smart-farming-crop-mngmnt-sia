const growthStageModel = require('../models/growthStageModel');

function getAllGrowthStages(req, res) {
    growthStageModel.getAllGrowthStages((err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve growth stages.',
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            data: results
        });
    });
}

function createGrowthStage(req, res) {
    const {
        crop_id,
        stage_name,
        stage_order,
        start_day,
        end_day
    } = req.body;

    if (
        !crop_id ||
        !stage_name ||
        !stage_order ||
        start_day === undefined ||
        end_day === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: 'All growth stage fields are required.'
        });
    }

    if (Number(start_day) > Number(end_day)) {
        return res.status(400).json({
            success: false,
            message: 'Start day cannot be greater than end day.'
        });
    }

    const data = {
        crop_id,
        stage_name,
        stage_order,
        start_day,
        end_day
    };

    growthStageModel.createGrowthStage(data, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create growth stage.',
                error: err.message
            });
        }

        res.status(201).json({
            success: true,
            message: 'Growth stage created successfully.',
            stage_id: result.insertId
        });
    });
}

function updateGrowthStage(req, res) {
    const stageId = req.params.id;

    const {
        crop_id,
        stage_name,
        stage_order,
        start_day,
        end_day
    } = req.body;

    if (
        !crop_id ||
        !stage_name ||
        !stage_order ||
        start_day === undefined ||
        end_day === undefined
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

    const data = {
        crop_id,
        stage_name,
        stage_order,
        start_day,
        end_day
    };

    growthStageModel.updateGrowthStage(stageId, data, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update growth stage.',
                error: err.message
            });
        }

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
    });
}

function deleteGrowthStage(req, res) {
    const stageId = req.params.id;

    growthStageModel.deleteGrowthStage(stageId, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete growth stage.',
                error: err.message
            });
        }

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
    });
}

module.exports = {
    getAllGrowthStages,
    createGrowthStage,
    updateGrowthStage,
    deleteGrowthStage
};