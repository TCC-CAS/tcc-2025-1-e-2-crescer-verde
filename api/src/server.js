require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const { authRoutes, courseRoutes, userRoutes, courseContentRoutes, courseProgressRoutes, certificateRoutes } = require('./routes/export');

const app = express();

const ALLOWED_ORIGINS = [
  'https://crescerverde.vercel.app',
  'http://localhost:5500',
  'http://localhost:3001',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3001',
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '50kb' }));
app.use(loggerMiddleware);

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
