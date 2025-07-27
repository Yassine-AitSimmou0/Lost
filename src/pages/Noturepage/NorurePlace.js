import React from 'react';
import Mwader from '../../Assets/Images/Mwader.png';

const NoturePage = () => (
  <div className="noture-animated-bg">
    <div className="noture-content">
      <img src={Mwader} alt="Logo" className="noture-logo-anim" />
      <h1 className="noture-text-anim">Stay Away! </h1>
      <p className="noture-subtext">(This is not ur place buddy)</p>
    </div>
  </div>
);

export default NoturePage;
