const express = require('express');
const addressController = require('../controllers/addressController');
const { addressLimiter, addressSlowDown, cepLimiter } = require('../middleware/rateLimiting');

const router = express.Router();

// Apply rate limiting to all address routes
router.use(addressLimiter);
router.use(addressSlowDown);

// Buscar endereço por CEP (with additional CEP-specific limiting)
router.get('/cep/:cep', cepLimiter, addressController.searchByCep);

// Buscar endereços por logradouro
router.get('/search', addressController.searchByAddress);

// Buscar bairros por cidade
router.get('/neighborhoods', addressController.getNeighborhoods);

module.exports = router;