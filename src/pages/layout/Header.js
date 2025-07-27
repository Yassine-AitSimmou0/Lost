import React from 'react';
import './Header.css';
import logo from '../../Assets/Images/Mwader.png';

const Header = () => (
  <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="Logo" 
            className="h-10 w-auto transition-transform duration-300 hover:scale-110 hover:drop-shadow-lg" 
          />
        </div>
        <nav className="hidden md:flex space-x-8">
          <a 
            href="/home" 
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-gray-900 hover:shadow-lg transform hover:scale-105"
          >
            Home
          </a>
          <a 
            href="/cart" 
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-gray-900 hover:shadow-lg transform hover:scale-105"
          >
            Cart
          </a>
          <a 
            href="/contact" 
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-gray-900 hover:shadow-lg transform hover:scale-105"
          >
            Contact
          </a>
        </nav>
        <div className="flex items-center">
          <a 
            href="/login" 
            className="text-gray-300 hover:text-white p-2 rounded-full transition-all duration-300 hover:bg-gray-900 hover:shadow-lg group transform hover:scale-105" 
            aria-label="Login"
          >
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 28 28" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 group-hover:scale-110"
            >
              <circle cx="14" cy="9" r="5.5" stroke="currentColor" strokeWidth="2"/>
              <rect x="4.5" y="18" width="19" height="7" rx="3.5" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </header>
);

export default Header; 