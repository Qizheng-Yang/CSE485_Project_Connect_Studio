
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

  // Password confirmation
  const [confirmPassword, setConfirmPassword] = useState(''); 

  // Error messages for user
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form for login or signup
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          return;
        }

        // Try to create user
        const success = await AuthModel.addUser(email, password);
        
        if (success) {
          alert('Account created! Please log in.');
          setMode('login');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        } else {
          setError('Account already exists or registration failed.');
        }

      } else {
        // Login mode
        const success = await AuthModel.validateUser(email, password);
        
        if (success) {
          login(email);
          setEmail('');
          setPassword('');
          navigate('/create');
        } else {
          setError('Invalid email or password.');
        }
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {   // Between login & signup
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setConfirmPassword('');

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

          {mode === 'signup' && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="auth-input"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Sign Up')}
          </button>

          {error && <div className="auth-error">{error}</div>}
        </form>
        
        <button className="auth-alt" type="button" onClick={toggleMode}>
          {mode === 'login' ? 'Need an account? Sign Up' : 'Already signed up? Log In'}
        </button>


        <button 
          className="auth-back-button" 
          type="button" 
          onClick={() => navigate('/')}
        >
          Back
        </button>


      </div>
    </div>

  );

}

export default AuthPage;
