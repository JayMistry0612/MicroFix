import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #ccc', alignItems: 'center' }}>
      <Link to="/">Home</Link>
      <Link to="/pdf">PDF Summary</Link>
      <Link to="/image">Image Caption</Link>
      <Link to="/audio">Audio Mood</Link>
      <Link to="/tone">Tone Changer</Link>
      <div style={{ flex: 1 }} />
      {user ? (
        <>
          <span>Welcome, <b>{user.username}</b></span>
          <button onClick={handleLogout} style={{ marginLeft: 12 }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar; 