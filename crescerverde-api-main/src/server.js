require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const { authRoutes, courseRoutes, userRoutes, courseContentRoutes, courseProgressRoutes, certificateRoutes } = require('./routes/export');

const app = express();

// CORS manual — mais confiável que o pacote cors() no Express 5 + Vercel
// Roda antes de TUDO: banco, auth, rotas
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(loggerMiddleware);

// MongoDB — serverless-friendly
let mongooseConnected = false;
async function connectDB() {
  if (mongooseConnected) return;
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  mongooseConnected = true;
  console.log('Conectado ao MongoDB');
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Erro ao conectar com MongoDB:', err);
    res.status(500).json({ error: 'Falha na conexão com o banco de dados' });
  }
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courseContents', courseContentRoutes);
app.use('/api/courseProgress', courseProgressRoutes);
app.use('/api/certificates', certificateRoutes);

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
}

module.exports = app;
