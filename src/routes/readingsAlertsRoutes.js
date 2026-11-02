const express = require('express');
const router = express.Router();
const c = require('../controllers/readingsAlertsController');

router.get('/api/reports/readings-alerts', c.getReport);

module.exports = router;
