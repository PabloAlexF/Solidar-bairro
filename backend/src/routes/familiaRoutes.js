const express = require('express');
const familiaController = require('../controllers/familiaController');

const router = express.Router();

router.post('/', familiaController.createFamilia);
router.get('/', familiaController.getFamilias);
router.get('/:id', familiaController.getFamiliaById);

module.exports = router;