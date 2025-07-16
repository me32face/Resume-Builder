import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from './Navbar';
import Footer from './Footer';
import '../Assets/Styles/Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5005/auth/signup', formData)
      .then(res => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Signup Successful',
            text: 'Your account has been created!',
            timer: 1000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Signup Failed',
            text: res.data.msg || 'Something went wrong.'
          });
        }
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.msg || 'Signup failed'
        });
      });
  };

  return (
    <>
      <Navbar />
      <main className="signup-wrapper">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2 className="signup-title">Signup</h2>
          
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="signup-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="signup-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="signup-input"
          />
          <button type="submit" className="signup-button">Signup</button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default Signup;
