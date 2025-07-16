const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateResumePDF = (resumeData, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();

      // Pipe the PDF to a file
      doc.pipe(fs.createWriteStream(outputPath));

      // Title
      doc.fontSize(20).text(resumeData.fullName, { underline: true });
      doc.moveDown();

      // Contact
      doc.fontSize(12).text(`Email: ${resumeData.email}`);
      doc.text(`Phone: ${resumeData.phone}`);
      doc.text(`Address: ${resumeData.address}`);
      doc.moveDown();

      // Skills
      doc.fontSize(14).text('Skills', { underline: true });
      doc.fontSize(12).text(resumeData.skills);
      doc.moveDown();

      // Education
      doc.fontSize(14).text('Education', { underline: true });
      resumeData.education.forEach(edu => {
        doc.fontSize(12).text(`${edu.degree} at ${edu.institution} (GPA: ${edu.gpa})`);
      });
      doc.moveDown();

      // Experience
      doc.fontSize(14).text('Experience', { underline: true });
      resumeData.experience.forEach(exp => {
        doc.fontSize(12).text(`${exp.position} at ${exp.company} (${exp.duration})`);
      });

      doc.end();

      // Done writing
      doc.on('finish', () => {
        resolve(outputPath);
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateResumePDF;
