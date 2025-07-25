import React from 'react';
import './ProductsPage.css';
import logo from '../../assets/images/Mwader.png';
import { Link } from 'react-router-dom';

const products = [
  { id: 1, name: 'Mystic Hat', desc: 'A mysterious hat.', image: logo },
  { id: 2, name: 'Shadow Flask', desc: 'A dark drink container.', image: logo },
  { id: 3, name: 'Lost Hoodie', desc: 'Warm and invisible.', image: logo },
];

const ProductsPage = () => (
  <div className="products-page">
    {products.map((p) => (
      <div className="product-card" key={p.id}>
        <img src={p.image} alt={p.name} />
        <h2>{p.name}</h2>
        <p>{p.desc}</p>
        <Link to={`/product/${p.id}`} className="view-btn">View</Link>
      </div>
    ))}
  </div>
);

export default ProductsPage;
