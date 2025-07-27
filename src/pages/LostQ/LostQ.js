import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LostQ.css';
import logo from '../../Assets/Images/Mwader.png';

const LostQ = () => {
  const navigate = useNavigate();
  const logoRef = useRef(null);
  const headerTargetRef = useRef(null);
  const [animating, setAnimating] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

  const handleYes = () => {
    setShowHeader(true); // Show header for animation
    setFadeOut(true); // Start fading out the page
    localStorage.setItem('lostq-answered', 'yes');
    if (!logoRef.current) {
      setTimeout(() => navigate('/home'), 1800);
      return;
    }
    const startRect = logoRef.current.getBoundingClientRect();
    // Fixed destination matching header logo (before navigation, animate to top left)
    const endLeft = 30;
    const endTop = 20;
    const endWidth = 50;
    const endHeight = 50;

    // Make the question page logo bigger
    logoRef.current.style.width = '180px';
    logoRef.current.style.height = '180px';

    // Create a floating clone
    const floatingLogo = logoRef.current.cloneNode(true);
    floatingLogo.style.position = 'fixed';
    floatingLogo.style.left = `${startRect.left}px`;
    floatingLogo.style.top = `${startRect.top}px`;
    floatingLogo.style.width = `${startRect.width}px`;
    floatingLogo.style.height = `${startRect.height}px`;
    floatingLogo.style.transition = 'all 2.2s cubic-bezier(0.4,0,0.2,1)';
    floatingLogo.style.zIndex = 99999;
    floatingLogo.style.opacity = 1;
    document.body.appendChild(floatingLogo);

    setTimeout(() => {
      logoRef.current.style.visibility = 'hidden';
    }, 100);

    setFadeOut(true);
    setAnimating(true);
    requestAnimationFrame(() => {
      floatingLogo.style.left = `${endLeft}px`;
      floatingLogo.style.top = `${endTop}px`;
      floatingLogo.style.width = `${endWidth}px`;
      floatingLogo.style.height = `${endHeight}px`;
    });

    setTimeout(() => {
      if (floatingLogo && floatingLogo.parentNode) document.body.removeChild(floatingLogo);
      sessionStorage.setItem('animateHeaderLogo', 'true');
      navigate('/home');
    }, 2600); // Increased duration for smoother transition
  };

  const handleNo = () => {
    if (!logoRef.current) {
      navigate('/noture');
      return;
    }
    setFadeOut(true); // Start fading out the page
    const startRect = logoRef.current.getBoundingClientRect();
    // Center of viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const endWidth = 350;
    const endHeight = 350;
    const endLeft = (vw - endWidth) / 2;
    const endTop = (vh - endHeight) / 2;

    // Create a floating clone
    const floatingLogo = logoRef.current.cloneNode(true);
    floatingLogo.style.position = 'fixed';
    floatingLogo.style.left = `${startRect.left}px`;
    floatingLogo.style.top = `${startRect.top}px`;
    floatingLogo.style.width = `${startRect.width}px`;
    floatingLogo.style.height = `${startRect.height}px`;
    floatingLogo.style.transition = 'all 1.5s cubic-bezier(0.4,0,0.2,1)';
    floatingLogo.style.zIndex = 99999;
    floatingLogo.style.opacity = 1;
    document.body.appendChild(floatingLogo);

    setTimeout(() => {
      logoRef.current.style.visibility = 'hidden';
    }, 100);

    setFadeOut(true);
    setAnimating(true);
    requestAnimationFrame(() => {
      floatingLogo.style.left = `${endLeft}px`;
      floatingLogo.style.top = `${endTop}px`;
      floatingLogo.style.width = `${endWidth}px`;
      floatingLogo.style.height = `${endHeight}px`;
    });

    setTimeout(() => {
      if (floatingLogo && floatingLogo.parentNode) document.body.removeChild(floatingLogo);
      navigate('/noture');
    }, 1500);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col items-center justify-center relative overflow-hidden ${fadeOut ? 'fade-out' : ''}`} style={{ transition: 'opacity 1.3s cubic-bezier(0.4,0,0.2,1)' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-white/5 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Show header with logo hidden only during animation */}
      {showHeader && (
        <div className="fixed top-0 left-0 w-full bg-black/95 backdrop-blur-sm border-b border-gray-800 flex items-center px-8 py-4 z-50">
          <img ref={headerTargetRef} src={logo} alt="Header Target" className="w-12 h-auto transition-opacity duration-200 opacity-100" />
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        <img
          ref={logoRef}
          src={logo}
          alt="Lost Logo"
          className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 drop-shadow-2xl animate-pulse"
          style={{ zIndex: 10 }}
        />
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-12 tracking-wider animate-fade-in">
          Are you <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Lost</span>?
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button 
            className="px-12 py-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleYes} 
            disabled={animating}
          >
            Yes
          </button>
          <button 
            className="px-12 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleNo} 
            disabled={animating}
          >
            No
          </button>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LostQ;
