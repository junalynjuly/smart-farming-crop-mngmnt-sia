const express = require('express');
const router = express.Router();
const c = require('../src/controllers/alertController');

router.get('/api/alerts', c.getAll);
router.get('/api/alerts/:id', c.getOne);
router.post('/api/alerts', c.create);
router.put('/api/alerts/:id', c.update);
router.delete('/api/alerts/:id', c.remove);

module.exports = router;
