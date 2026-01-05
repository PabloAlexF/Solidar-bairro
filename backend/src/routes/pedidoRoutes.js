const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas de pedidos requerem autenticação
router.use(authenticateToken);

// POST /api/pedidos - Criar novo pedido
router.post('/', pedidoController.create);

// GET /api/pedidos - Listar todos os pedidos
router.get('/', pedidoController.getAll);

// GET /api/pedidos/meus - Listar pedidos do usuário logado
router.get('/meus', pedidoController.getByUserId);

// GET /api/pedidos/:id - Buscar pedido por ID
router.get('/:id', pedidoController.getById);

// PUT /api/pedidos/:id - Atualizar pedido
router.put('/:id', pedidoController.update);

// DELETE /api/pedidos/:id - Deletar pedido
router.delete('/:id', pedidoController.delete);

module.exports = router;