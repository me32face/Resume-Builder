import React from 'react';
import '../Assets/Styles/Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Resume Builder. All rights reserved.</p>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/create">Create</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
