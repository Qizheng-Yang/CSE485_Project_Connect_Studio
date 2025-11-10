import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1px', borderBottom: '1px solid black'}}>

      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h2 className="nav-bar-studio-text">S T U D I O</h2>
      </Link>

      {auth.userEmail ? ( // If Logged in
        <div className="auth-welcome" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span>Welcome, {auth.userEmail}</span>
          <Link to="/my-projects">
            <button style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#4a90e2',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              My Projects
            </button>
          </Link>
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