const currentStageModel = require('../models/currentStageModel');

async function list(req, res) {
    try {
        const data = await currentStageModel.getCurrentStages();

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error fetching current stages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch current stages.'
        });
    }
}

module.exports = { list };