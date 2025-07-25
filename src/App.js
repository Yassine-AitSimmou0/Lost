import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/Home/HomePage';
import NoturePage from './pages/Noture/NoturePage';
import ProductsPage from './pages/Products/ProductsPage';
import ProductPage from './pages/Product/ProductPage';
import CartPage from './pages/Cart/CartPage';
import ContactPage from './pages/Contact/ContactPage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/noture" element={<NoturePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
