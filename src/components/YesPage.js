import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './YesPage.css';
import logo from '../Images/Mwader.png';

const products = [
  {
    id: 1,
    name: 'Mystic Hat',
    description: 'A hat for the truly lost wanderer.',
    image: logo,
  },
  {
    id: 2,
    name: 'Shadow Flask',
    description: 'A flask that holds secrets — and tea.',
    image: logo,
  },
  {
    id: 3,
    name: 'Lost Hoodie',
    description: 'Cozy darkness to wear everywhere.',
    image: logo,
  },
];

const YesPage = () => {
  return (
    <div className="yespage">
      <Header />
      <main className="yespage-content">
        <h1 className="yespage-text">Welcome to the Lost Zone 🌀</h1>
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} className="product-img" />
              <h2 className="product-name">{product.name}</h2>
              <p className="product-desc">{product.description}</p>
              <button className="buy-btn">Buy</button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default YesPage;
