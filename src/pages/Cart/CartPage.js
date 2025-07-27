import React, { useContext } from 'react';
import { CartContext } from '../../App';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-800 p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8 tracking-tight">
            Your Cart
          </h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-2xl font-semibold text-white mb-4">Your cart is empty</p>
              <p className="text-gray-400 mb-8">Add some items to get started</p>
              <a 
                href="/home" 
                className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-gradient-to-r from-gray-800/50 to-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-white/30 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-white/5 rounded-xl flex items-center justify-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 object-contain" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300">
                            {item.name}
                          </h3>
                          <p className="text-gray-300 text-sm mt-1">
                            {item.description}
                          </p>
                          <div className="inline-block bg-white text-black text-xs font-bold px-3 py-1 rounded-full mt-2">
                            {item.tag}
                          </div>
                        </div>
                        
                        <button 
                          className="px-4 py-2 bg-transparent border border-white/20 hover:bg-white hover:text-black text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group-hover:border-white/40"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="border-t border-gray-700 pt-6 mt-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-semibold text-white">Total Items:</span>
                  <span className="text-2xl font-bold text-white">{cart.length}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 px-8 py-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-2xl">
                    Proceed to Checkout
                  </button>
                  <a 
                    href="/home" 
                    className="flex-1 px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
                  >
                    Continue Shopping
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
