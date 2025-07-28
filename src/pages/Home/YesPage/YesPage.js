import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
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

  // Get active products from admin context
  const activeProducts = getActiveProducts();

  useEffect(() => {
    setHideLogo(true);
    return () => setHideLogo(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gray-400/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo Animation */}
            <div className="mb-8 animate-float">
              <img src={logo} alt="Lost Brand" className="w-24 h-24 mx-auto" />
            </div>

            {/* Brand Name */}
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 animate-fadeInUp">
              LOST
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fadeInUp animation-delay-300">
              Urban fashion for the free spirit. Limited drops, unlimited style.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center animate-fadeInUp animation-delay-500">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Limited Drops</h3>
                <p className="text-gray-400">Exclusive releases that sell out fast</p>
              </div>

              <div className="text-center animate-fadeInUp animation-delay-700">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Premium Quality</h3>
                <p className="text-gray-400">Crafted with the finest materials</p>
              </div>

              <div className="text-center animate-fadeInUp animation-delay-900">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Urban Style</h3>
                <p className="text-gray-400">Designed for the modern street culture</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 animate-fadeInUp">
              Latest Collection
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 hover:border-white/20 transition-all duration-300 transform hover:scale-105 animate-fadeInUp"
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <div className="relative mb-4">
                    <img
                      src={product.image || logo}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-xl cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                        {product.tag}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-white text-sm font-semibold rounded-full ${
                        getTotalStock(product) > 10 ? 'bg-white/20' : 'bg-gray-400/20'
                      }`}>
                        {getTotalStock(product) > 10 ? 'In Stock' : 'Low Stock'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                  
                  {/* Product Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">${product.price}</span>
                      <span className="text-gray-400 text-sm">{getTotalStock(product)} left</span>
                    </div>

                    {/* Available Sizes */}
                    {product.sizes && (
                      <div>
                        <p className="text-gray-400 text-xs mb-2">Available Sizes:</p>
                        <div className="flex flex-wrap gap-1">
                          {getAvailableSizes(product).map(size => (
                            <span key={size} className="px-2 py-1 bg-white/10 text-white text-xs rounded">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Material & Care */}
                    {product.material && (
                      <div className="text-xs text-gray-500">
                        <p><strong>Material:</strong> {product.material}</p>
                        {product.care && <p><strong>Care:</strong> {product.care}</p>}
                      </div>
                    )}
                  </div>

                  <button
                    className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-gray-100 hover:shadow-2xl ${
                      added === product.id
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-white text-black shadow-lg'
                    }`}
                    onClick={() => handleBuy(product)}
                    disabled={added === product.id || getTotalStock(product) === 0}
                  >
                    {added === product.id ? 'Added to Cart' : 
                     getTotalStock(product) === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Drop System Info */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fadeInUp">
                Our Drop System
              </h2>
              <p className="text-lg text-gray-300 mb-8 animate-fadeInUp animation-delay-200">
                We release limited quantities of each design. Once they're gone, they're gone forever. 
                This creates exclusivity and ensures you're wearing something truly unique.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Limited Release</h3>
                  <p className="text-gray-400 text-sm">Small batch production</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Quick Sellout</h3>
                  <p className="text-gray-400 text-sm">High demand, fast action</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Exclusive Style</h3>
                  <p className="text-gray-400 text-sm">You own something rare</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fadeInUp">
                Stay in the Loop
              </h2>
              <p className="text-lg text-gray-300 mb-8 animate-fadeInUp animation-delay-200">
                Be the first to know about new drops, exclusive releases, and special offers. 
                Join our community of streetwear enthusiasts.
              </p>

              {emailSubmitted ? (
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6 animate-fadeInUp">
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white text-lg font-semibold">Welcome to the family!</span>
                  </div>
                  <p className="text-gray-300 mt-2">You'll be the first to know about our next drop.</p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto animate-fadeInUp animation-delay-400">
                  <div className="flex space-x-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Subscribing...
                        </div>
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </div>
                </form>
              )}

              <p className="text-gray-400 text-sm mt-4 animate-fadeInUp animation-delay-600">
                No spam, just pure streetwear culture. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">{selectedProduct.name}</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image */}
              <div>
                <img
                  src={selectedProduct.image || logo}
                  alt={selectedProduct.name}
                  className="w-full h-80 object-cover rounded-xl"
                />
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Description</h4>
                  <p className="text-gray-400 text-sm">{selectedProduct.description}</p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-white">${selectedProduct.price}</span>
                  <span className="text-gray-400 text-sm">{getTotalStock(selectedProduct)} in stock</span>
                </div>

                {/* Size Selection */}
                {selectedProduct.sizes && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Select Size</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(selectedProduct.sizes).map(([size, count]) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          disabled={count === 0}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            selectedSize === size
                              ? 'bg-white text-black'
                              : count > 0
                              ? 'bg-white/10 text-white hover:bg-white/20'
                              : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {size} ({count})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Info */}
                {selectedProduct.material && (
                  <div className="text-sm text-gray-400">
                    <p><strong>Material:</strong> {selectedProduct.material}</p>
                    {selectedProduct.care && <p><strong>Care:</strong> {selectedProduct.care}</p>}
                  </div>
                )}

                {/* Add to Cart */}
                <button
                  onClick={() => handleBuy(selectedProduct, selectedSize)}
                  disabled={getTotalStock(selectedProduct) === 0 || (selectedProduct.sizes && !selectedSize)}
                  className="w-full px-6 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {getTotalStock(selectedProduct) === 0 ? 'Out of Stock' : 
                   selectedProduct.sizes && !selectedSize ? 'Select Size' : 'Add to Cart'}
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
