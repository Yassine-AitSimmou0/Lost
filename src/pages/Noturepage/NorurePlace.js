import React from 'react';
import Mwader from '../../Assets/Images/Mwader.png';

const NoturePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center px-4">
    {/* Animated Background Elements */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-gray-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-80 h-80 bg-white/5 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-4000"></div>
    </div>

    <div className="relative z-10 text-center">
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-800 p-12 md:p-16 max-w-md mx-auto">
        {/* Animated Logo */}
        <div className="mb-8 animate-bounce">
          <img src={Mwader} alt="Lost Brand" className="w-24 h-24 mx-auto drop-shadow-2xl" />
        </div>
        
        {/* Main Text */}
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight animate-pulse">
          Stay Away!
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-8 font-light">
          (This is not ur place buddy)
        </p>
        
        {/* Warning Icon */}
        <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        {/* Go Back Button */}
        <a 
          href="/" 
          className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-2xl"
        >
          Go Back Home
        </a>
      </div>
    </div>
  </div>
);

export default NoturePage;
