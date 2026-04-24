const Course = require('../models/Course');

module.exports = {
  async create(req, res) {
    try {
      const existente = await Course.findOne({ title: req.body.title });
      if (existente) {
        return res.status(400).send({ error: 'Já existe um curso com esse título' });
      }

      const course = await Course.create(req.body);
      return res.status(201).send({ course });
    } catch (err) {
      return res.status(400).send({ error: 'Falha ao criar curso' });
    }
  },

  async list(req, res) {
    try {
      const courses = await Course.find();
      return res.send({ courses });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao listar cursos' });
    }
  },

  async get(req, res) {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).send({ error: 'Curso não encontrado' });
      }

      return res.send({ course });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar curso' });
    }
  },

  async search(req, res) {
    try {
      const { term } = req.query;

      if (!term) {
        return res.status(400).send({ error: 'Nenhum termo de busca fornecido' });
      }
      const courses = await Course.find({
        title: { $regex: term, $options: 'i' }
      });

      return res.send({ courses });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar cursos' });
    }
  },

  async update(req, res) {
    try {
      const course = await Course.findByIdAndUpdate(req.params
        .id, req.body, { new: true });
      return res.send({ course });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao atualizar curso' });
    }
  },

  async delete(req, res) {
    try {
      await Course.findByIdAndDelete(req.params.id);
      return res.send({ message: 'Curso removido com sucesso' });
    }
    catch (err) {
      return res.status(400).send({ error: 'Erro ao deletar curso' });
    }
  }
};