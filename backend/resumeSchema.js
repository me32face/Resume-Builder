const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  gpa: String,
});

const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  duration: String,
});

const resumeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  skills: { type: String, required: true },
  education: [educationSchema],
  experience: [experienceSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // <- added here
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
