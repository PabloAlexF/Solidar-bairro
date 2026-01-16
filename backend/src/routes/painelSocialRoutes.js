const express = require('express');
const painelSocialController = require('../controllers/painelSocialController');

const router = express.Router();

router.get('/dashboard/:bairro', painelSocialController.getDashboardData);
router.get('/pedidos', painelSocialController.getPedidosAjuda);
router.get('/comercios', painelSocialController.getComerciosParceiros);
router.get('/ongs', painelSocialController.getOngsAtuantes);

module.exports = router;
