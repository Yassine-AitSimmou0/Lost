import React from 'react';
import './Header.css';
import logo from '../../Assets/Images/Mwader.png';

const Header = () => (
  <header className="header">
    <div className="header-left">
      <img src={logo} alt="Logo" className="header-logo" />
    </div>
    <nav className="header-nav">
      <a href="/home" className="header-link">Home</a>
      <a href="/cart" className="header-link">Cart</a>
      <a href="/contact" className="header-link">Contact</a>
      <a href="/login" className="header-link login-icon-link" aria-label="Login">
        <span className="login-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="9" r="5.5" stroke="white" strokeWidth="2"/>
            <rect x="4.5" y="18" width="19" height="7" rx="3.5" stroke="white" strokeWidth="2"/>
          </svg>
        </span>
      </a>
    </nav>
  </header>
);

export default Header; 