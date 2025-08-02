import React, { useContext, useState } from 'react';
import { CartContext } from '../../App';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const { 
    cart, 
    savedItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    saveForLater,
    moveToCart,
    removeFromSaved,
    clearSavedItems,
    getCartTotals 
  } = useContext(CartContext);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const totals = getCartTotals();

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    // Simple promo code logic - you can enhance this
    if (promoCode.toLowerCase() === 'save10') {
      setPromoApplied(true);
    }
  };

  if (cart.length === 0 && savedItems.length === 0) {
    return (
      <div className="cartpage">
        <div className="main-card cart-card">
          <div className="cart-empty-state">
            <div className="empty-cart-icon">🛒</div>
            <h1 className="cart-title">Your Cart is Empty</h1>
            <p className="empty-cart-message">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/home" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cartpage">
      <div className="cart-container">
        {/* Cart Items Section */}
        <div className="cart-items-section">
          {cart.length > 0 && (
            <>
              <div className="cart-header">
                <h1 className="cart-title">Shopping Cart ({totals.itemCount} items)</h1>
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
              
              <div className="cart-list">
                {cart.map((item, idx) => (
                  <div className="cart-item" key={idx}>
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <div className="cart-item-info">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <p className="cart-item-desc">{item.description}</p>
                        <div className="cart-item-tag">{item.tag}</div>
                      </div>
                      
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                          >
                            -
                          </button>
                          <span className="quantity-display">{item.quantity || 1}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="item-price">
                          ${((item.price || 29.99) * (item.quantity || 1)).toFixed(2)}
                        </div>
                        
                        <div className="item-actions-group">
                          <button 
                            className="save-for-later-btn" 
                            onClick={() => saveForLater(item.id)}
                            title="Save for later"
                          >
                            💾
                          </button>
                          <button 
                            className="cart-remove-btn" 
                            onClick={() => removeFromCart(item.id)}
                            title="Remove item"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Saved Items Section */}
          {savedItems.length > 0 && (
            <>
              <div className="saved-items-section">
                <div className="saved-header">
                  <h2 className="saved-title">Saved for Later ({savedItems.length} items)</h2>
                  <button className="clear-saved-btn" onClick={clearSavedItems}>
                    Clear All
                  </button>
                </div>
                
                <div className="saved-list">
                  {savedItems.map((item, idx) => (
                    <div className="saved-item" key={idx}>
                      <img src={item.image} alt={item.name} className="saved-item-img" />
                      <div className="saved-item-details">
                        <div className="saved-item-info">
                          <h3 className="saved-item-name">{item.name}</h3>
                          <p className="saved-item-desc">{item.description}</p>
                          <div className="saved-item-tag">{item.tag}</div>
                          <div className="saved-item-price">${(item.price || 29.99).toFixed(2)}</div>
                        </div>
                        
                        <div className="saved-item-actions">
                          <button 
                            className="move-to-cart-btn" 
                            onClick={() => moveToCart(item.id)}
                          >
                            Add to Cart
                          </button>
                          <button 
                            className="remove-saved-btn" 
                            onClick={() => removeFromSaved(item.id)}
                            title="Remove from saved"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Cart Summary Section - Only show if cart has items */}
        {cart.length > 0 && (
          <div className="cart-summary-section">
            <div className="cart-summary">
              <h2 className="summary-title">Order Summary</h2>
              
              {/* Promo Code */}
              <form className="promo-form" onSubmit={handlePromoSubmit}>
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="promo-input"
                />
                <button type="submit" className="promo-btn">Apply</button>
              </form>
              
              {promoApplied && (
                <div className="promo-applied">
                  ✅ Promo code "SAVE10" applied!
                </div>
              )}

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>${totals.subtotal}</span>
                </div>
                <div className="price-row">
                  <span>Tax:</span>
                  <span>${totals.tax}</span>
                </div>
                <div className="price-row">
                  <span>Shipping:</span>
                  <span>{totals.shipping === 0 ? 'FREE' : `$${totals.shipping}`}</span>
                </div>
                {promoApplied && (
                  <div className="price-row discount">
                    <span>Discount (10%):</span>
                    <span>-${(totals.subtotal * 0.1).toFixed(2)}</span>
                  </div>
                )}
                <hr className="price-divider" />
                <div className="price-row total">
                  <span>Total:</span>
                  <span>${promoApplied ? (totals.total * 0.9).toFixed(2) : totals.total}</span>
                </div>
              </div>

              {/* Free Shipping Banner */}
              {totals.subtotal < 50 && (
                <div className="free-shipping-banner">
                  Add ${(50 - totals.subtotal).toFixed(2)} more for FREE shipping!
                </div>
              )}

              {/* Action Buttons */}
              <div className="cart-actions">
                <button className="checkout-btn">
                  Proceed to Checkout
                </button>
                <Link to="/home" className="continue-shopping-link">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
