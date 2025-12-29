const express = require('express');
const cidadaoController = require('../controllers/cidadaoController');

const router = express.Router();

router.post('/', cidadaoController.createCidadao);
router.get('/', cidadaoController.getCidadaos);
router.get('/:uid', cidadaoController.getCidadaoById);

module.exports = router;