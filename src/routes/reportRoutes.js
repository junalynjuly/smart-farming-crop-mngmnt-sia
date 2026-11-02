const express = require('express');
const router = express.Router();
const c = require('../controllers/plantingReportController');

router.get('/plantings-harvests', c.plantingsWithHarvests);

module.exports = router;
