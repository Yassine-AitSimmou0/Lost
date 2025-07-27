import React, { useState } from 'react';
import './Signup.css';
import logo from '../../Assets/Images/Mwader.png';

const Signup = () => {
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (form.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just log the data
      console.log('Signup:', form);
      
      // Here you would typically make an API call to create the account
      // const response = await fetch('/api/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(form)
      // });
      
      // Show success message or redirect
      alert('Account created successfully!');
      
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'Failed to create account. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-bg">
      <form className="signup-card" onSubmit={handleSubmit} autoComplete="off">
        <img src={logo} alt="Logo" className="signup-logo" />
        <h1 className="signup-title">Create Account</h1>
        
        {errors.general && (
          <div className="signup-error-general">
            {errors.general}
          </div>
        )}
        
        <div className="signup-field">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className={`signup-input ${errors.username ? 'signup-input-error' : ''}`}
            autoComplete="username"
          />
          {errors.username && (
            <span className="signup-error">{errors.username}</span>
          )}
        </div>
        
        <div className="signup-field">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className={`signup-input ${errors.email ? 'signup-input-error' : ''}`}
            autoComplete="email"
          />
          {errors.email && (
            <span className="signup-error">{errors.email}</span>
          )}
        </div>
        
        <div className="signup-field">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className={`signup-input ${errors.password ? 'signup-input-error' : ''}`}
            autoComplete="new-password"
          />
          {errors.password && (
            <span className="signup-error">{errors.password}</span>
          )}
        </div>
        
        <div className="signup-field">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className={`signup-input ${errors.confirmPassword ? 'signup-input-error' : ''}`}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <span className="signup-error">{errors.confirmPassword}</span>
          )}
        </div>
        
        <button 
          className={`signup-btn ${isLoading ? 'signup-btn-loading' : ''}`} 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
        
        <div className="signup-divider" />
        
        <div className="signup-login">
          <span>Already have an account?</span>
          <button 
            type="button" 
            className="signup-login-link" 
            onClick={() => window.history.back()}
            tabIndex={0} 
            style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup; 