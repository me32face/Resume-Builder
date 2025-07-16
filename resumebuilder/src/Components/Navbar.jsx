import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../Assets/Styles/Navbar.css';
import Swal from 'sweetalert2';  // ✅ Import SweetAlert2

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]); // re-check on route change

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        Swal.fire({
          icon: 'success',
          title: 'Logged out',
          text: 'You have been logged out successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    });
  };

  return (
    <nav className="rb-navbar">
      <div className="rb-navbar-container">
        <div className="rb-navbar-logo">
          <Link to="/">Resume<span>Builder</span></Link>
        </div>

        {/* Hamburger button */}
        <button
          className="rb-navbar-toggle"
          aria-label="Toggle navigation menu"
          onClick={toggleMenu}
        >
          <span className={`rb-hamburger ${menuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`rb-navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link
            to="/"
            className={`rb-navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/create"
            className={`rb-navbar-link ${location.pathname === '/create' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Create
          </Link>
          <Link
            to="/AllResumes"
            className={`rb-navbar-link ${location.pathname === '/AllResumes' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            All Resumes
          </Link>

          {isLoggedIn ? (
            <button
              className="rb-navbar-link rb-logout-btn"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className={`rb-navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`rb-navbar-link ${location.pathname === '/signup' ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
