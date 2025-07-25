import React from 'react';
import './NoturePlace.css';
import logo from '../../assets/images/Mwader.png'; // Reuse same logo

const NoturePlace = () => {
  return (
    <div className="noture-container">
      <img src={logo} alt="Brand Logo" className="noture-logo" />
      <div className="noture-text">Sir t9awed</div>
    </div>
  );
};

export default NoturePlace;
