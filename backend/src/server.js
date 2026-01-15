const express = require('express');
const cors = require('cors');
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
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

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

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/familias', familiaRoutes);
app.use('/api/cidadaos', cidadaoRoutes);
app.use('/api/comercios', comercioRoutes);
app.use('/api/ongs', ongRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/interesses', interesseRoutes);
app.use('/api/chat', chatLimiter, chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/achados-perdidos', achadosPerdidosRoutes);
app.use('/api/notifications', notificationRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor: http://localhost:${PORT}`);
});

module.exports = app;