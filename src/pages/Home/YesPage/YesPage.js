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
  },
  {
    id: 2,
    name: 'Cargo Pants',
    description: 'Loose fit, deep pockets, ready for any city adventure.',
    image: logo,
    tag: 'Limited Edition',
    stock: 3,
  },
  {
    id: 3,
    name: 'Shadow Jacket',
    description: 'Boxy, cropped, and built for the night. No limits.',
    image: logo,
    tag: 'Limited Edition',
    stock: 3,
  },
];

const YesPage = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [added, setAdded] = useState(null);
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

  return (
    <div className="yespage">
      <main className={`yespage-content fadein-yespage${fadeIn ? ' show' : ''}`}>
        <div className="main-card urban-vibe">
          <h1 className="yespage-text urban-title">Welcome to the Lost Zone <span className="urban-free">— Urban Free Vibes</span></h1>
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card urban-card" key={product.id}>
                <div className="product-img urban-img">
                  <img src={product.image} alt={product.name} className="urban-logo-img" />
                </div>
                <div className="urban-tag">{product.tag}</div>
                <h2 className="product-name urban-name">{product.name}</h2>
                <p className="product-desc urban-desc">{product.description}</p>
                <div className="urban-stock">{product.stock} pcs available</div>
                <button className="buy-btn urban-btn" onClick={() => handleBuy(product)}>
                  {added === product.id ? 'Added!' : 'Buy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default YesPage;
