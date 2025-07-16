const express = require("express");
const Router = express.Router();


const resumeController = require("./resumeController");


const verifyToken = require("./verifyToken");

Router.post("/AddResume", verifyToken, resumeController.addResume);
Router.get("/ViewResumes", verifyToken, resumeController.viewResumesByUser);
Router.get('/GetResumeById/:id', verifyToken, resumeController.getResumeById);
Router.put('/UpdateResume/:id', verifyToken, resumeController.updateResume);
Router.delete('/DeleteResume/:id', verifyToken, resumeController.deleteResume);
Router.get('/GeneratePDF/:id', verifyToken, resumeController.generatePDF);




module.exports = Router;