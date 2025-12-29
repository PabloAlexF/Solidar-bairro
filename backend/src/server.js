const express = require('express');
const cors = require('cors');
const familiaRoutes = require('./routes/familiaRoutes');
const cidadaoRoutes = require('./routes/cidadaoRoutes');
const comercioRoutes = require('./routes/comercioRoutes');
const ongRoutes = require('./routes/ongRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware essencial apenas
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/familias', familiaRoutes);
app.use('/api/cidadaos', cidadaoRoutes);
app.use('/api/comercios', comercioRoutes);
app.use('/api/ongs', ongRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor: http://localhost:${PORT}`);
});

module.exports = app;