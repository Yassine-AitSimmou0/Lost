import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LogoAnimationContext } from '../../../App';
import { CartContext } from '../../../App';
import { useAdmin } from '../../../context/AdminContext';
import logo from '../../../Assets/Images/Mwader.png';

const YesPage = () => {
  const { setHideLogo } = useContext(LogoAnimationContext);
  const { addToCart } = useContext(CartContext);
  const { addNewsletterSubscriber, getActiveProducts } = useAdmin();
  
  const [added, setAdded] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get active products from admin context
  const activeProducts = getActiveProducts();

  useEffect(() => {
    setHideLogo(true);
    
    // Check if we should show the logo animation
    const shouldAnimateLogo = sessionStorage.getItem('animateHeaderLogo');
    if (shouldAnimateLogo) {
      // Show the logo after a short delay
      setTimeout(() => {
        setHideLogo(false);
      }, 100);
      sessionStorage.removeItem('animateHeaderLogo');
    } else {
      // Show logo immediately if no animation
      setHideLogo(false);
    }
    
    return () => {
      setHideLogo(false);
    };
  }, [setHideLogo]);

  const handleBuy = (product, size = null) => {
    if (size && product.sizes && product.sizes[size] <= 0) {
      alert('This size is out of stock!');
      return;
    }
    
    const productToAdd = size ? { ...product, selectedSize: size } : product;
    setAdded(product.id);
    addToCart(productToAdd);
    setTimeout(() => setAdded(null), 2000);
    setSelectedProduct(null);
    setSelectedSize('');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const success = addNewsletterSubscriber(email);
      if (success) {
        setEmailSubmitted(true);
        setEmail('');
        setTimeout(() => setEmailSubmitted(false), 3000);
      }
      setIsLoading(false);
    }, 1000);
  };

  const getTotalStock = (product) => {
    if (!product.sizes) return product.stock;
    return Object.values(product.sizes).reduce((sum, count) => sum + count, 0);
  };

  const getAvailableSizes = (product) => {
    if (!product.sizes) return [];
    return Object.entries(product.sizes)
      .filter(([size, count]) => count > 0)
      .map(([size]) => size);
  };

  const scrollToProducts = () => {
    document.getElementById('products-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-white/5 to-gray-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-gray-400/5 to-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-br from-white/5 to-gray-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-gray-400/3 to-white/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '6s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Enhanced Hero Section */}
        <section className="pt-32 pb-20 px-4 relative">
          <div className="max-w-6xl mx-auto text-center">
            {/* Enhanced Logo Animation */}
            <div className="mb-12 animate-float">
              <div className="relative group">
                <img src={logo} alt="Lost Brand" className="w-32 h-32 mx-auto group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              </div>
            </div>

            {/* Enhanced Brand Name */}
            <h1 className="text-7xl md:text-9xl font-black text-white mb-8 animate-fadeInUp bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              LOST
            </h1>

            {/* Enhanced Tagline */}
            <p className="text-2xl md:text-3xl text-gray-300 mb-16 max-w-4xl mx-auto animate-fadeInUp animation-delay-300 leading-relaxed">
              Urban fashion for the free spirit. <span className="text-white font-semibold">Limited drops, unlimited style.</span>
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16 animate-fadeInUp animation-delay-500">
              <button
                onClick={scrollToProducts}
                className="px-8 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                Explore Collection
              </button>
              <button className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold rounded-full border-2 border-white/30 transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </div>

            {/* Enhanced Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              <div className="text-center animate-fadeInUp animation-delay-700 group">
                <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white group-hover:text-gray-200 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">Limited Drops</h3>
                <p className="text-gray-400 leading-relaxed">Exclusive releases that sell out fast. Each piece is a statement of individuality.</p>
              </div>

              <div className="text-center animate-fadeInUp animation-delay-900 group">
                <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white group-hover:text-gray-200 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">Premium Quality</h3>
                <p className="text-gray-400 leading-relaxed">Crafted with the finest materials and attention to detail that lasts.</p>
              </div>

              <div className="text-center animate-fadeInUp animation-delay-1100 group">
                <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white group-hover:text-gray-200 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">Urban Style</h3>
                <p className="text-gray-400 leading-relaxed">Designed for the modern street culture with bold, authentic aesthetics.</p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fadeInUp animation-delay-1300">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{activeProducts.length}</div>
                <div className="text-gray-400 text-sm">Active Drops</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-400 text-sm">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-gray-400 text-sm">Authentic</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">∞</div>
                <div className="text-gray-400 text-sm">Style</div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Products Section */}
        <section id="products-section" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fadeInUp">
                Latest Collection
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fadeInUp animation-delay-200">
                Discover our newest drops. Each piece is carefully crafted and limited in quantity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-3xl border border-gray-800 p-8 hover:border-white/30 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/5 animate-fadeInUp"
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <div className="relative mb-6 overflow-hidden rounded-2xl">
                    <img
                      src={product.image || logo}
                      alt={product.name}
                      className="w-full h-80 object-cover cursor-pointer group-hover:scale-110 transition-transform duration-700"
                      onClick={() => setSelectedProduct(product)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Enhanced Tags */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30">
                        {product.tag || 'New Drop'}
                      </span>
                      <span className={`px-3 py-1 text-white text-sm font-semibold rounded-full border border-white/30 backdrop-blur-sm ${
                        getTotalStock(product) > 10 ? 'bg-green-500/20' : 'bg-yellow-500/20'
                      }`}>
                        {getTotalStock(product) > 10 ? 'In Stock' : 'Low Stock'}
                      </span>
                    </div>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="px-6 py-3 bg-white text-black font-semibold rounded-full transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors duration-300">{product.name}</h3>
                  <p className="text-gray-400 mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
                  
                  {/* Enhanced Product Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-white">${product.price}</span>
                      <span className="text-gray-400 text-sm bg-gray-800/50 px-3 py-1 rounded-full">
                        {getTotalStock(product)} left
                      </span>
                    </div>

                    {/* Enhanced Available Sizes */}
                    {product.sizes && (
                      <div>
                        <p className="text-gray-400 text-xs mb-3 font-medium">Available Sizes:</p>
                        <div className="flex flex-wrap gap-2">
                          {getAvailableSizes(product).map(size => (
                            <span key={size} className="px-3 py-1 bg-white/10 text-white text-sm rounded-full border border-white/20">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Enhanced Material & Care */}
                    {product.material && (
                      <div className="text-xs text-gray-500 bg-gray-800/30 p-3 rounded-lg">
                        <p><strong className="text-gray-300">Material:</strong> {product.material}</p>
                        {product.care && <p><strong className="text-gray-300">Care:</strong> {product.care}</p>}
                      </div>
                    )}
                  </div>

                  <button
                    className={`w-full px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                      added === product.id
                        ? 'bg-green-500 text-white shadow-lg'
                        : getTotalStock(product) === 0
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-white hover:bg-gray-100 text-black shadow-lg'
                    }`}
                    onClick={() => handleBuy(product)}
                    disabled={added === product.id || getTotalStock(product) === 0}
                  >
                    {added === product.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Added to Cart</span>
                      </div>
                    ) : getTotalStock(product) === 0 ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Out of Stock</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                        </svg>
                        <span>Add to Cart</span>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Drop System Info */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-3xl border border-gray-800 p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fadeInUp">
                  Our Drop System
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fadeInUp animation-delay-200 leading-relaxed">
                  We release limited quantities of each design. Once they're gone, they're gone forever. 
                  This creates exclusivity and ensures you're wearing something truly unique.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-white font-bold text-2xl">1</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-4">Limited Release</h3>
                  <p className="text-gray-400 leading-relaxed">Small batch production ensures exclusivity and quality control.</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-white font-bold text-2xl">2</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-4">Quick Sellout</h3>
                  <p className="text-gray-400 leading-relaxed">High demand means fast action. Don't miss your chance to own exclusive pieces.</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-white font-bold text-2xl">3</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-4">Exclusive Style</h3>
                  <p className="text-gray-400 leading-relaxed">You own something rare. Each piece tells a story of individuality and style.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Newsletter Section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-3xl border border-gray-800 p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fadeInUp">
                  Stay in the Loop
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fadeInUp animation-delay-200 leading-relaxed">
                  Be the first to know about new drops, exclusive releases, and special offers. 
                  Join our community of streetwear enthusiasts.
                </p>
              </div>

              {emailSubmitted ? (
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 animate-fadeInUp max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-white text-2xl font-bold">Welcome to the family!</span>
                  </div>
                  <p className="text-gray-300 text-center">You'll be the first to know about our next drop. Get ready for exclusive access!</p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="max-w-2xl mx-auto animate-fadeInUp animation-delay-400">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Subscribing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          <span>Subscribe</span>
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              )}

              <p className="text-gray-400 text-center mt-6 animate-fadeInUp animation-delay-600">
                No spam, just pure streetwear culture. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-3xl border border-gray-800 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-3xl font-bold text-white">{selectedProduct.name}</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-white transition-colors duration-300 p-2 hover:bg-white/10 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Product Image */}
              <div className="relative">
                <img
                  src={selectedProduct.image || logo}
                  alt={selectedProduct.name}
                  className="w-full h-96 object-cover rounded-2xl"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30">
                    {selectedProduct.tag || 'New Drop'}
                  </span>
                </div>
              </div>

              {/* Enhanced Product Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-bold text-xl mb-3">Description</h4>
                  <p className="text-gray-400 leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-4xl font-bold text-white">${selectedProduct.price}</span>
                  <span className="text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full">
                    {getTotalStock(selectedProduct)} in stock
                  </span>
                </div>

                {/* Enhanced Size Selection */}
                {selectedProduct.sizes && (
                  <div>
                    <h4 className="text-white font-bold text-xl mb-4">Select Size</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(selectedProduct.sizes).map(([size, count]) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          disabled={count === 0}
                          className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            selectedSize === size
                              ? 'bg-white text-black shadow-lg'
                              : count > 0
                              ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                              : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-bold">{size}</div>
                            <div className="text-xs opacity-75">({count})</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Product Info */}
                {selectedProduct.material && (
                  <div className="bg-gray-800/30 p-4 rounded-xl">
                    <h4 className="text-white font-semibold mb-2">Product Details</h4>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p><strong className="text-gray-300">Material:</strong> {selectedProduct.material}</p>
                      {selectedProduct.care && <p><strong className="text-gray-300">Care:</strong> {selectedProduct.care}</p>}
                    </div>
                  </div>
                )}

                {/* Enhanced Add to Cart */}
                <button
                  onClick={() => handleBuy(selectedProduct, selectedSize)}
                  disabled={getTotalStock(selectedProduct) === 0 || (selectedProduct.sizes && !selectedSize)}
                  className="w-full px-8 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {getTotalStock(selectedProduct) === 0 ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Out of Stock</span>
                    </div>
                  ) : selectedProduct.sizes && !selectedSize ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Select Size</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      <span>Add to Cart</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YesPage;
