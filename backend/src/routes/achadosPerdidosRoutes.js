const express = require('express');
const router = express.Router();
const achadosPerdidosController = require('../controllers/achadosPerdidosController');
const { authenticateToken } = require('../middleware/auth');

// Rotas públicas (não precisam de autenticação)
router.get('/', achadosPerdidosController.getAllItems);
router.get('/:id', achadosPerdidosController.getItemById);

// Rotas protegidas (precisam de autenticação)
router.post('/', authenticateToken, achadosPerdidosController.createItem);
router.put('/:id', authenticateToken, achadosPerdidosController.updateItem);
router.delete('/:id', authenticateToken, achadosPerdidosController.deleteItem);
router.get('/user/my-items', authenticateToken, achadosPerdidosController.getUserItems);
router.patch('/:id/resolve', authenticateToken, achadosPerdidosController.markAsResolved);

module.exports = router;