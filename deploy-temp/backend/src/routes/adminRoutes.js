const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/adminAuth');

// Aplicar middleware de admin em todas as rotas
router.use(authenticateAdmin);

// Dashboard stats
router.get('/stats', adminController.getDashboardStats);

// Todas as entidades
router.get('/entities/:entityType', adminController.getAllEntities);

module.exports = router;