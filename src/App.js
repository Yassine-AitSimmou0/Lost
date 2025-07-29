import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Header from './pages/layout/Header';
import Footer from './pages/layout/Footer';

import NoturePage from './pages/Noturepage/NorurePlace';
import CartPage from './pages/Cart/CartPage';
import ContactPage from './pages/Contact/ContactPage';
import LostQ from './pages/LostQ/LostQ';
import YesPage from './pages/Home/YesPage/YesPage';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import MaintenancePage from './pages/Maintenance/MaintenancePage';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminProvider } from './context/AdminContext';
import { registerServiceWorker, monitorPerformance } from './utils/performance';

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
  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (id) => setCart((prev) => prev.filter(p => p.id !== id));
  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

function AppRoutes() {
  const location = useLocation();
  const { hideLogo } = useContext(LogoAnimationContext);
  const answer = localStorage.getItem('lostq-answered');
  const isNo = answer === 'no';
  
  // Check website status from localStorage
  const websiteOnline = localStorage.getItem('websiteOnline') !== 'false'; // Default to online
  
  // Admin routes don't need the LostQ logic and are always accessible
  if (location.pathname.startsWith('/admin')) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    );
  }
  
  // If website is offline, show maintenance page for all non-admin routes
  if (!websiteOnline) {
    return <MaintenancePage />;
  }
  
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
  
  // Register service worker and performance monitoring
  useEffect(() => {
    registerServiceWorker();
    monitorPerformance();
  }, []);
  
  return (
    <HelmetProvider>
      <AdminProvider>
        <CartProvider>
          <LogoAnimationContext.Provider value={{ hideLogo, setHideLogo }}>
            <Router>
              <AppRoutes />
            </Router>
          </LogoAnimationContext.Provider>
        </CartProvider>
      </AdminProvider>
    </HelmetProvider>
  );
}

export default App;
