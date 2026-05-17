const mongoose = require('mongoose');

const courseContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'text', 'game'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CourseContent', courseContentSchema);