import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Components/Home';
import CreateResume from './Components/CreateResume';
import ResumeList from './Components/ResumeList';
import ResumePreview from './Components/ResumePreview';
import UpdateResume from './Components/UpdateResume';
import Signup from './Components/Signup';
import Login from './Components/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateResume />} />
          <Route path="/AllResumes" element={<ResumeList />} />
          <Route path="/Preview/:id" element={<ResumePreview/>} />
          <Route path="/UpdateResume/:id" element={<UpdateResume />} />
          <Route path="/SignUp" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
