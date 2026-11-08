const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.renderUserList);
router.post('/create', userController.createUser);
router.post('/update/:id', userController.updateUser);
router.post('/delete/:id', userController.deleteUser);

module.exports = router;