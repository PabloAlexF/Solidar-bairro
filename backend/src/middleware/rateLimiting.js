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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.ADDRESS_RATE_LIMIT_MAX) || 500, // Use env var
  message: {
    success: false,
    error: 'Muitas consultas de endereço. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip + ':address';
  },
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
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 20, // Allow 20 requests per windowMs without delay
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 5000, // Maximum delay of 5 seconds
  keyGenerator: (req) => {
    return req.ip + ':address:slowdown';
  },
  onLimitReached: (req, res, options) => {
    logger.warn('Address API slow down activated', {
      ip: req.ip,
      endpoint: req.originalUrl,
      delay: options.delay
    });
  }
});

// CEP specific rate limiting (more restrictive)
const cepLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Increased from 30 to 100
  message: {
    success: false,
    error: 'Muitas consultas de CEP. Tente novamente em alguns minutos.'
  },
  keyGenerator: (req) => {
    return req.ip + ':cep';
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