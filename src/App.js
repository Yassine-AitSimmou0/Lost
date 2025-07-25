import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';

import { Header, Footer } from './components';

import {
  HomePage,
  NoturePage,
  ProductsPage,
  ProductPage,
  CartPage,
  ContactPage,
  YesPage
} from './pages';

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
        <Route path="/yes" element={<YesPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
