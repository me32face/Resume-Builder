import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../Assets/Styles/Login.css';

import Navbar from './Navbar';
import Footer from './Footer';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5005/auth/login', formData)
      .then(res => {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));

          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You will be redirected shortly',
            timer: 1500,
            showConfirmButton: false
          });

          setTimeout(() => {
            navigate('/');
          }, 1600);

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: res.data.msg || 'Invalid credentials'
          });
        }
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.msg || 'Login failed'
        });
      });
  };

  return (
    <>
      <Navbar />
      <main className="login-page-akhy">
        <div className="login-wrapper-akhy">
          <h2 className="login-title-akhy">Login</h2>
          <form onSubmit={handleSubmit} className="login-form-akhy">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="login-input-akhy"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="login-input-akhy"
            />
            <button type="submit" className="login-button-akhy">Login</button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
