import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import CartDropdown from './CartModal';

const Header = ({ cartItems, handleRemoveItem, handleQuantityChange }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Calculate total items in cart
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-gray-800 text-white py-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          My Shop
        </Link>
        <div className="flex items-center">
          <button className="relative" onClick={() => setIsCartOpen(!isCartOpen)}>
            <FontAwesomeIcon icon={faShoppingCart} className="text-2xl" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">{totalItems}</span>
          </button>
          {isCartOpen && <CartDropdown cartItems={cartItems} handleRemoveItem={handleRemoveItem} handleQuantityChange={handleQuantityChange} onClose={() => setIsCartOpen(false)} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
