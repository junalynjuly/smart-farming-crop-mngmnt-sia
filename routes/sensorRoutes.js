const express = require('express');
const router = express.Router();
const c = require('../src/controllers/sensorController');

router.get('/api/sensor-readings', c.getAll);
router.post('/api/sensor-readings', c.create);

module.exports = router;
