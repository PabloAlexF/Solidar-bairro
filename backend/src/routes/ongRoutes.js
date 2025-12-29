const express = require('express');
const ongController = require('../controllers/ongController');

const router = express.Router();

router.post('/', ongController.createONG);
router.get('/', ongController.getONGs);
router.get('/:uid', ongController.getONGById);

module.exports = router;