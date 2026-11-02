const express = require('express');
const router = express.Router();

const growthStageController = require('../controllers/growthStageController');

router.get('/', growthStageController.getAllGrowthStages);

router.post('/', growthStageController.createGrowthStage);

router.put('/:id', growthStageController.updateGrowthStage);

router.delete('/:id', growthStageController.deleteGrowthStage);

module.exports = router;