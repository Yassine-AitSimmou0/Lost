import React from 'react';
import './Footer.css';
import logo from '../../assets/images/Mwader.png';

const Footer = () => {
  return (
    <footer className="footer">
      <img src={logo} alt="Footer Logo" className="footer-logo" />
      <p className="footer-text">© 2025 LOST. All rights reserved.</p>
      <p className="footer-contact">Contact: lost@mwader.zone</p>
    </footer>
  );
};

export default Footer;
