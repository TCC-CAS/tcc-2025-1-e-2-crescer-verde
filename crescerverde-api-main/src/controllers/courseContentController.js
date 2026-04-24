const CourseContent = require('../models/CourseContent');

module.exports = {
  async create(req, res) {
    try {
      const { title, type, content, order, courseId } = req.body;
      const courseContent = await CourseContent.create({ title, type, content, order, courseId });
      return res.send({ courseContent });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao criar conteúdo do curso' });
    }
  },

  async update(req, res) {
    try {
      const { title, type, content, order, courseId } = req.body;
      const courseContent = await CourseContent.findOneAndUpdate(
        { _id: req.params.id },
        { title, type, content, order, courseId },
        { new: true }
      );
      return res.send({ courseContent });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao atualizar conteúdo do curso' });
    }
  },

  async delete(req, res) {
    try {
      await CourseContent.findOneAndDelete({ _id: req.params.id });
      return res.send({ success: true });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao deletar conteúdo do curso' });
    }
  },

  async get(req, res) {
    try {
      const courseContent = await CourseContent.findById(req.params.id);
      return res.send({ courseContent });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar conteúdo do curso' });
    }
  },

  async listByCourseId(req, res) {
    try {
      const courseContents = await CourseContent.find({ courseId: req.params.courseId });
      return res.send({ courseContents });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar conteúdo do curso' });
    }
  }
}