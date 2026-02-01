const express = require('express');
const ongController = require('../controllers/ongController');

const router = express.Router();

router.post('/', ongController.createONG);
router.get('/', ongController.getONGs);
router.get('/:uid', ongController.getONGById);
router.put('/:uid', ongController.updateONG);
router.patch('/:uid/analyze', ongController.markAsAnalyzed);

module.exports = router;