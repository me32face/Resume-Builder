import React, { useEffect, useState } from 'react';
import '../Assets/Styles/CreateResume.css';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import Swal from 'sweetalert2';  // ✅ Import SweetAlert2

const CreateResume = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    skills: '',
    education: [{ degree: '', institution: '', gpa: '' }],
    experience: [{ company: '', position: '', duration: '' }],
  });

  const [submitting, setSubmitting] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Should be logged in to submit',
        text: 'Please login to submit your resume.',
        confirmButtonText: 'OK'
      });
    }
    setTokenChecked(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [name]: value };
      return { ...prev, education: newEducation };
    });
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', gpa: '' }],
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newExperience = [...prev.experience];
      newExperience[index] = { ...newExperience[index], [name]: value };
      return { ...prev, experience: newExperience };
    });
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', duration: '' }],
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'You are not logged in!',
        text: 'Should be logged in to submit. Do you want to proceed anyway?',
        showCancelButton: true,
        confirmButtonText: 'Proceed Anyway',
        cancelButtonText: 'Cancel'
      });

      if (!result.isConfirmed) {
        return; // User chose to cancel
      }
    }

    setSubmitting(true);

    const cleanedFormData = {
      ...formData,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      skills: formData.skills.trim(),
      education: formData.education.map(e => ({
        degree: e.degree.trim(),
        institution: e.institution.trim(),
        gpa: e.gpa.trim()
      })),
      experience: formData.experience.map(e => ({
        company: e.company.trim(),
        position: e.position.trim(),
        duration: e.duration.trim()
      }))
    };

    axios.post("http://localhost:5005/ResumeBuilder/AddResume", cleanedFormData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(response => {
      const data = response.data;
      if (data.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Resume submitted successfully!',
        });
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          skills: '',
          education: [{ degree: '', institution: '', gpa: '' }],
          experience: [{ company: '', position: '', duration: '' }],
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.msg,
        });
      }
    })
    .catch(error => {
      console.error("Error submitting resume:", error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Failed to submit resume. Please try again.',
      });
    })
    .finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <div>
      <Navbar />
      <div className="create-resume-wrapper">
        <div className="resume-form-section">
          <h2 className="form-heading">📝 Create Your Resume</h2>
          {tokenChecked && !localStorage.getItem("token") && (
            <p className="login-warning">⚠️ Should be logged in to submit. Please login.</p>
          )}
          <form className="resume-form" onSubmit={handleSubmit}>
            {/* Personal Info */}
            <h3 className="form-subheading">Personal Information</h3>
            <label>
              Full Name
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Phone Number
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                pattern="[0-9]{10}"
                title="Enter 10 digit phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Address
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </label>

            {/* Education */}
            <h3 className="form-subheading">Education</h3>
            {formData.education.map((edu, index) => (
              <div key={index} className="education-entry">
                <label>
                  Degree
                  <input
                    type="text"
                    name="degree"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, e)}
                    required
                  />
                </label>
                <label>
                  Institution
                  <input
                    type="text"
                    name="institution"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, e)}
                    required
                  />
                </label>
                <label>
                  GPA
                  <input
                    type="text"
                    name="gpa"
                    placeholder="GPA"
                    value={edu.gpa}
                    onChange={(e) => handleEducationChange(index, e)}
                  />
                </label>
                <button
                  type="button"
                  className="remove-entry-btn"
                  onClick={() => removeEducation(index)}
                  disabled={formData.education.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="add-entry-btn" onClick={addEducation}>
              + Add Education
            </button>

            {/* Work Experience */}
            <h3 className="form-subheading">Work Experience</h3>
            {formData.experience.map((exp, index) => (
              <div key={index} className="experience-entry">
                <label>
                  Company Name
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, e)}
                    required
                  />
                </label>
                <label>
                  Position
                  <input
                    type="text"
                    name="position"
                    placeholder="Position"
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(index, e)}
                    required
                  />
                </label>
                <label>
                  Duration
                  <input
                    type="text"
                    name="duration"
                    placeholder="Duration"
                    value={exp.duration}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </label>
                <button
                  type="button"
                  className="remove-entry-btn"
                  onClick={() => removeExperience(index)}
                  disabled={formData.experience.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="add-entry-btn" onClick={addExperience}>
              + Add Experience
            </button>

            {/* Skills */}
            <h3 className="form-subheading">Skills</h3>
            <label>
              <textarea
                name="skills"
                placeholder="List your skills"
                value={formData.skills}
                onChange={handleChange}
                rows={4}
                required
              />
            </label>

            <button type="submit" className="resume-submit-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Resume'}
            </button>
          </form>
        </div>

        {/* Live Preview */}
        <div className="resume-preview-section">
          <h2 className="preview-heading">Live Resume Preview</h2>
          <div className="resume-preview-box">
            <h3>{formData.fullName}</h3>
            <p>{formData.email} | {formData.phone}</p>
            <p>{formData.address}</p>
            <hr />
            <h4>Education</h4>
            {formData.education.map((edu, i) => (
              <p key={i}>{edu.degree} — {edu.institution} (GPA: {edu.gpa || 'N/A'})</p>
            ))}
            <h4>Experience</h4>
            {formData.experience.map((exp, i) => (
              <p key={i}>{exp.position} at {exp.company} ({exp.duration || 'N/A'})</p>
            ))}
            <h4>Skills</h4>
            <p>{formData.skills}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateResume;
