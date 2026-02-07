const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const familiaRoutes = require('../src/routes/familiaRoutes');
const cidadaoRoutes = require('../src/routes/cidadaoRoutes');
const comercioRoutes = require('../src/routes/comercioRoutes');
const ongRoutes = require('../src/routes/ongRoutes');
const authRoutes = require('../src/routes/authRoutes');
const pedidoRoutes = require('../src/routes/pedidoRoutes');
const interesseRoutes = require('../src/routes/interesseRoutes');
const chatRoutes = require('../src/routes/chatRoutes');
const userRoutes = require('../src/routes/userRoutes');
const achadosPerdidosRoutes = require('../src/routes/achadosPerdidosRoutes');
const notificationRoutes = require('../src/routes/notificationRoutes');
const adminRoutes = require('../src/routes/adminRoutes');
const statsRoutes = require('../src/routes/statsRoutes');
const painelSocialRoutes = require('../src/routes/painelSocialRoutes');
const botRoutes = require('../src/routes/botRoutes');
const addressRoutes = require('../src/routes/addressRoutes');

const app = express();

const corsOptions = {
  origin: ['https://solidarbrasil.com.br', 'http://localhost:3000'],
  credentials: true
};

const limiter = rateLimit({
  windowMs: 60000,
  max: 200
});

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/familias', familiaRoutes);
app.use('/api/cidadaos', cidadaoRoutes);
app.use('/api/comercios', comercioRoutes);
app.use('/api/ongs', ongRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/interesses', interesseRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/achados-perdidos', achadosPerdidosRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/painel-social', painelSocialRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/address', addressRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

exports.api = functions.https.onRequest(app);
