
const express = require('express');
const router = express.Router();
const currentStageController = require('../controllers/currentStageController');

router.get('/', currentStageController.list);

module.exports = router;
