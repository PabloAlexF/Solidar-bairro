const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/cidadaos', userController.createCidadao);

module.exports = router;