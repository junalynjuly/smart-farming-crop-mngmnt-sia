const express = require('express');
const router = express.Router();
const c = require('../controllers/plantingController');

router.get('/', c.list);
router.get('/options', c.options);
router.get('/:id', c.getOne);
router.post('/', c.create);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
