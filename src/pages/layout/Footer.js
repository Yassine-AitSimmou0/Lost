import React from 'react';
import './Footer.css';
import logo from '../../Assets/Images/Mwader.png';

const Footer = () => (
  <footer className="bg-black/95 backdrop-blur-sm border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Brand Section */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <img src={logo} alt="Lost Brand" className="h-8 w-auto mr-3 transition-transform duration-300 hover:scale-110" />
            <span className="text-xl font-bold text-white">LOST</span>
          </div>
          <p className="text-gray-400 text-sm">
            Where street culture meets limited drops.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <div className="flex flex-col space-y-2">
            <a href="/home" className="text-gray-400 hover:text-white transition-all duration-300 text-sm transform hover:scale-105 hover:shadow-sm">
              Home
            </a>
            <a href="/cart" className="text-gray-400 hover:text-white transition-all duration-300 text-sm transform hover:scale-105 hover:shadow-sm">
              Cart
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white transition-all duration-300 text-sm transform hover:scale-105 hover:shadow-sm">
              Contact
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-right">
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">
              lost@mwader.zone
            </p>
            <p className="text-gray-400 text-sm">
              Follow us for updates
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-8 pt-8 text-center">
        <p className="text-gray-400 text-sm">
          © 2025 LOST. All rights reserved. | Limited drops, unlimited style.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer; 