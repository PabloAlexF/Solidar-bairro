const winston = require('winston');
const path = require('path');

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'solidar-backend' },
  transports: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/combined.log') 
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/address-api.log'),
      level: 'info'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Address API specific logging
logger.logAddressRequest = (method, endpoint, params, responseTime, success) => {
  logger.info('Address API Request', {
    method,
    endpoint,
    params,
    responseTime,
    success,
    timestamp: new Date().toISOString()
  });
};

logger.logViaCepUsage = (endpoint, responseTime, success, cached = false) => {
  logger.info('ViaCEP API Usage', {
    endpoint,
    responseTime,
    success,
    cached,
    timestamp: new Date().toISOString()
  });
};

module.exports = logger;