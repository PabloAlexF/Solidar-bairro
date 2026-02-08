const express = require('express');
const statsController = require('../controllers/statsController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/neighborhood', authenticateToken, statsController.getNeighborhoodStats);

module.exports = router;