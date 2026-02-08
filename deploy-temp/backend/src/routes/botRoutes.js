const express = require('express');
const BotController = require('../controllers/botController');

const router = express.Router();

/**
 * @route POST /api/bot/validate
 * @desc Valida pedido de ajuda usando IA robusta
 * @access Public
 */
router.post('/validate', BotController.validateRequest);

/**
 * @route POST /api/bot/analyze
 * @desc Análise detalhada de um pedido
 * @access Public
 */
router.post('/analyze', BotController.analyzeRequest);

/**
 * @route GET /api/bot/test
 * @desc Testa o funcionamento do bot robusto
 * @access Public
 */
router.get('/test', BotController.testBot);

module.exports = router;