const Certificate = require('../models/Certificate');
const CourseProgress = require('../models/CourseProgress');

const create = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (await Certificate.findOne({ user: userId, course: courseId })) {
      return res.status(400).json({ message: 'Certificado já emitido' });
    }

    const courseProgress = await CourseProgress.findOne({ userId, courseId });

    if (!courseProgress.isCourseCompleted) {
      return res.status(400).json({ message: 'Curso não concluído' });
    }

    const certificate = new Certificate({ user: userId, course: courseId });
    await certificate.save();
    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const certificates = await Certificate.find({ user: userId }).lean();

    const response = certificates.map(c => {
      return {
        _id: c._id,
        courseId: c.course,
        userId: c.user,
        date: c.date
      };
    });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const get = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ _id: certificateId })
      .populate('user', 'name')
      .populate('course', 'title');
    res.status(200).json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { create, getByUserId, get };