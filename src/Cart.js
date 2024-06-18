import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CartDropdown from './CartModal'; // Import the CartDropdown component

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (productId, amount) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + amount;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center border p-4 rounded-md">
                <img src={item.images[0]?.src} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-red-500">€{item.price}</p>
                  <div className="flex items-center mt-2">
                    <button
                      className="bg-gray-200 text-gray-700 py-1 px-3 rounded-l"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      -
                    </button>
                    <input type="number" value={item.quantity} className="w-12 text-center" readOnly />
                    <button
                      className="bg-gray-200 text-gray-700 py-1 px-3 rounded-r"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded ml-4"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="text-right">
              <p className="text-gray-700 text-lg">Total: €{getTotal()}</p>
              <div className="flex justify-end mt-4">
                <Link to="/" className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
                  Back to Shopping
                </Link>
               <Link to="/checkout" ><button className="bg-green-500 text-white py-2 px-4 rounded">
                  Checkout
                </button></Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
      {/* Add CartDropdown component and pass the necessary props */}
      <CartDropdown 
        cartItems={cartItems} 
        onClose={() => {}} 
        handleQuantityChange={handleQuantityChange} 
        handleRemoveItem={handleRemoveItem} 
      />
    </div>
  );
};

export default Cart;
