const express = require('express');
const cors = require('cors');
const familiaRoutes = require('./routes/familiaRoutes');
const cidadaoRoutes = require('./routes/cidadaoRoutes');
const comercioRoutes = require('./routes/comercioRoutes');
const ongRoutes = require('./routes/ongRoutes');
const authRoutes = require('./routes/authRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const interesseRoutes = require('./routes/interesseRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
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

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Middleware de segurança
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/familias', familiaRoutes);
app.use('/api/cidadaos', cidadaoRoutes);
app.use('/api/comercios', comercioRoutes);
app.use('/api/ongs', ongRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/interesses', interesseRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor: http://localhost:${PORT}`);
});

module.exports = app;