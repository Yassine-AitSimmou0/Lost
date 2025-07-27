import React, { useContext } from 'react';
import { CartContext } from '../../App';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  return (
    <div className="cartpage">
      <div className="main-card cart-card">
        <h1 className="cart-title">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="cart-empty">Your cart is empty.</div>
        ) : (
          <div className="cart-list">
            {cart.map((item, idx) => (
              <div className="cart-item" key={idx}>
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-desc">{item.description}</div>
                  <div className="cart-item-tag">{item.tag}</div>
                  <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
