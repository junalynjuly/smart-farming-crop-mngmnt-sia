const express = require('express');
const router = express.Router();
const c = require('../controllers/harvestController');

router.get('/', c.list);
router.get('/:id', c.getOne);
router.post('/', c.create);

module.exports = router;
