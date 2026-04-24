const User = require('../models/user');

module.exports = {
  async create(req, res) {
    try {
      const { email } = req.body;

      if (await User.findOne({ email })) {
        return res.status(400).send({ error: 'Usuário já existe' });
      }

      const user = await User.create(req.body);

      user.password = undefined;

      return res.status(201).send({ user });
    } catch (err) {
      return res.status(400).send({ error: 'Falha no registro' });
    }
  },

  async list(req, res) {
    try {
      const users = await User.find();
      return res.send({ users });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao listar usuários' });
    }
  },

  async get(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send({ error: 'Usuário não encontrado' });
      }
      return res.send({ user });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar usuário' });
    }
  },

  async update(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.send({ user });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao atualizar usuário' });
    }
  },

  async delete(req, res) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.send({ message: 'Usuário removido com sucesso' });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao deletar usuário' });
    }
  }
};
