import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../Assets/Images/Mwader.png';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  
  // Generate a simple captcha
  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Initialize captcha on component mount
  React.useEffect(() => {
    setCaptchaValue(generateCaptcha());
  }, []);

  // Common email domains for suggestions
  const emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
  
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, email: value });
    
    // Show suggestions if user types @ and domain
    if (value.includes('@')) {
      const [localPart, domain] = value.split('@');
      if (domain && domain.length > 0) {
        setShowEmailSuggestions(true);
      } else {
        setShowEmailSuggestions(false);
      }
    } else {
      setShowEmailSuggestions(false);
    }
  };

  const handleEmailSuggestion = (suggestion) => {
    const [localPart] = form.email.split('@');
    setForm({ ...form, email: `${localPart}@${suggestion}` });
    setShowEmailSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate captcha
    if (captchaInput.toUpperCase() !== captchaValue) {
      alert('Please enter the correct captcha code');
      setCaptchaInput('');
      setCaptchaValue(generateCaptcha());
      return;
    }

    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
    console.log('Login:', form);
    }, 1500);
  };
  
  const handleCreateAccount = () => {
    navigate('/signup');
  };

  const refreshCaptcha = () => {
    setCaptchaValue(generateCaptcha());
    setCaptchaInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-800 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logo} alt="Lost Brand" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 mt-2">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
          <input
                  type="email"
                  id="email"
            name="email"
                  placeholder="Enter your email"
            value={form.email}
                  onChange={handleEmailChange}
                  onFocus={() => {
                    if (form.email.includes('@')) {
                      setShowEmailSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow clicking on them
                    setTimeout(() => setShowEmailSuggestions(false), 200);
                  }}
            required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                  autoComplete="email"
                />
                
                {/* Email Suggestions */}
                {showEmailSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl z-10 max-h-48 overflow-y-auto">
                    {emailDomains.map((domain) => {
                      const [localPart] = form.email.split('@');
                      const suggestion = `${localPart}@${domain}`;
                      return (
                        <button
                          key={domain}
                          type="button"
                          onClick={() => handleEmailSuggestion(domain)}
                          className="w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center space-x-3"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{suggestion}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
        </div>

            <div>
              <label htmlFor="password" className="block text-white font-semibold mb-2">
                Password
              </label>
          <input
            type="password"
                id="password"
            name="password"
                placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
            autoComplete="current-password"
          />
        </div>

            {/* Remember Me - Enhanced Styling */}
            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border-2 rounded-md transition-all duration-300 flex items-center justify-center ${
                    rememberMe 
                      ? 'bg-white border-white' 
                      : 'border-white/30 group-hover:border-white/60'
                  }`}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-sm text-white hover:text-gray-300 transition-colors duration-300">
                Forgot password?
              </a>
            </div>

            {/* Captcha Section */}
            <div className="bg-gradient-to-r from-white/5 to-gray-400/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
              <label className="block text-white font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security Verification
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative bg-gradient-to-r from-white/10 to-gray-400/10 rounded-xl p-4 border border-white/20 shadow-lg overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}></div>
                    </div>
                    
                    {/* Captcha Text */}
                    <div className="relative z-10">
                      <div className="text-3xl font-mono font-black text-white tracking-widest select-none text-center leading-none">
                        {captchaValue.split('').map((char, index) => (
                          <span 
                            key={index} 
                            className="inline-block transform hover:scale-110 transition-transform duration-200"
                            style={{
                              textShadow: '0 2px 8px rgba(255,255,255,0.3)',
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-2 left-2 w-2 h-2 bg-white/20 rounded-full"></div>
                    <div className="absolute top-2 right-2 w-2 h-2 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 bg-white/20 rounded-full"></div>
                  </div>
                </div>
                
                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-4 bg-gradient-to-r from-white/10 to-gray-400/10 hover:from-white/20 hover:to-gray-400/20 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-white/20 hover:border-white/40 group"
                >
                  <svg className="w-6 h-6 text-white group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              
              {/* Captcha Input */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter the security code above"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300 text-center font-mono tracking-widest text-lg font-semibold uppercase"
                  style={{
                    textShadow: '0 1px 2px rgba(255,255,255,0.1)',
                    letterSpacing: '0.2em'
                  }}
                  required
                />
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Type the 6-character code shown above
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={handleCreateAccount}
                className="text-white hover:text-gray-300 font-semibold transition-colors duration-300"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 