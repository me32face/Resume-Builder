import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../Assets/Styles/ResumePreview.css';

const ResumePreview = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

 useEffect(() => {
  const token = localStorage.getItem("token");

  axios.get(`http://localhost:5005/ResumeBuilder/GetResumeById/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => {
      if (res.data.status === 200) {
        setResume(res.data.data);
      } else {
        alert('Resume not found');
        navigate('/AllResumes');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error fetching resume');
      navigate('/AllResumes');
    });
}, [id, navigate]);

  if (!resume) return <p className="loading-text">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="resume-preview-wrapper">
        <div className="resume-preview-container">
          <h2 className="resume-name">{resume.fullName}</h2>
          <p className="resume-contact">{resume.email} | {resume.phone}</p>
          <p className="resume-address">{resume.address}</p>
          <hr className="divider" />

          <section className="section-education">
            <h3 className="section-heading">Education</h3>
            {resume.education.map((edu, i) => (
              <p key={i} className="education-entry">
                <span className="degree">{edu.degree}</span> — <span className="institution">{edu.institution}</span> (GPA: {edu.gpa || 'N/A'})
              </p>
            ))}
          </section>

          <section className="section-experience">
            <h3 className="section-heading">Experience</h3>
            {resume.experience.map((exp, i) => (
              <p key={i} className="experience-entry">
                <span className="position">{exp.position}</span> at <span className="company">{exp.company}</span> ({exp.duration || 'N/A'})
              </p>
            ))}
          </section>

          <section className="section-skills">
            <h3 className="section-heading">Skills</h3>
            <p className="skills-text">{resume.skills}</p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResumePreview;
