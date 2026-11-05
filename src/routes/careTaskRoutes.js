
const express = require('express');
const router = express.Router();

const careTaskController = require('../controllers/careTaskController');

router.get('/', careTaskController.getAllCareTasks);
router.post('/', careTaskController.createCareTask);
router.put('/:id', careTaskController.updateCareTask);
router.delete('/:id', careTaskController.deleteCareTask);

module.exports = router;