const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/users/:uid', userController.getUser);
router.post('/users', userController.createUser);
router.put('/users/:uid', userController.updateUser);
router.delete('/users/:uid', userController.deleteUser);

module.exports = router;