import React from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css';
import logo from '../../assets/images/Mwader.png';

const ProductPage = () => {
  const { id } = useParams();

  return (
    <div className="product-detail">
      <img src={logo} alt="Product" />
      <h1>Product #{id}</h1>
      <p>Details about product {id} will go here.</p>
      <button className="buy-btn">Add to Cart</button>
    </div>
  );
};

export default ProductPage;
