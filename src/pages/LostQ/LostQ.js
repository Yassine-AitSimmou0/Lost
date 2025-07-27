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
    <div className={`lostq-container${fadeOut ? ' fade-out' : ''}`} style={{ position: 'relative', transition: 'opacity 1.3s cubic-bezier(0.4,0,0.2,1)' }}>
      {/* Show header with logo hidden only during animation */}
      {showHeader && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          background: '#111',
          display: 'flex',
          alignItems: 'center',
          padding: '15px 30px',
          borderBottom: '1px solid #333',
          zIndex: 1000
        }}>
          <img ref={headerTargetRef} src={logo} alt="Header Target" style={{ width: 50, height: 'auto', transition: 'opacity 0.2s', opacity: 1 }} />
        </div>
      )}
      <img
        ref={logoRef}
        src={logo}
        alt="Lost Logo"
        className="brand-logo"
        style={{ zIndex: 10 }}
      />
      <h1 className="question">Are you Lost?</h1>
      <div className="buttons">
        <button className="btn" onClick={handleYes} disabled={animating}>Yes</button>
        <button className="btn" onClick={handleNo} disabled={animating}>No</button>
      </div>
    </div>
  );
};

export default LostQ;
