
import React, { useState } from 'react';
import AuthModel from '../utils/AuthModel';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  
  const { login } = useAuth();    // Login function from AuthContext
  const navigate = useNavigate();   // Page navigation

  // 'login' or 'signup' -- keeping track
  const [mode, setMode] = useState('login'); 
  
  // Storing user email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error messages for user
  const [error, setError] = useState('');



  // Form for login or signup
  function handleSubmit(e: React.FormEvent) {

    e.preventDefault();
    setError('');

    if (mode === 'signup') {

      if (AuthModel.userExists(email)) {    // Checks if alr exists
        setError('Account already exists.');

      } else {  // Adding new user
        AuthModel.addUser(email, password);

        alert('Account created! Please log in.');
        setMode('login');
        setEmail('');
        setPassword('');

      }

    } else {

      if (!AuthModel.userExists(email)) {   // If email doesn't exist
        setError('Account not found.');

      } else if (!AuthModel.validateUser(email, password)) {    // If email exists but password wrong
        setError('Incorrect password.');

      } else {  // Otherwise logs in
        login(email);
        setEmail('');
        setPassword('');
        navigate('/create');

      }

    }

  }

  function toggleMode() {   // Between login & signup
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');

  }

  return (
    <div className="auth-fullpage">
      <div className="auth-container">
        <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button className="auth-submit" type="submit">
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>

          {error && <div className="auth-error">{error}</div>}
        </form>
        
        <button className="auth-alt" type="button" onClick={toggleMode}>
          {mode === 'login' ? 'Need an account? Sign Up' : 'Already signed up? Log In'}
        </button>

      </div>
    </div>

  );

}

export default AuthPage;
