import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LostQ.css';
import logo from '../../assets/images/Mwader.png';

const LostQ = () => {
  const navigate = useNavigate();

  return (
    <div className="lostq-container">
      <img src={logo} alt="Lost Logo" className="brand-logo" />
      <h1 className="question">Are you Lost?</h1>
      <div className="buttons">
        
        <button className="btn" onClick={() => navigate('/yes')}>Yes</button>
        <button className="btn" onClick={() => navigate('/noture')}>No</button>
      </div>
    </div>
  );
};

export default LostQ;
