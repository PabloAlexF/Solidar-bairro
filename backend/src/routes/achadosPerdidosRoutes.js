const express = require('express');
const router = express.Router();
const achadosPerdidosController = require('../controllers/achadosPerdidosController');
const { authenticateToken } = require('../middleware/auth');

// Rotas públicas (não precisam de autenticação)
router.get('/', achadosPerdidosController.getAllItems);

// Rotas protegidas (precisam de autenticação) - ORDEM IMPORTANTE!
router.get('/user/my-items', authenticateToken, achadosPerdidosController.getUserItems);
router.post('/', authenticateToken, achadosPerdidosController.createItem);
router.put('/:id', authenticateToken, achadosPerdidosController.updateItem);
router.delete('/:id', authenticateToken, achadosPerdidosController.deleteItem);
router.patch('/:id/resolve', authenticateToken, achadosPerdidosController.markAsResolved);

// Rotas para dicas
router.get('/:itemId/tips', achadosPerdidosController.getTipsByItemId);
router.post('/:itemId/tips', authenticateToken, achadosPerdidosController.createTip);

// Rota com parâmetro deve vir por último
router.get('/:id', achadosPerdidosController.getItemById);

module.exports = router;