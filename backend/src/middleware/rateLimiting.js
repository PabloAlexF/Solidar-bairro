const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const logger = require('../services/loggerService');

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    success: false,
    error: 'Muitas requisições. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      endpoint: req.originalUrl,
      userAgent: req.get('User-Agent')
    });
    res.status(429).json({
      success: false,
      error: 'Muitas requisições. Tente novamente em alguns minutos.'
    });
  }
});

// Address API specific rate limiting
const addressLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.ADDRESS_RATE_LIMIT_MAX) || 500,
  message: {
    success: false,
    error: 'Muitas consultas de endereço. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Address API rate limit exceeded', {
      ip: req.ip,
      endpoint: req.originalUrl,
      params: req.params,
      query: req.query
    });
    res.status(429).json({
      success: false,
      error: 'Muitas consultas de endereço. Tente novamente em alguns minutos.'
    });
  }
});

// Slow down middleware for address APIs
const addressSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 20,
  delayMs: () => 500,
  maxDelayMs: 5000,
  validate: { delayMs: false }
});

// CEP specific rate limiting
const cepLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Muitas consultas de CEP. Tente novamente em alguns minutos.'
  },
  handler: (req, res) => {
    logger.warn('CEP API rate limit exceeded', {
      ip: req.ip,
      cep: req.params.cep
    });
    res.status(429).json({
      success: false,
      error: 'Muitas consultas de CEP. Tente novamente em alguns minutos.'
    });
  }
});

module.exports = {
  generalLimiter,
  addressLimiter,
  addressSlowDown,
  cepLimiter
};