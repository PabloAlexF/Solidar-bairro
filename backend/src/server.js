const express = require('express');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const familiaRoutes = require('./routes/familiaRoutes');
const cidadaoRoutes = require('./routes/cidadaoRoutes');
const comercioRoutes = require('./routes/comercioRoutes');
const ongRoutes = require('./routes/ongRoutes');
const authRoutes = require('./routes/authRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const interesseRoutes = require('./routes/interesseRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const achadosPerdidosRoutes = require('./routes/achadosPerdidosRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const statsRoutes = require('./routes/statsRoutes');
const painelSocialRoutes = require('./routes/painelSocialRoutes');
const botRoutes = require('./routes/botRoutes');
const addressRoutes = require('./routes/addressRoutes');
const cacheService = require('./services/cacheService');
const socketService = require('./services/socketService');
const logger = require('./services/loggerService');
const { generalLimiter } = require('./middleware/rateLimiting');
require('dotenv').config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Initialize WebSocket server
socketService.init(httpServer);

// Initialize cache service
async function initializeServices() {
  try {
    await cacheService.connect();
    logger.info('Services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize services:', error);
  }
}

// CORS configurado para desenvolvimento
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 200, // 200 requisições por minuto
  message: JSON.stringify({ error: 'Muitas requisições, tente novamente mais tarde', code: 'RATE_LIMIT' }),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: 'Muitas requisições, tente novamente mais tarde', code: 'RATE_LIMIT' });
  }
});

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // 100 requisições por minuto para chat
  message: 'Muitas requisições de chat, tente novamente mais tarde'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 tentativas de login
  message: 'Muitas tentativas de login, tente novamente mais tarde'
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://viacep.com.br/*", "https://nominatim.openstreetmap.org", "https://api.openstreetmap.org"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn-uicons.flaticon.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://cdn-uicons.flaticon.com"],
    },
  },
}));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use('/api/', limiter);

// Routes
console.log('🔧 Registrando todas as rotas da API...');
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/familias', familiaRoutes);
app.use('/api/cidadaos', cidadaoRoutes);
app.use('/api/comercios', comercioRoutes);
app.use('/api/ongs', ongRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/interesses', interesseRoutes);
app.use('/api/chat', chatLimiter, chatRoutes);
console.log('✅ Rotas de chat registradas em /api/chat');
app.use('/api/users', userRoutes);
app.use('/api/achados-perdidos', achadosPerdidosRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/painel-social', painelSocialRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/address', addressRoutes);
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    cache: cacheService.isConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Debug route to list all registered routes
app.get('/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json({ routes });
});

// Catch-all for debugging 404s
app.use('*', (req, res) => {
  console.log(`❌ 404 - Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Rota não encontrada', 
    method: req.method, 
    path: req.originalUrl,
    availableRoutes: [
      'GET /health',
      'GET /debug/routes',
      'POST /api/auth/login',
      'GET /api/chat/conversations',
      'PUT /api/chat/conversations/:id/close'
    ]
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await cacheService.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await cacheService.disconnect();
  process.exit(0);
});

httpServer.listen(PORT, async () => {
  console.log(`🚀 Servidor: http://localhost:${PORT}`);
  await initializeServices();
});

module.exports = app;