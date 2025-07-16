import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';  // ✅ Import SweetAlert2

import Navbar from './Navbar';
import Footer from './Footer';

import '../Assets/Styles/UpdateResume.css';

const UpdateResume = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    skills: '',
    education: [],
    experience: []
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`http://localhost:5005/ResumeBuilder/GetResumeById/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data.status === 200) {
          setFormData(res.data.data);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Resume not found',
            text: 'The requested resume could not be found.',
          });
          navigate('/AllResumes');
        }
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error fetching resume. Please try again later.',
        });
        navigate('/AllResumes');
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEducationChange = (index, e) => {
    const updated = [...formData.education];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, education: updated });
  };

  const handleExperienceChange = (index, e) => {
    const updated = [...formData.experience];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, experience: updated });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: '', institution: '', gpa: '' }]
    });
  };

  const removeEducation = (index) => {
    const updated = [...formData.education];
    updated.splice(index, 1);
    setFormData({ ...formData, education: updated });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: '', position: '', duration: '' }]
    });
  };

  const removeExperience = (index) => {
    const updated = [...formData.experience];
    updated.splice(index, 1);
    setFormData({ ...formData, experience: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    axios.put(`http://localhost:5005/ResumeBuilder/UpdateResume/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Resume updated successfully!',
            timer: 1500,
            showConfirmButton: false
          });
          navigate('/AllResumes');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'Failed to update resume. Please try again.',
          });
        }
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while updating the resume.',
        });
      });
  };

  return (
    <>
      <Navbar />
      <div className="update-resume-wrapper">
        <h2 className="update-resume-heading">Update Resume</h2>
        <form onSubmit={handleSubmit} className="update-resume-form">
          <input className="update-resume-input" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required />
          <input className="update-resume-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input className="update-resume-input" type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
          <input className="update-resume-input" type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
          <input className="update-resume-input" type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills" required />

          <h3 className="update-resume-subheading">Education</h3>
          {formData.education.map((edu, index) => (
            <div key={index} className="update-resume-edu-block">
              <input className="update-resume-input" type="text" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} placeholder="Degree" />
              <input className="update-resume-input" type="text" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} placeholder="Institution" />
              <input className="update-resume-input" type="text" name="gpa" value={edu.gpa} onChange={(e) => handleEducationChange(index, e)} placeholder="GPA" />
              <button type="button" className="update-resume-remove-btn" onClick={() => removeEducation(index)}>Remove</button>
            </div>
          ))}
          <button type="button" className="update-resume-add-btn" onClick={addEducation}>Add Education</button>

          <h3 className="update-resume-subheading">Experience</h3>
          {formData.experience.map((exp, index) => (
            <div key={index} className="update-resume-exp-block">
              <input className="update-resume-input" type="text" name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} placeholder="Company" />
              <input className="update-resume-input" type="text" name="position" value={exp.position} onChange={(e) => handleExperienceChange(index, e)} placeholder="Position" />
              <input className="update-resume-input" type="text" name="duration" value={exp.duration} onChange={(e) => handleExperienceChange(index, e)} placeholder="Duration" />
              <button type="button" className="update-resume-remove-btn" onClick={() => removeExperience(index)}>Remove</button>
            </div>
          ))}
          <button type="button" className="update-resume-add-btn" onClick={addExperience}>Add Experience</button>

          <button type="submit" className="update-resume-submit-btn">Update Resume</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default UpdateResume;
