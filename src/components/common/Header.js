import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/images/Mwader.png';

const Header = () => (
  <header className="header">
    <img src={logo} alt="Logo" className="header-logo" />
    <nav className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  </header>
);

export default Header;
