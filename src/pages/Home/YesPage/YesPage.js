import React, { useEffect, useState, useContext } from 'react';
import './YesPage.css';
import logo from '../../../Assets/Images/Mwader.png';
import { CartContext } from '../../../App';

const products = [
  {
    id: 1,
    name: 'Lost Hoodie',
    description: 'Urban oversized hoodie. Free, bold, and made for the streets.',
    image: logo,
    tag: 'Limited Edition',
    stock: 3,
    price: '$89.99',
  },
  {
    id: 2,
    name: 'Cargo Pants',
    description: 'Loose fit, deep pockets, ready for any city adventure.',
    image: logo,
    tag: 'Limited Edition',
    stock: 3,
    price: '$129.99',
  },
  {
    id: 3,
    name: 'Shadow Jacket',
    description: 'Boxy, cropped, and built for the night. No limits.',
    image: logo,
    tag: 'Limited Edition',
    stock: 3,
    price: '$149.99',
  },
];

const YesPage = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [added, setAdded] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useContext(CartContext);
  
  useEffect(() => {
    const timeout = setTimeout(() => setFadeIn(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  const handleBuy = (product) => {
    addToCart(product);
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1200);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setEmailSubmitted(true);
        setIsLoading(false);
        setEmail('');
        // Reset after 3 seconds
        setTimeout(() => setEmailSubmitted(false), 3000);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gray-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-white/5 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Animated Logo */}
            <div className="mb-6 animate-bounce">
              <img src={logo} alt="Lost Brand" className="w-20 h-20 mx-auto drop-shadow-2xl" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight animate-fade-in">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent animate-pulse">
                Lost
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light max-w-3xl mx-auto leading-relaxed">
              Where street culture meets limited drops. Each piece is crafted for those who dare to be different.
            </p>
            
            {/* Animated Features */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Limited Drops
              </div>
              <div className="flex items-center animate-fade-in" style={{animationDelay: '0.4s'}}>
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Premium Quality
              </div>
              <div className="flex items-center animate-fade-in" style={{animationDelay: '0.6s'}}>
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Street Ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
              <span className="text-white font-semibold text-sm">CURRENT DROP</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Latest Collection
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Limited quantities available. Once they're gone, they're gone forever.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className={`group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 transform hover:-translate-y-2 hover:rotate-1 ${
                  added === product.id ? 'ring-2 ring-white/50' : ''
                }`}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: fadeIn ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                }}
              >
                {/* Product Image Container */}
                <div className="relative mb-8">
                  <div className="bg-gradient-to-br from-white/5 to-gray-400/5 rounded-2xl p-8 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-28 h-28 object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-500 group-hover:rotate-12" 
                    />
                  </div>
                  
                  {/* Tag */}
                  <div className="absolute -top-3 -right-3 bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                    {product.tag}
                  </div>
                  
                  {/* Stock Indicator */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-white animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className="text-xs text-gray-400">{product.stock} left</span>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Product Info */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-bold text-white">
                      {product.price}
                    </span>
                    
                    <button 
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-gray-100 hover:shadow-2xl ${
                        added === product.id 
                          ? 'bg-white text-black shadow-lg' 
                          : 'bg-white text-black shadow-lg'
                      }`}
                      onClick={() => handleBuy(product)}
                      disabled={added === product.id}
                    >
                      {added === product.id ? 'Added to Cart' : 'Add to Cart'}
                </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Drop System Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Our Drop System
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                We release limited quantities of our clothing through exclusive drops. Each piece is carefully crafted and numbered, ensuring you own something truly unique.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm">1</div>
                  <span className="text-white">Limited quantities per drop</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm">2</div>
                  <span className="text-white">Exclusive email notifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm">3</div>
                  <span className="text-white">First-come, first-served access</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-white/5 to-gray-400/5 rounded-3xl p-8 border border-white/10">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white/10 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Next Drop</h3>
                  <p className="text-gray-400">Coming Soon</p>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white font-semibold">Get notified first</p>
                    <p className="text-gray-400 text-sm">Join our exclusive list</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm rounded-3xl p-12 border border-gray-800/50 text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Ahead of the Drop
            </h2>
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Get exclusive access to our limited drops before anyone else. Be the first to know when new pieces are available.
            </p>
            
            {!emailSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="bg-white/20 border border-white/30 rounded-xl p-6">
                  <div className="w-12 h-12 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-lg mb-2">Successfully Subscribed!</p>
                  <p className="text-gray-300">You'll be the first to know about our next drop.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default YesPage;
