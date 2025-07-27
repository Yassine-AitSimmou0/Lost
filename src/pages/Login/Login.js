import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../Assets/Images/Mwader.png';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the data
    console.log('Login:', form);
  };
  
  const handleCreateAccount = () => {
    navigate('/signup');
  };

  return (
    <div className="login-bg">
      <form className="login-card" onSubmit={handleSubmit} autoComplete="off">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1 className="login-title">Sign In</h1>
        <div className="login-field">
          <input
            type="text"
            name="email"
            placeholder="Username or Email"
            value={form.email}
            onChange={handleChange}
            required
            className="login-input"
            autoComplete="username"
          />
        </div>
        <div className="login-field">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="login-input"
            autoComplete="current-password"
          />
        </div>
        <button className="login-btn" type="submit">Login</button>
        <div className="login-divider" />
        <div className="login-create">
          <span>Don&apos;t have an account?</span>
          <button type="button" className="login-create-link" onClick={handleCreateAccount} tabIndex={0} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}>Create an account</button>
        </div>
      </form>
    </div>
  );
};

export default Login; 