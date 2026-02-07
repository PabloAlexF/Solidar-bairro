const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Importar rotas
const cidadaoRoutes = require('./src/routes/cidadaoRoutes');
const comercioRoutes = require('./src/routes/comercioRoutes');
const ongRoutes = require('./src/routes/ongRoutes');
const familiaRoutes = require('./src/routes/familiaRoutes');
const achadosPerdidosRoutes = require('./src/routes/achadosPerdidosRoutes');
const authRoutes = require('./src/routes/authRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: ['https://solidarbrasil.com.br', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API rodando no Firebase Functions' });
});

// Rotas
app.use('/api/cidadaos', cidadaoRoutes);
app.use('/api/comercios', comercioRoutes);
app.use('/api/ongs', ongRoutes);
app.use('/api/familias', familiaRoutes);
app.use('/api/achados-perdidos', achadosPerdidosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Exportar como Firebase Function
exports.api = functions.https.onRequest(app);
