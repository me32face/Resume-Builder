import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Navbar from './Navbar';
import Footer from './Footer';

import '../Assets/Styles/ResumeList.css';

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire('Unauthorized', 'You are not logged in! Please login first.', 'warning').then(() => {
        navigate('/login');
      });
      return;
    }

    fetchResumes(token);
  }, [navigate]);

  const fetchResumes = async (token) => {
    try {
      const response = await axios.get('http://localhost:5005/ResumeBuilder/ViewResumes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 200) {
        setResumes(response.data.data);
      } else {
        Swal.fire('Error', response.data.msg || 'Failed to fetch resumes', 'error');
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      Swal.fire('Server Error', `${error.response?.status} - ${error.response?.data?.msg || 'Unknown error'}`, 'error');
    }
  };

  const handleView = (id) => {
    navigate(`/Preview/${id}`);
  };

  const handleUpdate = (id) => {
    navigate(`/UpdateResume/${id}`);
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire('Unauthorized', 'You are not logged in! Please login first.', 'warning').then(() => {
        navigate('/login');
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the resume permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5005/ResumeBuilder/DeleteResume/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          if (res.status === 200 && res.data.status === 200) {
            Swal.fire('Deleted!', 'Resume deleted successfully.', 'success');
            fetchResumes(token);
          } else {
            Swal.fire('Failed', res.data.msg || 'Failed to delete resume', 'error');
          }
        })
        .catch(err => {
          console.error('Error deleting resume:', err);
          Swal.fire('Error', 'Error deleting resume', 'error');
        });
      }
    });
  };

  const handleDownloadPDF = (id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire('Unauthorized', 'You are not logged in! Please login first.', 'warning').then(() => {
        navigate('/login');
      });
      return;
    }

    axios.get(`http://localhost:5005/ResumeBuilder/GeneratePDF/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'blob'
    })
    .then((response) => {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Resume_${id}.pdf`;
      link.click();
      Swal.fire('Downloaded', 'The PDF has been downloaded.', 'success');
    })
    .catch((err) => {
      console.error('Error downloading PDF:', err);
      Swal.fire('Error', 'Error downloading PDF', 'error');
    });
  };

  return (
    <>
      <Navbar />
      <div className="rl-wrapper">
        <h2 className="rl-heading">All Resumes</h2>
        {resumes.length === 0 ? (
          <p className="rl-no-resumes">No resumes found</p>
        ) : (
          <ul className="rl-list">
            {resumes.map(resume => (
              <li key={resume._id} className="rl-list-item">
                <div className="rl-resume-info">
                  <strong className="rl-resume-name">{resume.fullName}</strong> — <span className="rl-resume-email">{resume.email}</span>
                </div>
                <div className="rl-btn-group">
                  <button 
                    className="rl-view-btn" 
                    onClick={() => handleView(resume._id)}
                  >
                    View
                  </button>
                  <button 
                    className="rl-update-btn"
                    onClick={() => handleUpdate(resume._id)}
                  >
                    Update
                  </button>
                  <button 
                    className="rl-delete-btn"
                    onClick={() => handleDelete(resume._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="download-pdf-button"
                    onClick={() => handleDownloadPDF(resume._id)}
                  >
                    Download PDF
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ResumeList;
