const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const register = async (req, res) => {
  try {
    var user = req.body;
    if (await User.findOne({ email: user.email })) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    user.role = 'user';
    await User.create(user);
    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (err) { res.status(400).json({ error: err.message }); }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Resposta genérica por segurança
      return res.json({ message: "Se este e-mail estiver cadastrado, você receberá as instruções." });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires
    });

    // Em produção, este link seria enviado por e-mail.
    // Em modo demo, retornamos o link diretamente na resposta.
    const resetLink = `/HTML/reset-password.html?token=${token}&email=${encodeURIComponent(email)}`;

    res.json({
      message: "Link de redefinição gerado com sucesso.",
      resetLink, // apenas para demo — remover em produção
      demo: true
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: "Dados incompletos." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "A senha deve ter pelo menos 6 caracteres." });
    }

    const user = await User.findOne({ email })
      .select('+resetPasswordToken +resetPasswordExpires +password');

    if (!user) {
      return res.status(400).json({ message: "Token inválido ou expirado." });
    }

    if (user.resetPasswordToken !== token) {
      return res.status(400).json({ message: "Token inválido ou expirado." });
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: "Token expirado. Solicite um novo link." });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Senha redefinida com sucesso! Você já pode fazer login." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
