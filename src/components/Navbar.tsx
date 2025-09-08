import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {

  const auth = useAuth();
  const navigate = useNavigate();

  // Deals with the logging out
  function handleLogout() {
    auth.logout();
    navigate('/');
  }

  // Deals with the logging in
  function handleLoginClick() {
    navigate('/auth');
  }
  
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1px', borderBottom: '1px solid black' }}>

      <h2 className="nav-bar-studio-text">S T U D I O</h2>

      {auth.userEmail ? ( // If Logged in
        <div className="auth-welcome">
          <span>Welcome, {auth.userEmail}</span>
          <button className="login-signup-button" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

      ) : ( // If not logged in

        <button className="login-signup-button" onClick={handleLoginClick}>
          Login or Sign Up
        </button>

      )}

    </nav>
  );

}

export default Navbar;