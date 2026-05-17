const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title:            { type: String, required: true },
  description:      { type: String, required: true },
  coverImage:       { type: String },
  videoUrl:         { type: String },
  difficulty:       { type: String, enum: ['iniciante', 'intermediario', 'avancado'], default: 'iniciante' },
  minPlan:          { type: String, enum: ['free', 'basic', 'premium', 'institutional'], default: 'free' },
  category:         { type: String, default: '' },
  emoji:            { type: String, default: '🌿' },
  estimatedMinutes: { type: Number, default: 15 },
  order:            { type: Number, default: 0 },
  tags:             [{ type: String }],
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;