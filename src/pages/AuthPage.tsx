import React, { useState } from 'react';
import AuthModel from '../utils/AuthModel';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Icons for the visibility toggle
const EyeIcon = ({ size = 20, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
);
  
const EyeOffIcon = ({ size = 20, ...props }) => (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
);


function AuthPage() {
  
  const { login } = useAuth();  // Login function from AuthContext
  const navigate = useNavigate();  // Page navigation
 //  'login' or 'signup' -- keeping track
  const [mode, setMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        const success = await AuthModel.addUser(email, password);    // Try to create user
        
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
        const success = await AuthModel.validateUser(email, password);   // Login Mode
        
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

  function toggleMode() {                     // Between login & signup
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

          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {mode === 'signup' && (
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="auth-input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
               {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
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
