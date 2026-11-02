
const express = require('express');
const router = express.Router();
const stageAdvancementController = require('../controllers/stageAdvancementController');

router.post('/run', stageAdvancementController.advance);

module.exports = router;
