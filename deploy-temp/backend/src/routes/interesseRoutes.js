const express = require('express');
const router = express.Router();
const interesseController = require('../controllers/interesseController');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas de interesses requerem autenticação
router.use(authenticateToken);

// POST /api/interesses - Registrar interesse em ajudar
router.post('/', interesseController.create);

// GET /api/interesses/:id - Buscar interesse específico
router.get('/:id', interesseController.getById);

// GET /api/interesses/pedido/:pedidoId - Listar interesses de um pedido
router.get('/pedido/:pedidoId', interesseController.getByPedido);

// GET /api/interesses/meus - Listar interesses do usuário logado
router.get('/meus', interesseController.getByUser);

// PUT /api/interesses/:id - Atualizar interesse
router.put('/:id', interesseController.update);

module.exports = router;