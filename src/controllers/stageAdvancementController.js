const stageAdvancementModel = require('../models/stageAdvancementModel');

async function advance(req, res) {
    try {
        const results = await stageAdvancementModel.advanceStages();

        res.json({
            success: true,
            message: 'Stage advancement and harvest prediction completed.',
            data: results
        });
    } catch (error) {
        console.error('Stage advancement error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to advance growth stages.'
        });
    }
}

module.exports = { advance };