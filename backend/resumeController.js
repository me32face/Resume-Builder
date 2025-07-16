const Resume = require("./resumeSchema");
const PDFDocument = require("pdfkit");

// Add Resume
const addResume = (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ msg: "Unauthorized. User ID missing." });
  }

  let resume = new Resume({
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    skills: req.body.skills,
    education: req.body.education,
    experience: req.body.experience,
    createdBy: req.userId // Link resume to logged-in user
  });

  resume.save()
    .then((result) => {
      res.json({
        msg: "Resume Saved Successfully",
        status: 200,
        data: result
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        msg: "Failed to save resume",
        error: err
      });
    });
};

// View All Resumes of logged-in user
const viewResumesByUser = (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ msg: "Unauthorized. User ID missing." });
  }

  Resume.find({ createdBy: req.userId })
    .then((result) => {
      res.json({
        msg: "Resumes Found",
        status: 200,
        data: result
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "Failed to fetch resumes",
        error: err
      });
    });
};

// Get Resume By ID (only if owned by user)
const getResumeById = (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ msg: "Unauthorized. User ID missing." });
  }

  const id = req.params.id;
  Resume.findOne({ _id: id, createdBy: req.userId })
    .then(result => {
      if (!result) {
        return res.status(404).json({ msg: 'Resume not found or not authorized' });
      }
      res.json({ msg: 'Resume found', status: 200, data: result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: 'Error fetching resume', error: err });
    });
};

// Update Resume (only if owned by user)
const updateResume = (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ msg: "Unauthorized. User ID missing." });
  }

  const id = req.params.id;
  const updateData = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    skills: req.body.skills,
    education: req.body.education,
    experience: req.body.experience,
  };

  Resume.findOneAndUpdate(
    { _id: id, createdBy: req.userId },
    updateData,
    { new: true }
  )
    .then(result => {
      if (!result) {
        return res.status(404).json({ msg: 'Resume not found or not authorized' });
      }
      res.json({ msg: 'Resume updated successfully', status: 200, data: result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: 'Error updating resume', error: err });
    });
};

// Delete Resume (only if owned by user)
const deleteResume = (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ msg: "Unauthorized. User ID missing." });
  }

  const id = req.params.id;
  Resume.findOneAndDelete({ _id: id, createdBy: req.userId })
    .then(result => {
      if (!result) {
        return res.status(404).json({ msg: 'Resume not found or not authorized' });
      }
      res.json({ msg: 'Resume deleted successfully', status: 200, data: result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: 'Error deleting resume', error: err });
    });
};

// Generate PDF (only if owned by user)
const generatePDF = (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ msg: "Unauthorized. User ID missing." });
  }

  const id = req.params.id;
  Resume.findOne({ _id: id, createdBy: req.userId })
    .then(result => {
      if (!result) {
        return res.status(404).json({ msg: 'Resume not found or not authorized' });
      }

      const doc = new PDFDocument({ margin: 50 });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${result.fullName}_Resume.pdf"`);

      doc.pipe(res);

      // Title
      doc.fontSize(24).text(result.fullName, { align: 'center', underline: true });
      doc.moveDown();

      // Contact
      doc.fontSize(12).text(`Email: ${result.email}`);
      doc.text(`Phone: ${result.phone}`);
      doc.text(`Address: ${result.address}`);
      doc.moveDown();

      // Skills
      doc.fontSize(14).text('Skills', { underline: true });
      doc.fontSize(12).text(result.skills);
      doc.moveDown();

      // Education
      doc.fontSize(14).text('Education', { underline: true });
      if (Array.isArray(result.education)) {
        result.education.forEach(edu => {
          doc.fontSize(12).text(`${edu.degree} at ${edu.institution} (GPA: ${edu.gpa})`);
        });
      }
      doc.moveDown();

      // Experience
      doc.fontSize(14).text('Experience', { underline: true });
      if (Array.isArray(result.experience)) {
        result.experience.forEach(exp => {
          doc.fontSize(12).text(`${exp.position} at ${exp.company} (${exp.duration})`);
        });
      }

      doc.end();
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: 'Error generating PDF', error: err });
    });
};

module.exports = { 
  addResume, 
  viewResumesByUser,
  getResumeById, 
  updateResume, 
  deleteResume,
  generatePDF 
};
