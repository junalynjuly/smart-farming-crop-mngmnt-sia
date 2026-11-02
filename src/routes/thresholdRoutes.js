
const express = require('express');
const router = express.Router();

const thresholdController = require('../controllers/thresholdController');

router.get('/', thresholdController.getAllThresholds);
router.post('/', thresholdController.createThreshold);
router.put('/:id', thresholdController.updateThreshold);
router.delete('/:id', thresholdController.deleteThreshold);

module.exports = router;