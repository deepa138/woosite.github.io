import React from 'react';
import { Link } from 'react-router-dom';

const CartModal = ({ cartItems, handleQuantityChange, handleRemoveItem }) => {
  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md z-10" style={{ top: "50px" }}>
      <div className="p-4">
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center mb-4">
                <img src={item.images[0]?.src} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <div className="flex items-center">
                    <button
                      className="bg-gray-200 text-gray-700 py-1 px-2 rounded-l"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      -
                    </button>
                    <input type="number" value={item.quantity} className="w-8 text-center text-black" readOnly />
                    <button
                      className="bg-gray-200 text-gray-700 py-1 px-2 rounded-r"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-red-500">€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 ml-2"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-4 text-black">
                <span>Subtotal</span>
                <span>€{getTotal()}</span>
              </div>
              <div className="flex justify-between mb-4">
                <Link to="/cart" className="bg-gray-800 text-white py-2 px-4 rounded mr-2">
                  View Cart
                </Link>
                <Link to="/checkout" className="bg-black text-white py-2 px-4 rounded">
                  Checkout
                </Link>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default CartModal;
