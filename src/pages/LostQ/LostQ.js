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
    
    // Wait a moment for the header to be rendered, then get its exact position
    setTimeout(() => {
      // Find the actual header logo element - try multiple selectors
      let headerLogo = document.querySelector('header img[alt="Logo"]');
      if (!headerLogo) {
        headerLogo = document.querySelector('header img');
      }
      if (!headerLogo) {
        // Create a temporary header to get the exact position
        const tempHeader = document.createElement('div');
        tempHeader.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: -1;
          visibility: hidden;
          background: transparent;
        `;
        tempHeader.innerHTML = `
          <div style="max-width: 1280px; margin: 0 auto; padding: 0 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; height: 64px;">
              <div style="display: flex; align-items: center;">
                <div style="display: flex; align-items: center;">
                  <img src="${logo}" alt="Logo" style="height: 40px; width: auto;" />
                </div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(tempHeader);
        headerLogo = tempHeader.querySelector('img');
        
        const endRect = headerLogo.getBoundingClientRect();
        document.body.removeChild(tempHeader);
        
        const endLeft = endRect.left;
        const endTop = endRect.top;
        const endWidth = endRect.width;
        const endHeight = endRect.height;

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
        }, 2600);
      } else {
        // Use the found header logo
        const endRect = headerLogo.getBoundingClientRect();
        
        const endLeft = endRect.left;
        const endTop = endRect.top;
        const endWidth = endRect.width;
        const endHeight = endRect.height;

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
        }, 2600);
      }
    }, 100); // Small delay to ensure header is rendered
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
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-white/5 to-gray-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-gray-400/5 to-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-gradient-to-br from-white/5 to-gray-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-gray-400/3 to-white/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '6s'}}></div>
      </div>

      {/* Show header with logo hidden only during animation */}
      {showHeader && (
        <div className="fixed top-0 left-0 w-full bg-black/95 backdrop-blur-sm border-b border-gray-800 flex items-center px-8 py-4 z-50">
          <img ref={headerTargetRef} src={logo} alt="Header Target" className="w-12 h-auto transition-opacity duration-200 opacity-100" />
        </div>
      )}

      {/* Enhanced Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Enhanced Logo */}
        <div className="mb-12 animate-float">
          <div className="relative group">
            <img
              ref={logoRef}
              src={logo}
              alt="Lost Logo"
              className="w-32 h-32 md:w-40 md:h-40 mx-auto drop-shadow-2xl animate-pulse group-hover:scale-110 transition-transform duration-500"
              style={{ zIndex: 10 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          </div>
        </div>
        
        {/* Enhanced Title */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-16 tracking-wider animate-fade-in bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Are you <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Lost</span>?
        </h1>
        
        {/* Enhanced Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-2xl mx-auto animate-fadeInUp animation-delay-300 leading-relaxed">
          Discover the world of limited drops and unlimited style
        </p>
        
        {/* Enhanced Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center animate-fadeInUp animation-delay-500">
          <button 
            className="px-16 py-6 bg-white hover:bg-gray-100 text-black font-bold rounded-full text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            onClick={handleYes} 
            disabled={animating}
          >
            <div className="flex items-center space-x-3">
              <span>Yes, I'm Lost</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
          <button 
            className="px-16 py-6 bg-transparent border-2 border-white/30 hover:border-white hover:bg-white/10 text-white font-bold rounded-full text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            onClick={handleNo} 
            disabled={animating}
          >
            <div className="flex items-center space-x-3">
              <span>Not Yet</span>
              <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </button>
        </div>

        {/* Enhanced Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fadeInUp animation-delay-700">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-8 h-8 text-white group-hover:text-gray-200 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Limited Drops</h3>
            <p className="text-gray-400 text-sm">Exclusive releases that sell out fast</p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-8 h-8 text-white group-hover:text-gray-200 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Premium Quality</h3>
            <p className="text-gray-400 text-sm">Crafted with the finest materials</p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-8 h-8 text-white group-hover:text-gray-200 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Urban Style</h3>
            <p className="text-gray-400 text-sm">Designed for the modern street culture</p>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-float"
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
