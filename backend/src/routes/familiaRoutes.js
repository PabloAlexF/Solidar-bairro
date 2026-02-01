const express = require('express');
const familiaController = require('../controllers/familiaController');

const router = express.Router();

router.post('/', familiaController.createFamilia);
router.get('/', familiaController.getFamilias);
router.get('/bairro/:bairro', familiaController.getFamiliasByBairro);
router.get('/stats/:bairro', familiaController.getStatsByBairro);
router.get('/:id', familiaController.getFamiliaById);
router.put('/:id', familiaController.updateFamilia);
router.patch('/:id/analyze', familiaController.markAsAnalyzed);
router.delete('/:id', familiaController.deleteFamilia);

module.exports = router;