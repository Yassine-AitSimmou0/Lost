import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './pages/layout/Header';
import Footer from './pages/layout/Footer';

import NoturePage from './pages/Noturepage/NorurePlace';
import CartPage from './pages/Cart/CartPage';
import ContactPage from './pages/Contact/ContactPage';
import LostQ from './pages/LostQ/LostQ';
import YesPage from './pages/Home/YesPage/YesPage';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import { Navigate } from 'react-router-dom';

// Context to control header logo visibility
export const LogoAnimationContext = createContext({ hideLogo: false, setHideLogo: () => {} });

// Cart context for global cart state
export const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedItems, setSavedItems] = useState(() => {
    try {
      const stored = localStorage.getItem('savedItems');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Add to cart with quantity support
  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Update quantity of a specific item
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => 
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item completely from cart
  const removeFromCart = (id) => setCart((prev) => prev.filter(p => p.id !== id));

  // Clear entire cart
  const clearCart = () => setCart([]);

  // Save item for later (move from cart to saved items)
  const saveForLater = (id) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      setSavedItems(prev => {
        const existingItem = prev.find(savedItem => savedItem.id === id);
        if (existingItem) {
          return prev; // Item already saved
        }
        return [...prev, { ...item, quantity: 1 }]; // Reset quantity to 1 for saved items
      });
      removeFromCart(id);
    }
  };

  // Move item from saved to cart
  const moveToCart = (id) => {
    const item = savedItems.find(item => item.id === id);
    if (item) {
      addToCart(item);
      setSavedItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Remove item from saved items
  const removeFromSaved = (id) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  // Clear all saved items
  const clearSavedItems = () => setSavedItems([]);

  // Calculate cart totals
  const getCartTotals = () => {
    const subtotal = cart.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
    
    const tax = subtotal * 0.08; // 8% tax rate
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + tax + shipping;
    
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      itemCount: cart.reduce((count, item) => count + (item.quantity || 1), 0)
    };
  };

  // Persist cart and saved items to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
  }, [savedItems]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      savedItems,
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart,
      saveForLater,
      moveToCart,
      removeFromSaved,
      clearSavedItems,
      getCartTotals
    }}>
      {children}
    </CartContext.Provider>
  );
}

function AppRoutes() {
  const location = useLocation();
  const { hideLogo } = useContext(LogoAnimationContext);
  const answer = localStorage.getItem('lostq-answered');
  const isNo = answer === 'no';
  const isYes = answer === 'yes';
  // If not answered, always redirect to / (LostQ) except /noture and /login
  if (!answer && location.pathname !== '/' && location.pathname !== '/noture' && location.pathname !== '/login' && location.pathname !== '/signup') {
    return <Navigate to="/" replace />;
  }
  // If answered no, only allow /noture and /login
  if (isNo && location.pathname !== '/noture' && location.pathname !== '/login' && location.pathname !== '/signup') {
    return <Navigate to="/noture" replace />;
  }
  // If answered yes, allow all routes
  return (
    <>
      {location.pathname !== '/' && location.pathname !== '/noture' && <Header hideLogo={hideLogo} />}
      <Routes>
        <Route path="/" element={<LostQ />} />
        <Route path="/home" element={<YesPage />} />
        <Route path="/noture" element={<NoturePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {location.pathname !== '/' && location.pathname !== '/noture' && <Footer />}
    </>
  );
}

function App() {
  const [hideLogo, setHideLogo] = useState(false);
  return (
    <CartProvider>
      <LogoAnimationContext.Provider value={{ hideLogo, setHideLogo }}>
        <Router>
          <AppRoutes />
        </Router>
      </LogoAnimationContext.Provider>
    </CartProvider>
  );
}

export default App;
