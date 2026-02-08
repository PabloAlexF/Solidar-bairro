const express = require('express');
const comercioController = require('../controllers/comercioController');

const router = express.Router();

router.post('/', comercioController.createComercio);
router.get('/', comercioController.getComercios);
router.get('/:uid', comercioController.getComercioById);
router.put('/:uid', comercioController.updateComercio);

module.exports = router;