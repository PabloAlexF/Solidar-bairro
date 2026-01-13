const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { authenticateToken } = require('../middleware/auth');

// GET /api/pedidos - Listar todos os pedidos (público para "Quero Ajudar")
router.get('/', pedidoController.getAll);

// Rotas que requerem autenticação
// POST /api/pedidos - Criar novo pedido
router.post('/', authenticateToken, pedidoController.create);

// GET /api/pedidos/meus - Listar pedidos do usuário logado
router.get('/meus', authenticateToken, pedidoController.getByUserId);

// PUT /api/pedidos/:id - Atualizar pedido
router.put('/:id', authenticateToken, pedidoController.update);

// DELETE /api/pedidos/:id - Deletar pedido
router.delete('/:id', authenticateToken, pedidoController.delete);

// POST /api/pedidos/:id/finalizar - Finalizar ajuda
router.post('/:id/finalizar', authenticateToken, pedidoController.finalizarAjuda);

// GET /api/pedidos/:id - Buscar pedido por ID (público)
router.get('/:id', pedidoController.getById);

module.exports = router;