const CourseProgress = require('../models/CourseProgress');

module.exports = {
  async addContent(req, res) {
    try {
      const { userId, courseId, contentId } = req.body;
      const courseProgress = await CourseProgress.findOneAndUpdate(
        { userId, courseId },
        { $push: { completedContents: contentId } },
        { new: true, upsert: true }
      );
      return res.send({ courseProgress });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao adicionar conteúdo ao progresso do curso' });
    }
  },

  async removeContent(req, res) {
    try {
      const { userId, courseId, contentId } = req.body;
      const courseProgress = await CourseProgress.findOneAndUpdate(
        { userId, courseId },
        { $pull: { completedContents: contentId } },
        { new: true, upsert: true }
      );
      return res.send({ courseProgress });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao remover conteúdo do progresso do curso' });
    }
  },

  async update(req, res) {
    try {
      const { userId, courseId, isCourseCompleted } = req.body;
      const courseProgress = await CourseProgress.findOneAndUpdate(
        { userId, courseId },
        { isCourseCompleted },
        { new: true, upsert: true }
      );
      return res.send({ courseProgress });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao atualizar progresso do curso' });
    }
  },

  async get(req, res) {
    try {
      const { userId, courseId } = req.body;
      const courseProgress = await CourseProgress.findOne({ userId, courseId });
      return res.send({ courseProgress });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar progresso do curso' });
    }
  }
}