require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const { authRoutes, courseRoutes, userRoutes, courseContentRoutes, courseProgressRoutes, certificateRoutes } = require('./routes/export');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json());

// request logger must run early so all incoming traffic is logged
app.use(loggerMiddleware);

// Mongoose connection with serverless-friendly pooling
let mongooseConnected = false;
async function connectDB() {
  if (mongooseConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  mongooseConnected = true;
  console.log('Conectado ao MongoDB');
}

// Garante conexão com o banco antes de qualquer rota
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Erro ao conectar com MongoDB:', err);
    res.status(500).json({ error: 'Falha na conexão com o banco de dados' });
  }
});

// rotas
app.use('/api/auth', authRoutes);

// rotas protegidas
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courseContents', courseContentRoutes);
app.use('/api/courseProgress', courseProgressRoutes);
app.use('/api/certificates', certificateRoutes);

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

module.exports = app;
