import React, { useEffect, useState } from 'react';
import logo from '../../Assets/Images/Mwader.png';

const MaintenancePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Animated progress bar
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 50);

    // Mouse tracking for parallax effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Enhanced Animated Background with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/15 to-blue-400/15 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px)`
          }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-blue-500/15 rounded-full blur-3xl animate-pulse" 
          style={{
            animationDelay: '2s',
            transform: `translate(${(mousePosition.x - 50) * -0.1}px, ${(mousePosition.y - 50) * -0.1}px)`
          }}
        ></div>
        <div 
          className="absolute top-40 left-40 w-96 h-96 bg-gradient-to-br from-blue-500/15 to-blue-400/15 rounded-full blur-3xl animate-pulse" 
          style={{
            animationDelay: '4s',
            transform: `translate(${(mousePosition.x - 50) * 0.05}px, ${(mousePosition.y - 50) * 0.05}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" 
          style={{
            animationDelay: '6s',
            transform: `translate(${(mousePosition.x - 50) * 0.08}px, ${(mousePosition.y - 50) * 0.08}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/3 right-1/3 w-80 h-80 bg-gradient-to-br from-blue-500/8 to-blue-600/8 rounded-full blur-3xl animate-pulse" 
          style={{
            animationDelay: '8s',
            transform: `translate(${(mousePosition.x - 50) * -0.05}px, ${(mousePosition.y - 50) * -0.05}px)`
          }}
        ></div>
      </div>

      {/* Enhanced Floating Particles with Mouse Interaction */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              transform: `translate(${(mousePosition.x - 50) * 0.02}px, ${(mousePosition.y - 50) * 0.02}px)`
            }}
          />
        ))}
        {[...Array(20)].map((_, i) => (
          <div
            key={`large-${i}`}
            className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-15 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              transform: `translate(${(mousePosition.x - 50) * 0.03}px, ${(mousePosition.y - 50) * 0.03}px)`
            }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <div
            key={`glow-${i}`}
            className="absolute w-3 h-3 bg-blue-200 rounded-full opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 2}s`,
              transform: `translate(${(mousePosition.x - 50) * 0.04}px, ${(mousePosition.y - 50) * 0.04}px)`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Enhanced Logo with Advanced Glow Effect */}
        <div className="mb-16 animate-float">
          <div 
            className="relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-blue-600/40 rounded-full blur-3xl group-hover:blur-4xl transition-all duration-1000 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700 animate-pulse" style={{animationDelay: '1s'}}></div>
            <img
              src={logo}
              alt="Lost Logo"
              className="relative w-40 h-40 md:w-48 md:h-48 mx-auto drop-shadow-2xl animate-pulse group-hover:scale-110 transition-all duration-700"
              style={{ zIndex: 10 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-transparent rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            {isHovering && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-blue-500/10 rounded-full animate-ping"></div>
            )}
          </div>
        </div>
        
        {/* Enhanced Status Badge with Animation */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-blue-500/25 to-blue-600/25 border border-blue-500/50 rounded-full backdrop-blur-sm shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
            <span className="text-blue-300 font-bold text-xl tracking-wider animate-pulse">MAINTENANCE MODE</span>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
          </div>
        </div>
        
        {/* Enhanced Main Title with Typing Effect */}
        <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-wider animate-fade-in bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Lost is <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 bg-clip-text text-transparent animate-pulse">Offline</span>
        </h1>
        
        {/* Enhanced Subtitle with Glow */}
        <p className="text-2xl md:text-3xl text-gray-300 mb-16 max-w-3xl mx-auto animate-fadeInUp animation-delay-300 leading-relaxed font-medium">
          We're currently updating our systems and preparing for the next drop. 
          <span className="text-blue-300 font-semibold animate-pulse"> No drops are available at the moment.</span>
        </p>
        
        {/* Enhanced Progress Bar with Glow */}
        <div className="mb-16 animate-fadeInUp animation-delay-500">
          <div className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-full p-2 max-w-md mx-auto shadow-2xl">
            <div className="relative h-4 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-3 font-medium animate-pulse">System Update in Progress</p>
        </div>
        
        {/* Enhanced Status Information with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fadeInUp animation-delay-700">
          <div className="group bg-gradient-to-br from-blue-500/15 to-blue-600/15 backdrop-blur-sm border border-blue-500/40 rounded-3xl p-8 hover:bg-blue-500/20 hover:border-blue-500/60 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-10 h-10 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-3 group-hover:text-blue-300 transition-colors duration-300">Estimated Time</h3>
            <p className="text-gray-400 text-base group-hover:text-gray-300 transition-colors duration-300">We'll be back soon with fresh drops</p>
          </div>
          
          <div className="group bg-gradient-to-br from-yellow-500/15 to-yellow-600/15 backdrop-blur-sm border border-yellow-500/40 rounded-3xl p-8 hover:bg-yellow-500/20 hover:border-yellow-500/60 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/40 to-yellow-600/40 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-10 h-10 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-3 group-hover:text-yellow-300 transition-colors duration-300">No Drops</h3>
            <p className="text-gray-400 text-base group-hover:text-gray-300 transition-colors duration-300">Limited releases temporarily paused</p>
          </div>
          
          <div className="group bg-gradient-to-br from-blue-500/15 to-blue-600/15 backdrop-blur-sm border border-blue-500/40 rounded-3xl p-8 hover:bg-blue-500/20 hover:border-blue-500/60 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-10 h-10 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-3 group-hover:text-blue-300 transition-colors duration-300">Updates</h3>
            <p className="text-gray-400 text-base group-hover:text-gray-300 transition-colors duration-300">Follow us for latest news</p>
          </div>
        </div>
        
        {/* Enhanced Current Time with Glow */}
        <div className="bg-gradient-to-br from-white/15 to-white/8 backdrop-blur-sm border border-white/30 rounded-3xl p-8 mb-16 animate-fadeInUp animation-delay-900 shadow-2xl hover:shadow-white/20 transition-all duration-500 hover:scale-105">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
            <p className="text-gray-300 text-lg font-medium">Current Time (Morocco)</p>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
          </div>
          <p className="text-white font-mono text-3xl md:text-4xl font-bold tracking-wider animate-pulse">
            {currentTime.toLocaleString('en-US', { 
              timeZone: 'Africa/Casablanca',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </p>
        </div>
        
        {/* Enhanced Social Links with Advanced Hover Effects */}
        <div className="animate-fadeInUp animation-delay-1100">
          <p className="text-gray-300 text-lg mb-6 font-medium">Stay connected with Lost</p>
          <div className="flex justify-center space-x-8">
            <a href="#" className="group w-16 h-16 bg-gradient-to-br from-blue-500/25 to-blue-600/25 border border-blue-500/50 rounded-2xl flex items-center justify-center hover:bg-blue-500/40 hover:border-blue-500/70 hover:scale-110 hover:-translate-y-2 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30">
              <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="group w-16 h-16 bg-gradient-to-br from-blue-500/25 to-blue-600/25 border border-blue-500/50 rounded-2xl flex items-center justify-center hover:bg-blue-500/40 hover:border-blue-500/70 hover:scale-110 hover:-translate-y-2 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30">
              <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </a>
            <a href="#" className="group w-16 h-16 bg-gradient-to-br from-blue-500/25 to-blue-600/25 border border-blue-500/50 rounded-2xl flex items-center justify-center hover:bg-blue-500/40 hover:border-blue-500/70 hover:scale-110 hover:-translate-y-2 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30">
              <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Enhanced Footer Message */}
        <div className="mt-16 animate-fadeInUp animation-delay-1300">
          <p className="text-gray-500 text-sm font-medium hover:text-gray-400 transition-colors duration-300">
            © 2024 Lost Clothing Brand. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage; 