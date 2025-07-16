import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/Styles/Home.css';
import Navbar from './Navbar';
import Footer from './Footer';


const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="home-hero-section">
        <h1 className="home-hero-title">Welcome to Resume Builder</h1>
        <p className="home-hero-subtitle">Create professional resumes in minutes!</p>
        <div className="home-button-group">
          <button onClick={() => navigate('/create')} className="home-primary-btn">
            Create New Resume
          </button>
        </div>
      </div>

      <div className="home-about-section">
        <h2 className="home-about-heading">About Resume Builder</h2>
        <p className="home-about-description">
          Resume Builder is your smart career assistant. It helps job seekers create clean, impactful resumes with guided steps, intuitive design, and professional templates.
        </p>

        <div className="home-features-container">
          <div className="home-feature-card">
            <h3 className="home-feature-title">Simple & Fast</h3>
            <p className="home-feature-text">Just enter your info and download a professional resume in minutes.</p>
          </div>
          <div className="home-feature-card">
            <h3 className="home-feature-title">Customizable</h3>
            <p className="home-feature-text">Control each section — from personal info to education and work history.</p>
          </div>
          <div className="home-feature-card">
            <h3 className="home-feature-title">Modern Templates</h3>
            <p className="home-feature-text">Choose clean, elegant layouts that get noticed by employers.</p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
