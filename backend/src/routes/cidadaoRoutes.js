const express = require('express');
const cidadaoController = require('../controllers/cidadaoController');

const router = express.Router();

router.post('/', cidadaoController.createCidadao);
router.get('/', cidadaoController.getCidadaos);
router.get('/:uid', cidadaoController.getCidadaoById);
router.get('/:uid/ajudas-concluidas', cidadaoController.getAjudasConcluidas);
router.put('/:uid', cidadaoController.updateCidadao);
router.patch('/:uid', cidadaoController.updateCidadao);
router.patch('/:uid/analyze', cidadaoController.markAsAnalyzed);

module.exports = router;